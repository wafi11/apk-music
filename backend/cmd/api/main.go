package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/wafi11/lms/backend/pkg/config"
	"github.com/wafi11/lms/backend/pkg/server"
)

func main() {
	// connection config
	cfg, err := config.LoadConfig()

	if err != nil {
		log.Printf("cannot read config.yaml")
	}

	// check connection database
	db, err := cfg.Database.Connect()
	if err != nil {
		log.Printf("failed to connect database")
	}

	// handling routes
	app := fiber.New()
	server.SetupCors(app)
	server.Middlewares(app)
	server.RouteHealthCheck(app, db)
	api := app.Group("/api")
	server.NewRoutes(api, db)

	// corn-job
	// usecase.StartScheduledUpdates(db)

	// server running
	port := fmt.Sprintf(":%d", cfg.Server.Port)
	log.Printf("🚀 Server starting on port %s", port)
	log.Fatal(app.Listen(port))
}
