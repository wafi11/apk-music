package usecase

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"sync"
	"time"
)

type SelectAllURLS struct {
	Id    int    `json:"id"`
	Url   string `json:"url"`
	UrlYt string `json:"url_yt"`
}

type UpdateResult struct {
	Id     int
	NewUrl string
	Error  error
}

// RateLimiter untuk kontrol request rate
type RateLimiter struct {
	ticker *time.Ticker
	mu     sync.Mutex
}

func NewRateLimiter(requestsPerSecond int) *RateLimiter {
	interval := time.Second / time.Duration(requestsPerSecond)
	return &RateLimiter{
		ticker: time.NewTicker(interval),
	}
}

func (rl *RateLimiter) Wait() {
	<-rl.ticker.C
}

func (rl *RateLimiter) Stop() {
	rl.ticker.Stop()
}

// BatchUpdateStreaming - Main function untuk batch update
func BatchUpdateStreaming(ctx context.Context, db *sql.DB, batchSize int, workerCount int) error {
	// 1. Fetch semua URL yang perlu di-update
	songs, err := selectAllUrlYtMusic(ctx, db)
	if err != nil {
		return fmt.Errorf("failed to fetch songs: %w", err)
	}

	if len(songs) == 0 {
		log.Println("No songs to update")
		return nil
	}

	log.Printf("Found %d songs to update", len(songs))

	// 2. Process dalam batch dengan worker pool
	return processBatchWithWorkers(ctx, db, songs, batchSize, workerCount)
}

// processBatchWithWorkers - Process songs dengan worker pool pattern
func processBatchWithWorkers(ctx context.Context, db *sql.DB, songs []SelectAllURLS, batchSize, workerCount int) error {
	// Channel untuk distribute pekerjaan
	jobs := make(chan SelectAllURLS, len(songs))
	results := make(chan UpdateResult, len(songs))

	// Rate limiter: maksimal 5 request per detik (sesuaikan dengan limit API Anda)
	rateLimiter := NewRateLimiter(5)
	defer rateLimiter.Stop()

	// WaitGroup untuk workers
	var wg sync.WaitGroup

	// Start workers
	for w := 1; w <= workerCount; w++ {
		wg.Add(1)
		go worker(ctx, w, jobs, results, &wg, rateLimiter)
	}

	// Send jobs ke workers
	go func() {
		for _, song := range songs {
			select {
			case <-ctx.Done():
				close(jobs)
				return
			case jobs <- song:
			}
		}
		close(jobs)
	}()

	// Close results channel setelah semua workers selesai
	go func() {
		wg.Wait()
		close(results)
	}()

	// Collect results dan update database dalam batch
	var successResults []UpdateResult
	var failedCount int

	for result := range results {
		if result.Error != nil {
			log.Printf("Failed to process song ID %d: %s", result.Id, result.Error)
			failedCount++
			continue
		}
		successResults = append(successResults, result)

		// Update database ketika batch size tercapai
		if len(successResults) >= batchSize {
			if err := batchUpdateDB(ctx, db, successResults); err != nil {
				log.Printf("Failed to batch update: %s", err)
			}
			successResults = successResults[:0] // Reset slice
		}
	}

	// Update sisa results yang belum di-batch
	if len(successResults) > 0 {
		if err := batchUpdateDB(ctx, db, successResults); err != nil {
			return fmt.Errorf("failed to update remaining batch: %w", err)
		}
	}

	log.Printf("Update completed. Success: %d, Failed: %d", len(songs)-failedCount, failedCount)
	return nil
}

// worker - Worker untuk process setiap song dengan rate limiting
func worker(ctx context.Context, id int, jobs <-chan SelectAllURLS, results chan<- UpdateResult, wg *sync.WaitGroup, rateLimiter *RateLimiter) {
	defer wg.Done()

	for song := range jobs {
		select {
		case <-ctx.Done():
			results <- UpdateResult{Id: song.Id, Error: ctx.Err()}
			return
		default:
			// Wait untuk rate limiter sebelum request
			rateLimiter.Wait()

			log.Printf("Worker %d processing song ID: %d", id, song.Id)

			// Download new URL dari YtMusic dengan retry mechanism
			newUrl, err := fetchNewStreamingUrlWithRetry(ctx, song.UrlYt, 3)
			results <- UpdateResult{
				Id:     song.Id,
				NewUrl: newUrl,
				Error:  err,
			}

			// Additional delay antar request untuk safety (200ms)
			time.Sleep(200 * time.Millisecond)
		}
	}
}

// fetchNewStreamingUrlWithRetry - Fetch URL dengan retry mechanism
func fetchNewStreamingUrlWithRetry(ctx context.Context, urlYt string, maxRetries int) (string, error) {
	var lastErr error

	for attempt := 1; attempt <= maxRetries; attempt++ {
		url, err := fetchNewStreamingUrl(ctx, urlYt)
		if err == nil {
			return url, nil
		}

		lastErr = err
		log.Printf("Attempt %d/%d failed for URL %s: %s", attempt, maxRetries, urlYt, err)

		if attempt < maxRetries {
			// Exponential backoff: 1s, 2s, 4s
			backoffTime := time.Duration(attempt) * time.Second
			log.Printf("Retrying in %v...", backoffTime)

			select {
			case <-ctx.Done():
				return "", ctx.Err()
			case <-time.After(backoffTime):
				// Continue to next retry
			}
		}
	}

	return "", fmt.Errorf("failed after %d attempts: %w", maxRetries, lastErr)
}

// fetchNewStreamingUrl - Fetch URL baru dari YtMusic API
func fetchNewStreamingUrl(ctx context.Context, urlYt string) (string, error) {
	ytMusic, err := DownloadYtMusic(ctx, urlYt)
	if err != nil {
		return "", fmt.Errorf("failed to download YtMusic: %w", err)
	}

	// if len(ytMusic.Resources) == 0 {
	// 	return "", fmt.Errorf("no resources found from YtMusic API")
	// }

	for _, resource := range ytMusic.Resources {
		if resource.DownloadMode == "check_download" && resource.Type == "audio" {
			if resource.DownloadUrl != "" {
				return resource.DownloadUrl, nil
			}
		}
	}

	return "", fmt.Errorf("no valid download URL found")
}

// batchUpdateDB - Update database dalam batch menggunakan prepared statement
func batchUpdateDB(ctx context.Context, db *sql.DB, results []UpdateResult) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	stmt, err := tx.PrepareContext(ctx, "UPDATE songs SET url = $1, updated_at = NOW() WHERE id = $2")
	if err != nil {
		return fmt.Errorf("failed to prepare statement: %w", err)
	}
	defer stmt.Close()

	successCount := 0
	for _, result := range results {
		_, err := stmt.ExecContext(ctx, result.NewUrl, result.Id)
		if err != nil {
			log.Printf("Failed to update song ID %d: %s", result.Id, err)
			continue
		}
		successCount++
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	log.Printf("Successfully updated %d/%d songs in database", successCount, len(results))
	return nil
}

// selectAllUrlYtMusic - Fetch semua URL dari database
func selectAllUrlYtMusic(ctx context.Context, db *sql.DB) ([]SelectAllURLS, error) {
	query := `SELECT id, url, url_yt FROM songs WHERE url_yt IS NOT NULL AND url_yt != ''`

	rows, err := db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query songs: %w", err)
	}
	defer rows.Close()

	var results []SelectAllURLS
	for rows.Next() {
		var result SelectAllURLS
		if err := rows.Scan(&result.Id, &result.Url, &result.UrlYt); err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		results = append(results, result)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return results, nil
}
