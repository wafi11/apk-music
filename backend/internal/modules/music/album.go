package music

import "github.com/wafi11/lms/backend/pkg/types"

type Album struct {
	ID     int     `json:"id"`
	Name   string  `json:"name"`
	Image  *string `json:"image"`
	Artist string  `json:"artist"`
}

type AlbumWithSongs struct {
	Album
	Songs []types.Music `json:"music"`
}

type AlbumDetails struct {
	Musics []types.Music `json:"musics"`
	Album  *Album        `json:"album"`
}
