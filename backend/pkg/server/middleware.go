package server

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/wafi11/lms/backend/pkg/middlewares"
)

func Middlewares(app *fiber.App) {
	app.Use(middlewares.CustomLogger(middlewares.LoggerConfig{
		Skip: func(c *fiber.Ctx) bool {
			return c.Path() == "/health" || c.Path() == "/ping"
		},
		LogErrors: true,
		CustomFormat: func(c *fiber.Ctx, duration time.Duration, statusCode int) string {
			return fmt.Sprintf("[%s] %s %d - %v - User-Agent: %s",
				c.Method(),
				c.Path(),
				statusCode,
				duration,
				c.Get("User-Agent"),
			)
		},
	}))
}
