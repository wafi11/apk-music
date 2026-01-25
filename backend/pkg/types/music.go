package types

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"time"

	"github.com/wafi11/lms/backend/pkg/response"
)

type ListRequest struct {
	Limit  int     `query:"limit"`
	Cursor *string `query:"cursor"` // base64 encoded cursor
}
type Cursor struct {
	CreatedAt time.Time `json:"created_at"`
	ID        int64     `json:"id"`
}

func (c *Cursor) Encode() string {
	jsonBytes, _ := json.Marshal(c)
	return base64.StdEncoding.EncodeToString(jsonBytes)
}

var (
	ErrArtistValueToLong = errors.New("artist value to long")
	ErrInvalidData       = errors.New("invalid song data")
	ErrDatabaseError     = errors.New("database operation failed")
)

type Music struct {
	ID         int       `json:"id"`
	Title      string    `json:"title"`
	Url        *string   `json:"url"`
	Image      *string   `json:"image,omitempty"`
	Album      *string   `json:"album,omitempty"`
	Artist     string    `json:"artist"`
	UrlSpotify *string   `json:"urlSpotify,omitempty"`
	UrlYt      *string   `json:"urlYt,omitempty"`
	Duration   string    `json:"duration"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}

type SearchMusic struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Image     string    `json:"image"`
	Artist    string    `json:"artist"`
	CreatedAt time.Time `json:"createdAt"`
}

type ListSearchMusic struct {
	Data     []SearchMusic             `json:"data"`
	Metadata response.PaginationCursor `json:"metadata"`
}
