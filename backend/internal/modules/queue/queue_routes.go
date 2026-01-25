package queue

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func NewQueueRoutes(db *sql.DB, api fiber.Router) {
	repo := NewQueueRepository(db)
	svc := NewQueueService(&repo)
	handler := NewQueueHandler(svc)

	queue := api.Group("/queue")
	queue.Post("", handler.Create)
	queue.Get("", handler.FindMyQueue)
}
