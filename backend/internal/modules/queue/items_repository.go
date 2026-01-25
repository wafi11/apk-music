package queue

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strings"
	"time"
)

func (repo *QueueRepository) bulkInsertQueueItems(c context.Context, tx *sql.Tx, songIds []int, queueId int) error {
	if len(songIds) == 0 {
		return nil
	}

	// Build bulk insert query
	valueStrings := make([]string, 0, len(songIds))
	valueArgs := make([]interface{}, 0, len(songIds)*4)
	now := time.Now()

	for i, songId := range songIds {
		valueStrings = append(valueStrings, fmt.Sprintf("($%d, $%d, $%d, $%d)",
			i*4+1, i*4+2, i*4+3, i*4+4))
		valueArgs = append(valueArgs, queueId, songId, i, now)
	}

	query := fmt.Sprintf(`
		INSERT INTO queue_items (queue_id, song_id, "order", created_at) 
		VALUES %s
	`, strings.Join(valueStrings, ","))

	_, err := tx.ExecContext(c, query, valueArgs...)
	if err != nil {
		log.Printf("failed to insert queue items: %s", err.Error())
		return fmt.Errorf("failed to insert queue items")
	}

	return nil

}
