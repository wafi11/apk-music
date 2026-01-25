package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
)

type YtMusicResponse struct {
	Title     string     `json:"title"`
	Thumbnail string     `json:"thumbnail"`
	Duration  int        `json:"duration"`
	Resources []Resource `json:"resources"` // Singular lebih baik untuk element dalam array
}

type Resource struct {
	ResourceID      string `json:"resource_id"`
	Quality         string `json:"quality"`
	Format          string `json:"format"`
	Type            string `json:"type"`
	Size            int    `json:"size"`
	ResourceContent string `json:"resource_content"`
	DownloadMode    string `json:"download_mode"`
	DownloadUrl     string `json:"download_url"`
}

func DownloadYtMusic(c context.Context, query string) (*YtMusicResponse, error) {
	// Prepare form data
	data := url.Values{}
	data.Set("auth", "20250901majwlqo")
	data.Set("domain", "api-ak.vidssave.com")
	data.Set("origin", "source")
	data.Set("link", query)
	// Create request
	req, err := http.NewRequest("POST", "https://api.vidssave.com/api/contentsite_api/media/parse",
		strings.NewReader(data.Encode()))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Origin", "https://vidssave.com")
	req.Header.Set("Referer", "https://vidssave.com/")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
	req.Header.Set("X-Requested-With", "XMLHttpRequest")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("failed to post to api: %s", err.Error())
		return nil, fmt.Errorf("failed to post api: %w", err)
	}
	defer resp.Body.Close()

	var result struct {
		Data   YtMusicResponse `json:"data"`
		Status int             `json:"status"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	// // Validate response status
	// if result.Status != 1 {
	// 	return nil, fmt.Errorf("API returned error status: %d", result.Status)
	// }

	return &result.Data, nil
}
