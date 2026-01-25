package music

import (
	"context"
	"fmt"
	"log"
)

func (r *Repository) FindAllArtist(ctx context.Context, limit int) ([]Artist, error) {
	query := `
		SELECT id, name,image
		FROM artist 
		ORDER BY LOWER(name) ASC 
		LIMIT $1
	`

	rows, err := r.db.QueryContext(ctx, query, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to query artists: %w", err)
	}
	defer rows.Close()

	artists := make([]Artist, 0)
	for rows.Next() {
		var artist Artist
		if err := rows.Scan(&artist.ID, &artist.Name, &artist.Image); err != nil {
			return nil, fmt.Errorf("failed to scan artist: %w", err)
		}
		artists = append(artists, artist)
	}

	// Check for errors during iteration
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating artists: %w", err)
	}

	return artists, nil
}

func (r *Repository) FindArtistById(c context.Context, artistId int) (Artist, error) {
	var artist Artist
	query := `
		SELECT id, name,image
		FROM artist 
		WHERE id = $1
	`

	err := r.db.QueryRowContext(c, query, artistId).Scan(&artist.ID, &artist.Name, &artist.Image)
	if err != nil {
		log.Printf("artist not found : %s", err.Error())
		return Artist{}, fmt.Errorf("artist not found")
	}

	return artist, nil
}
