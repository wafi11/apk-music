package queue

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/wafi11/lms/backend/pkg/types"
)

type QueueRepository struct {
	DB *sql.DB
}

func NewQueueRepository(db *sql.DB) QueueRepository {
	return QueueRepository{DB: db}
}
func (r *QueueRepository) CreateQueueWithItems(c context.Context, userId string, albumName string) error {
	tx, err := r.DB.BeginTx(c, nil)
	if err != nil {
		log.Printf("failed to begin transaction: %s", err.Error())
		return fmt.Errorf("failed to begin transaction")
	}
	defer tx.Rollback()

	// Delete existing queue
	queryDelete := `DELETE FROM queue WHERE user_id = $1`
	_, err = tx.ExecContext(c, queryDelete, userId)
	if err != nil {
		log.Printf("failed to delete queue: %s", err.Error())
		return fmt.Errorf("failed to delete existing queue")
	}

	// Get song IDs from album (validasi sekaligus)
	var songIds []int
	querySelectSongs := `SELECT id FROM songs WHERE LOWER(album) = LOWER($1) ORDER BY id`
	rows, err := tx.QueryContext(c, querySelectSongs, albumName)
	if err != nil {
		log.Printf("failed to query songs: %s", err.Error())
		return fmt.Errorf("failed to query songs")
	}
	defer rows.Close()

	for rows.Next() {
		var songId int
		if err := rows.Scan(&songId); err != nil {
			log.Printf("failed to scan song: %s", err.Error())
			return fmt.Errorf("failed to scan song")
		}
		songIds = append(songIds, songId)
	}

	if err := rows.Err(); err != nil {
		log.Printf("error iterating rows: %s", err.Error())
		return fmt.Errorf("error reading songs")
	}

	if len(songIds) == 0 {
		return fmt.Errorf("no songs found in album")
	}

	// Insert new queue
	queryInsert := `
		INSERT INTO queue (user_id, created_at, updated_at) 
		VALUES ($1, $2, $3)
		RETURNING id
	`
	var queueId int
	err = tx.QueryRowContext(c, queryInsert, userId, time.Now(), time.Now()).Scan(&queueId)
	if err != nil {
		log.Printf("failed to create queue: %s", err.Error())
		return fmt.Errorf("failed to create queue")
	}

	// ✨ BULK INSERT - Lebih Efisien
	if err := r.bulkInsertQueueItems(c, tx, songIds, queueId); err != nil {
		return err
	}

	// Commit transaction
	if err = tx.Commit(); err != nil {
		log.Printf("failed to commit transaction: %s", err.Error())
		return fmt.Errorf("failed to commit transaction")
	}

	return nil
}

// Create - jika hanya ingin membuat queue kosong
func (r *QueueRepository) Create(c context.Context, userId string) (int, error) {
	tx, err := r.DB.BeginTx(c, nil)
	if err != nil {
		log.Printf("failed to begin transaction: %s", err.Error())
		return 0, fmt.Errorf("failed to begin transaction")
	}
	defer tx.Rollback()

	queryDelete := `DELETE FROM queue WHERE user_id = $1`
	_, err = tx.ExecContext(c, queryDelete, userId)
	if err != nil {
		log.Printf("failed to delete queue: %s", err.Error())
		return 0, fmt.Errorf("failed to delete existing queue")
	}

	queryInsert := `
		INSERT INTO queue (user_id, created_at, updated_at) 
		VALUES ($1, $2, $3)
		RETURNING id
	`
	var queueId int
	err = tx.QueryRowContext(c, queryInsert, userId, time.Now(), time.Now()).Scan(&queueId)
	if err != nil {
		log.Printf("failed to create queue: %s", err.Error())
		return 0, fmt.Errorf("failed to create queue")
	}

	if err = tx.Commit(); err != nil {
		log.Printf("failed to commit transaction: %s", err.Error())
		return 0, fmt.Errorf("failed to commit transaction")
	}

	return queueId, nil
}

func (r *QueueRepository) FindMyQueue(c context.Context, userId string) ([]types.MyQueue, error) {
	query := `
		SELECT 
			qi.id,
			qi.order,
			s.title,
			s.image,
			s.duration,
			s.url
			FROM queue_items qi
			LEFT JOIN queue q on q.id = qi.queue_id
			LEFT JOIN songs s on s.id = qi.song_id
			WHERE q.user_id = $1
			ORDER BY qi.order ASC 
	`
	rst, err := r.DB.QueryContext(c, query, userId)
	if err != nil {
		log.Printf("error : %s", err.Error())
		return nil, fmt.Errorf("faield to find queue")
	}

	var results []types.MyQueue
	defer rst.Close()
	for rst.Next() {
		var result types.MyQueue

		err = rst.Scan(&result.QueueItemsId, &result.QueueItemsOrder,
			&result.SongName, &result.SongImage, &result.SongDuration, &result.SongUrlStreaming)

		if err != nil {
			log.Printf("failed to scan queueItems : %s", err.Error())
			return nil, fmt.Errorf("queue items not found")
		}

		results = append(results, result)
	}

	return results, nil

}
