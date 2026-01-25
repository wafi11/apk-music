package music

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/lib/pq"
	"github.com/wafi11/lms/backend/pkg/response"
	"github.com/wafi11/lms/backend/pkg/types"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) MusicRepository {
	return &Repository{db: db}
}

func (r *Repository) Create(c context.Context, req types.Music) error {

	queryInsertArtist := `
		insert into artist (name) values ($1) ON CONFLICT (name) DO NOTHING
	`

	_, err := r.db.ExecContext(c, queryInsertArtist, req.Artist)
	if err != nil {
		log.Printf("failed to insert artist: %s", err.Error())
		return fmt.Errorf("failed to insert artist: %w", err)
	}

	r.CreateAlbums(c, *req.Album, req.Artist, nil)

	query := `
		insert into songs (
			title,
			artist,
			album,
			duration,
			image,
			url,
			url_spotify,
			url_yt,
			created_at,
			updated_at
		) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
	`

	_, err = r.db.ExecContext(c, query, req.Title, req.Artist, req.Album, req.Duration, req.Image, req.Url, req.UrlSpotify, req.UrlYt, time.Now(), time.Now())
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code {
			case "22001":
				return fmt.Errorf("artist value to long: %w", types.ErrArtistValueToLong)
			case "23503":
				return fmt.Errorf("invalid reference: %w", err)
			case "23502":
				return fmt.Errorf("required field missing: %s", pqErr.Column)
			default:
				log.Printf("database error [%s]: %v", pqErr.Code, err)
			}
		}
		log.Printf("err = %s", err.Error())
		return fmt.Errorf("failed to create music")
	}

	return nil
}

func (r *Repository) FindAllSongs(c context.Context, limit, page int, search string) ([]types.Music, int, error) {
	var args []interface{}
	var addedWhere string

	// Build WHERE clause
	if search != "" {
		addedWhere = "WHERE LOWER(title) LIKE LOWER($1)"
		args = append(args, "%"+search+"%")
	}

	// Calculate offset untuk pagination
	offset := page

	// Build query dengan WHERE dan LIMIT/OFFSET
	query := fmt.Sprintf(`
		SELECT id, title,url, duration, artist, album, image, created_at, updated_at
		FROM songs
		%s
		ORDER BY created_at DESC
		LIMIT $%d OFFSET $%d
	`, addedWhere, len(args)+1, len(args)+2)

	// Tambahkan limit dan offset ke args
	args = append(args, limit, offset)

	// Execute query
	rst, err := r.db.QueryContext(c, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query songs: %w", err)
	}
	defer rst.Close()

	// Scan results
	var songs []types.Music
	for rst.Next() {
		var song types.Music
		err := rst.Scan(
			&song.ID,
			&song.Title,
			&song.Url,
			&song.Duration,
			&song.Artist,
			&song.Album,
			&song.Image,
			&song.CreatedAt,
			&song.UpdatedAt,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan song: %w", err)
		}
		songs = append(songs, song)
	}

	if err := rst.Err(); err != nil {
		return nil, 0, fmt.Errorf("error iterating rows: %w", err)
	}

	// find total records
	total, err := r.CountTotal(c, addedWhere, search)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count songs: %w", err)
	}

	return songs, total, nil
}

