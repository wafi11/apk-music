package usecase

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type SpotifyAlbum struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Images []struct {
		URL    string `json:"url"`
		Height int    `json:"height"`
		Width  int    `json:"width"`
	} `json:"images"`
	Artists []struct {
		Name string `json:"name"`
		ID   string `json:"id"`
	} `json:"artists"`
	Tracks struct {
		Items []struct {
			Name string `json:"name"`
			ID   string `json:"id"`
		} `json:"items"`
		Total int `json:"total"`
	} `json:"tracks"`
	ReleaseDate string `json:"release_date"`
}

type SpotifyAlbumsResponse struct {
	SpotifyAlbum
}

// Helper methods untuk safe access
func (s *SpotifyAlbum) GetImageURL() string {
	if len(s.Images) > 0 {
		return s.Images[0].URL
	}
	return ""
}

func (s *SpotifyAlbum) GetArtistName() string {
	if len(s.Artists) > 0 {
		return s.Artists[0].Name
	}
	return ""
}

func (s *SpotifyAlbum) GetArtistID() string {
	if len(s.Artists) > 0 {
		return s.Artists[0].ID
	}
	return ""
}

func GetDetailsAlbums(albumsId string) (*SpotifyAlbumsResponse, error) {
	endpoint := fmt.Sprintf("https://api.spotify.com/v1/albums/%s", albumsId)
	token := ""

	if token == "" {
		return nil, fmt.Errorf("spotify token is empty")
	}

	// Create request
	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Add headers
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	req.Header.Set("Content-Type", "application/json")

	// Execute request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	// Check status code
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API error: status %d, body: %s", resp.StatusCode, string(body))
	}

	// Parse JSON
	var result SpotifyAlbumsResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %w, body: %s", err, string(body))
	}

	return &result, nil
}
