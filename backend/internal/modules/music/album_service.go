package music

import (
	"context"
	"fmt"
	"log"

	"github.com/wafi11/lms/backend/internal/usecase"
)

type AlbumService struct {
	repo MusicRepository
}

func NewAlbumService(repo MusicRepository) AlbumService {
	return AlbumService{repo: repo}
}

func (s *AlbumService) CreateAlbums(c context.Context, albumId string) error {
	albums, err := usecase.GetDetailsAlbums(albumId)
	if err != nil {
		log.Printf("error create albums : %s", err.Error())
		return fmt.Errorf("albums not found")
	}
	image := albums.Images[1].URL
	artist := albums.Artists[0].Name
	albumName := albums.Name

	return s.repo.CreateAlbums(c, albumName, artist, &image)
}

func (s *AlbumService) FindAllAlbums(c context.Context, limit, page int, search string) ([]Album, int, error) {
	return s.repo.FindAllAlbums(c, limit, page, search)
}

func (s *AlbumService) FindAlbumById(c context.Context, albumId int) (*AlbumDetails, error) {
	album, err := s.repo.FindAlbumById(c, albumId)
	if err != nil {
		return nil, err
	}

	songs, err := s.repo.FindSongByAlbum(c, album.Name)
	if err != nil {
		return nil, err
	}

	return &AlbumDetails{
		Musics: songs,
		Album:  album,
	}, nil
}

func (s *AlbumService) FindAlbumByArtistId(c context.Context, artistName string) ([]AlbumWithSongs, error) {
	return s.repo.FindAlbumByArtistId(c, artistName)
}
