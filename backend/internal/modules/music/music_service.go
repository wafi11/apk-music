package music

import (
	"context"
	"fmt"

	"github.com/wafi11/lms/backend/internal/usecase"
	"github.com/wafi11/lms/backend/pkg/types"
)

type Service struct {
	repo MusicRepository
}

func NewService(repo MusicRepository) Service {
	return Service{repo: repo}
}
func (s *Service) Create(c context.Context, linkSpotify, linkYtMusic string) error {
	music, err := usecase.GetDetailsSongs(linkSpotify)
	if err != nil {
		return fmt.Errorf("failed to fetch spotify: %w", err)
	}
	// log.Printf("DEBUG - Spotify songs count: %d", len(music.Songs))

	ytMusic, err := usecase.DownloadYtMusic(c, linkYtMusic)
	if err != nil {
		return fmt.Errorf("failed to post: %w", err)
	}

	// // DEBUG: Print raw ytMusic object
	// log.Printf("DEBUG - YtMusic full object: %+v", ytMusic)
	// log.Printf("DEBUG - YtMusic resources count: %d", len(ytMusic.Resources))

	// Jika Resources kosong, cek apakah ada field lain
	if len(ytMusic.Resources) == 0 {
		return fmt.Errorf("no resources found from YtMusic API")
	}

	var url string
	for _, i := range ytMusic.Resources {
		// log.Printf("DEBUG - Resource: Format=%s, Quality=%s, HasURL=%v",
		// 	i.Format, i.Quality, i.DownloadUrl != "")

		if i.DownloadMode == "check_download" && i.Type == "audio" {
			url = i.DownloadUrl
			break
		}
	}

	if url == "" {
		return fmt.Errorf("no valid download URL found from YtMusic")
	}

	for _, i := range music.Songs {
		err = s.repo.Create(c, types.Music{
			Album:      i.Album,
			Title:      i.Title,
			Image:      &i.Thumbnail,
			Artist:     i.Artist,
			Url:        &url,
			Duration:   i.Duration,
			UrlSpotify: &linkSpotify,
			UrlYt:      &linkYtMusic,
		})

		if err != nil {
			return fmt.Errorf("failed to insert song '%s': %w", i.Title, err)
		}
	}

	return nil
}

func (s *Service) FindAllSongs(c context.Context, limit, page int, search string) ([]types.Music, int, error) {
	return s.repo.FindAllSongs(c, limit, page, search)
}

func (s *Service) SearchMusic(c context.Context, search string, req types.ListRequest) (*types.ListSearchMusic, error) {
	return s.repo.Search(c, req, search)
}

func (s *Service) UpdateLinkUrlMusic(c context.Context, id int) (string, error) {
	urlYt, err := s.repo.FindUrlYtMusic(c, id)
	if err != nil && urlYt == "" {
		return "", err
	}

	ytMusic, err := usecase.DownloadYtMusic(c, urlYt)
	if err != nil {
		return "", fmt.Errorf("failed to post: %w", err)
	}

	// DEBUG: Print raw ytMusic object
	// log.Printf("DEBUG - YtMusic full object: %+v", ytMusic)
	// log.Printf("DEBUG - YtMusic resources count: %d", len(ytMusic.Resources))

	// Jika Resources kosong, cek apakah ada field lain
	if len(ytMusic.Resources) == 0 {
		return "", fmt.Errorf("no resources found from YtMusic API")
	}

	var url string
	for _, i := range ytMusic.Resources {
		// log.Printf("DEBUG - Resource: Format=%s, Quality=%s, HasURL=%v",
		// 	i.Format, i.Quality, i.DownloadUrl != "")

		if i.DownloadMode == "check_download" && i.Type == "audio" {
			url = i.DownloadUrl
			break
		}
	}

	if url == "" {
		return "", fmt.Errorf("no valid download URL found from YtMusic")
	}

	err = s.repo.UpdateLinkUrlMusic(c, id, url)
	if err != nil {
		return "", err
	}
	return url, nil
}
