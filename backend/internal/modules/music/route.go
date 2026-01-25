package music

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func SongRoutes(db *sql.DB, app fiber.Router) {
	// repository
	repo := NewRepository(db)

	// service
	svc := NewService(repo)
	artistSvc := NewArtistService(repo)
	albumSvc := NewAlbumService(repo)

	// handler
	handler := NewHandler(svc)
	artistHandler := NewArtistHandler(artistSvc)
	albumHandler := NewAlbumHandler(albumSvc)

	// song routes
	songs := app.Group("/song")
	songs.Post("", handler.Create)
	songs.Get("", handler.FindAllSongs)
	songs.Get("/search", handler.SearchMusic)
	songs.Patch("/:id/url-yt", handler.UpdateLinkUrlMusic)

	// artist routes
	artist := app.Group("/artist")
	artist.Get("", artistHandler.FindAllArtist)
	artist.Get("/:id", artistHandler.FindAllArtistName)

	// album routes
	album := app.Group("/album")
	album.Post("", albumHandler.CreateAlbum)
	album.Get("", albumHandler.FindAllAlbums)
	album.Get("/:id", albumHandler.FindAlbumById)
}
