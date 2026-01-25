package music

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"

	"github.com/wafi11/lms/backend/pkg/types"
)

type MusicRepository interface {
	Create(c context.Context, req types.Music) error
	Search(c context.Context, req types.ListRequest, search string) (*types.ListSearchMusic, error)
	CountTotal(c context.Context, addedWhere, search string) (int, error)
	FindAllSongs(c context.Context, limit, page int, search string) ([]types.Music, int, error)
	UpdateLinkUrlMusic(c context.Context, id int, url string) error
	FindUrlYtMusic(c context.Context, id int) (string, error)
	FindSongById(c context.Context, songId int) (types.Music, error)
	FindSongByAlbum(c context.Context, albumName string) ([]types.Music, error)
	FindSongByArtist(c context.Context, artist string) ([]types.Music, error)

	FindAllArtist(c context.Context, limit int) ([]Artist, error)
	FindArtistById(c context.Context, artistId int) (Artist, error)

	CreateAlbums(c context.Context, albumName string, artist string, image *string) error
	CountTotalAlbums(c context.Context, addedWhere string, search string) (int, error)
	FindAllAlbums(c context.Context, limit, page int, search string) ([]Album, int, error)
	FindAlbumById(c context.Context, albumId int) (*Album, error)
	FindAlbumByArtistId(c context.Context, artistName string) ([]AlbumWithSongs, error)
}

// Decode cursor from base64
func DecodeCursor(encodedCursor string) (*types.Cursor, error) {
	if encodedCursor == "" {
		return nil, nil
	}

	jsonBytes, err := base64.StdEncoding.DecodeString(encodedCursor)
	if err != nil {
		return nil, fmt.Errorf("invalid cursor format: %w", err)
	}

	var cursor types.Cursor
	if err := json.Unmarshal(jsonBytes, &cursor); err != nil {
		return nil, fmt.Errorf("invalid cursor data: %w", err)
	}

	return &cursor, nil
}
