package server

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
	"github.com/wafi11/lms/backend/internal/modules/music"
	"github.com/wafi11/lms/backend/internal/modules/queue"
)

func RouteHealthCheck(app *fiber.App, db *sql.DB) {
	app.Get("/health", func(c *fiber.Ctx) error {
		if err := db.Ping(); err != nil {
			return c.Status(503).JSON(fiber.Map{
				"status":   "error",
				"database": "disconnected",
				"error":    err.Error(),
			})
		}

		return c.JSON(fiber.Map{
			"status":   "ok",
			"database": "connected",
			"message":  "Service is healthy",
		})
	})

}

func NewRoutes(app fiber.Router, db *sql.DB) {
	music.SongRoutes(db, app)
	queue.NewQueueRoutes(db, app)
}
