package main

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/wafi11/lms/backend/internal/modules/music"
	"github.com/wafi11/lms/backend/pkg/config"
)

type Music struct {
	Title       string
	LinkYT      string
	LinkSpotify string
}

func main() {
	filePath := "music.txt"

	cfg, err := config.LoadConfig()

	if err != nil {
		log.Printf("cannot read config.yaml")
	}

	// check connection database
	db, err := cfg.Database.Connect()
	if err != nil {
		log.Printf("failed to connect database")
	}

	repo := music.NewRepository(db)

	// service
	svc := music.NewService(repo)

	// Buka file
	file, err := os.Open(filePath)
	if err != nil {
		fmt.Printf("Error opening file: %v\n", err)
		return
	}
	defer file.Close()

	// Scanner untuk baca line by line
	scanner := bufio.NewScanner(file)

	var musics []Music
	isFirstLine := true

	// Loop setiap baris
	for scanner.Scan() {
		line := scanner.Text()

		// Skip header (baris pertama)
		if isFirstLine {
			isFirstLine = false
			continue
		}

		// Split by comma
		parts := strings.Split(line, ",")
		if len(parts) != 3 {
			fmt.Printf("Invalid line: %s\n", line)
			continue
		}

		// Buat struct Music
		music := Music{
			Title:       strings.TrimSpace(parts[0]),
			LinkYT:      strings.TrimSpace(parts[1]),
			LinkSpotify: strings.TrimSpace(parts[2]),
		}
		svc.Create(context.Background(), music.LinkSpotify, music.LinkYT)

		// musics = append(musics, music)

		// Print satu-satu
		fmt.Printf("\n=== Music #%d ===\n", len(musics))
		fmt.Printf("Title: %s\n", music.Title)
		fmt.Printf("YouTube: %s\n", music.LinkYT)
		fmt.Printf("Spotify: %s\n", music.LinkSpotify)
	}

	if err := scanner.Err(); err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}

	fmt.Printf("\n\nTotal music: %d\n", len(musics))
}
