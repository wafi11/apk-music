package music

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	"github.com/wafi11/lms/backend/pkg/types"
)

func (r *Repository) CreateAlbums(c context.Context, albumName, artist string, image *string) error {
	query := `
		insert into albums (name,image,artist) values ($1,$2,$3)  ON CONFLICT (name) DO NOTHING
	`
	_, err := r.db.ExecContext(c, query, albumName, image, artist)
	if err != nil {
		log.Printf("failed to insert album: %s", err.Error())
		return fmt.Errorf("album is already exists")
	}

	return nil
}

func (r *Repository) FindAllAlbums(c context.Context, limit, page int, search string) ([]Album, int, error) {

	var args []interface{}
	var addedWhere string

	// Build WHERE clause
	if search != "" {
		addedWhere = "WHERE LOWER(name) LIKE LOWER($1)"
		args = append(args, "%"+search+"%")
	}

	// Calculate offset untuk pagination
	offset := page

	// Build query dengan WHERE dan LIMIT/OFFSET
	query := fmt.Sprintf(`
		SELECT id,name,image,artist
		FROM albums
		%s
		ORDER BY name DESC
		LIMIT $%d OFFSET $%d
	`, addedWhere, len(args)+1, len(args)+2)

	// Tambahkan limit dan offset ke args
	args = append(args, limit, offset)

	// Execute query
	rst, err := r.db.QueryContext(c, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query songs: %w", err)
	}
	defer rst.Close()

	// Scan results
	var albums []Album
	for rst.Next() {
		var album Album
		err := rst.Scan(
			&album.ID,
			&album.Name,
			&album.Image,
			&album.Artist,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan album: %w", err)
		}
		albums = append(albums, album)
	}

	if err := rst.Err(); err != nil {
		return nil, 0, fmt.Errorf("error iterating rows: %w", err)
	}

	// find total records
	total, err := r.CountTotalAlbums(c, addedWhere, search)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count albums: %w", err)
	}

	return albums, total, nil

}

func (r *Repository) CountTotalAlbums(c context.Context, addedWhere, search string) (int, error) {
	// Get total count untuk pagination info
	var total int
	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM albums %s`, addedWhere)
	var countArgs []interface{}
	if search != "" {
		countArgs = append(countArgs, "%"+search+"%")
	}
	err := r.db.QueryRowContext(c, countQuery, countArgs...).Scan(&total)
	if err != nil {
		return 0, fmt.Errorf("failed to count songs: %w", err)
	}

	return total, nil
}

func (r *Repository) FindAlbumById(c context.Context, albumId int) (*Album, error) {
	var albums Album
	query := `
		SELECT a.id,a.name,a.image FROM albums a WHERE a.id = $1
	`
	err := r.db.QueryRowContext(c, query, albumId).Scan(&albums.ID, &albums.Name, &albums.Image)
	if err != nil {
		return nil, fmt.Errorf("album not found")
	}

	return &albums, nil
}
func (r *Repository) FindAlbumByArtistId(c context.Context, artistName string) ([]AlbumWithSongs, error) {
	query := `
		SELECT 
			a.id,
			a.name,
			a.image,
			a.artist,
			s.id,
			s.title,
			s.duration,
			s.artist,
			s.album,
			s.image,
			s.created_at,
			s.updated_at,
			s.url
		FROM albums a 
		LEFT JOIN songs s ON s.album = a.name
		WHERE a.artist = $1
		ORDER BY a.name, s.created_at DESC
	`

	rows, err := r.db.QueryContext(c, query, artistName)
	if err != nil {
		log.Printf("failed to query albums by artist: %s", err)
		return nil, fmt.Errorf("failed to query albums: %w", err)
	}
	defer rows.Close()

	// Map untuk group songs by album
	albumMap := make(map[int]*AlbumWithSongs)
	albumOrder := []int{} // Track order of albums

	for rows.Next() {
		var albumID int
		var albumName string
		var albumImage *string
		var albumArtist string

		var song types.Music
		var songID sql.NullInt64
		var songTitle sql.NullString
		var songDuration string
		var songArtist sql.NullString
		var songAlbum *string
		var songImage *string
		var songCreatedAt sql.NullTime
		var songUpdatedAt sql.NullTime
		var songUrl *string

		err = rows.Scan(
			&albumID,
			&albumName,
			&albumImage,
			&albumArtist,
			&songID,
			&songTitle,
			&songDuration,
			&songArtist,
			&songAlbum,
			&songImage,
			&songCreatedAt,
			&songUpdatedAt,
			&songUrl,
		)
		if err != nil {
			log.Printf("failed to scan row: %s", err)
			continue
		}

		// Check if album already exists in map
		if _, exists := albumMap[albumID]; !exists {
			albumMap[albumID] = &AlbumWithSongs{
				Album: Album{
					ID:     albumID,
					Name:   albumName,
					Image:  albumImage,
					Artist: albumArtist,
				},
				Songs: []types.Music{},
			}
			albumOrder = append(albumOrder, albumID)
		}

		// Add song to album if song data exists (LEFT JOIN bisa return NULL)
		if songID.Valid {
			song = types.Music{
				ID:        int(songID.Int64),
				Title:     songTitle.String,
				Duration:  songDuration,
				Artist:    songArtist.String,
				Album:     songAlbum,
				Image:     songImage,
				CreatedAt: songCreatedAt.Time,
				UpdatedAt: songUpdatedAt.Time,
				Url:       songUrl,
			}
			albumMap[albumID].Songs = append(albumMap[albumID].Songs, song)
		}
	}

	if err = rows.Err(); err != nil {
		log.Printf("error iterating rows: %s", err)
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	// Convert map to slice in order
	albums := make([]AlbumWithSongs, 0, len(albumMap))
	for _, albumID := range albumOrder {
		albums = append(albums, *albumMap[albumID])
	}

	if len(albums) == 0 {
		log.Printf("no albums found for artist : %s", artistName)
		return []AlbumWithSongs{}, nil
	}

	return albums, nil
}
