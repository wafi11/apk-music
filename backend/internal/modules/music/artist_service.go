package music

import "context"

type ArtistService struct {
	repo MusicRepository
}

func NewArtistService(repo MusicRepository) ArtistService {
	return ArtistService{repo: repo}
}

func (s *ArtistService) FindAllArtist(c context.Context, limit int) ([]Artist, error) {
	return s.repo.FindAllArtist(c, limit)
}

func (s *ArtistService) FindArtistById(c context.Context, artistId int) (*Artist, []AlbumWithSongs, error) {
	details, err := s.repo.FindArtistById(c, artistId)

	if err != nil {
		return nil, nil, err
	}

	albums, err := s.repo.FindAlbumByArtistId(c, details.Name)
	if err != nil {
		return nil, nil, err
	}

	return &details, albums, nil
}
