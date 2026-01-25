package usecase

import (
	"context"
	"database/sql"
	"log"
	"time"

	"github.com/robfig/cron/v3"
)

func StartScheduledUpdates(db *sql.DB) {
	c := cron.New()
	// running every 4 hours
	c.AddFunc("*/1 * * * *", func() {
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Minute)
		defer cancel()

		log.Println("Starting scheduled streaming URL update...")

		// batch 1, 1 workers
		BatchUpdateStreaming(ctx, db, 1, 1)
		// 2 req/sec
		_ = NewRateLimiter(2)
		// 500ms delay
		time.Sleep(500 * time.Millisecond)

	})

	c.Start()
	log.Println("Cron scheduler started - running every 5 minutes")
}