func (r *Repository) CountTotal(c context.Context, addedWhere, search string) (int, error) {
	// Get total count untuk pagination info
	var total int
	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM songs %s`, addedWhere)
	var countArgs []interface{}
	if search != "" {
		countArgs = append(countArgs, "%"+search+"%")
	}
	err := r.db.QueryRowContext(c, countQuery, countArgs...).Scan(&total)
	if err != nil {
		return 0, fmt.Errorf("failed to count songs: %w", err)
	}

	return total, nil
}
func (r *Repository) Search(c context.Context, req types.ListRequest, search string) (*types.ListSearchMusic, error) {
	// Decode cursor
	var cursor *types.Cursor
	var err error
	if req.Cursor != nil && *req.Cursor != "" {
		cursor, err = DecodeCursor(*req.Cursor)
		if err != nil {
			return nil, fmt.Errorf("invalid cursor: %w", err)
		}
	}

	// Prepare query parameters
	var createdAt *time.Time
	var cursorID int64

	if cursor != nil {
		createdAt = &cursor.CreatedAt
		cursorID = cursor.ID
	}

	// Build search pattern for ILIKE
	searchPattern := "%" + search + "%"

	query := `
		SELECT
			id,
			title,
			artist,
			image,
			created_at
		FROM songs
		WHERE 
			-- Search filter
			(title ILIKE $1 OR artist ILIKE $1 OR album ILIKE $1)
			-- Cursor-based pagination
			AND (
				$2::timestamp IS NULL 
				OR created_at < $2::timestamp
				OR (created_at = $2::timestamp AND id < $3)
			)
		ORDER BY created_at DESC, id DESC
		LIMIT $4
	`

	rows, err := r.db.QueryContext(c, query, searchPattern, createdAt, cursorID, req.Limit+1)
	if err != nil {
		return nil, fmt.Errorf("failed to query songs: %w", err)
	}
	defer rows.Close()

	songs := make([]types.SearchMusic, 0, req.Limit)
	for rows.Next() {
		var song types.SearchMusic

		err := rows.Scan(
			&song.ID,
			&song.Title,
			&song.Artist,
			&song.Image,
			&song.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan song: %w", err)
		}

		songs = append(songs, song)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating songs: %w", err)
	}

	// Check if there's more data
	hasMore := len(songs) > req.Limit
	if hasMore {
		songs = songs[:req.Limit]
	}

	// Generate next cursor
	var nextCursor *string
	if hasMore && len(songs) > 0 {
		lastSong := songs[len(songs)-1]
		cursor := types.Cursor{
			CreatedAt: lastSong.CreatedAt,
			ID:        int64(lastSong.ID),
		}
		encoded := cursor.Encode()
		nextCursor = &encoded
	}

	return &types.ListSearchMusic{
		Data: songs,
		Metadata: response.PaginationCursor{
			NextCursor: nextCursor,
			HasMore:    hasMore,
			Count:      len(songs),
		},
	}, nil
}

func (r *Repository) UpdateLinkUrlMusic(c context.Context, id int, url string) error {
	query := `
		update songs set url = $1 WHERE id = $2
	`
	_, err := r.db.ExecContext(c, query, url, id)
	if err != nil {
		log.Printf("failed to update song : %s", err.Error())
		return fmt.Errorf("song not found")
	}
	return nil
}

func (r *Repository) FindUrlYtMusic(c context.Context, id int) (string, error) {
	var url_yt string
	query := `
		select url_yt from songs where id = $1
	`
	err := r.db.QueryRowContext(c, query, id).Scan(&url_yt)
	if err != nil {
		log.Printf("failed to find song : %s", err.Error())
		return "", fmt.Errorf("song not found")
	}
	return url_yt, nil
}

func (r *Repository) FindSongById(c context.Context, songId int) (types.Music, error) {
	var song types.Music
	query := `
		select 
			id,
			title,
			duration,
			artist,
			album,
			image,
			created_at,
			updated_at,
			url 
		FROM songs where id = $1
	`

	err := r.db.QueryRowContext(c, query, song).Scan(&song.ID, &song.Title, &song.Duration, &song.Artist, &song.Album, &song.Image, &song.CreatedAt, &song.UpdatedAt, &song.Url)
	if err != nil {
		log.Printf("song not found : %s", err)
		return types.Music{}, fmt.Errorf("song not found")
	}

	return song, nil
}
func (r *Repository) FindSongByAlbum(c context.Context, albumName string) ([]types.Music, error) {
	query := `
		SELECT 
			id,
			title,
			duration,
			artist,
			album,
			image,
			created_at,
			updated_at,
			url 
		FROM songs 
		WHERE LOWER(album) = LOWER($1)
		ORDER BY created_at DESC
	`

	rows, err := r.db.QueryContext(c, query, albumName)
	if err != nil {
		log.Printf("failed to query songs by album: %s", err)
		return nil, fmt.Errorf("failed to query songs by album: %w", err)
	}
	defer rows.Close()

	var songs []types.Music
	for rows.Next() {
		var song types.Music
		err := rows.Scan(
			&song.ID,
			&song.Title,
			&song.Duration,
			&song.Artist,
			&song.Album,
			&song.Image,
			&song.CreatedAt,
			&song.UpdatedAt,
			&song.Url,
		)
		if err != nil {
			log.Printf("failed to scan song: %s", err)
			continue // Skip row yang error, lanjut ke row berikutnya
		}
		songs = append(songs, song)
	}

	// Check for errors from iterating over rows
	if err = rows.Err(); err != nil {
		log.Printf("error iterating rows: %s", err)
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	// Return empty slice jika tidak ada hasil (bukan error)
	if len(songs) == 0 {
		log.Printf("no songs found for album: %s", albumName)
		return []types.Music{}, nil
	}

	return songs, nil
}

func (r *Repository) FindSongByArtist(c context.Context, artist string) ([]types.Music, error) {
	query := `
		SELECT 
			id,
			title,
			duration,
			artist,
			album,
			image,
			created_at,
			updated_at,
			url 
		FROM songs 
		WHERE LOWER(artist) = LOWER($1)
		ORDER BY album, created_at DESC
	`

	rows, err := r.db.QueryContext(c, query, artist)
	if err != nil {
		log.Printf("failed to query songs by artist: %s", err)
		return nil, fmt.Errorf("failed to query songs by artist: %w", err)
	}
	defer rows.Close()

	var songs []types.Music
	for rows.Next() {
		var song types.Music
		err := rows.Scan(
			&song.ID,
			&song.Title,
			&song.Duration,
			&song.Artist,
			&song.Album,
			&song.Image,
			&song.CreatedAt,
			&song.UpdatedAt,
			&song.Url,
		)
		if err != nil {
			log.Printf("failed to scan song: %s", err)
			continue
		}
		songs = append(songs, song)
	}

	if err = rows.Err(); err != nil {
		log.Printf("error iterating rows: %s", err)
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	if len(songs) == 0 {
		log.Printf("no songs found for artist: %s", artist)
		return []types.Music{}, nil
	}

	return songs, nil
}
