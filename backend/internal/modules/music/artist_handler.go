package music

import (
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/wafi11/lms/backend/pkg/response"
)

type ArtistHandler struct {
	service ArtistService
}

func NewArtistHandler(service ArtistService) ArtistHandler {
	return ArtistHandler{service: service}
}

func (h *ArtistHandler) FindAllArtist(c *fiber.Ctx) error {
	limit := c.QueryInt("limit")

	data, err := h.service.FindAllArtist(c.Context(), limit)

	if err != nil {
		return response.Error(c, http.StatusInternalServerError, "internal server error")
	}

	return response.Success(c, http.StatusOK, "Artist Retreived Successfully", data)
}

func (h *ArtistHandler) FindAllArtistName(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return response.Error(c, http.StatusBadRequest, "id must be requeired")
	}
	idInt, err := strconv.Atoi(id)
	if err != nil {
		return response.Error(c, http.StatusBadRequest, "Artist Id Must Be Number")
	}

	details, albums, err := h.service.FindArtistById(c.Context(), idInt)

	if err != nil {
		return response.Error(c, http.StatusInternalServerError, "internal server error")
	}

	responses := map[string]interface{}{
		"details": details,
		"albums":  albums,
	}

	return response.Success(c, http.StatusOK, "Artist Retreived Successfully", responses)
}
