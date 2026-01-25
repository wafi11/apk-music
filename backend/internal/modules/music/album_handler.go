package music

import (
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/wafi11/lms/backend/pkg/response"
)

type AlbumHandler struct {
	s AlbumService
}

func NewAlbumHandler(s AlbumService) AlbumHandler {
	return AlbumHandler{s: s}
}

func (h *AlbumHandler) CreateAlbum(c *fiber.Ctx) error {
	var req struct {
		AlbumId string `json:"albumId"`
	}

	if err := c.BodyParser(&req); err != nil {
		return response.Error(c, http.StatusBadRequest, "invalid body request")
	}

	err := h.s.CreateAlbums(c.Context(), req.AlbumId)
	if err != nil {
		return response.Error(c, http.StatusInternalServerError, "internal server error")
	}

	return response.Success(c, http.StatusCreated, "Create Albums Successfully", nil)
}

func (h *AlbumHandler) FindAllAlbums(c *fiber.Ctx) error {
	limit := c.Query("limit")
	page := c.Query("page")
	search := c.Query("search")

	if limit == "" {
		return response.Error(c, http.StatusBadRequest, "Limit Must Required")
	}
	if page == "" {
		return response.Error(c, http.StatusBadRequest, "Page Must Required")
	}

	paginationResult := response.CalculatePagination(&page, &limit)

	data, count, err := h.s.repo.FindAllAlbums(c.Context(), paginationResult.Take, paginationResult.Skip, search)

	if err != nil {
		return response.Error(c, http.StatusInternalServerError, "internal server error")
	}

	responses := response.CreatePaginatedResponse(
		data,
		paginationResult.CurrentPage,
		paginationResult.ItemsPerPage,
		count,
	)

	return response.Success(c, http.StatusOK, "Albums retrieved Successfully", responses)
}

func (h *AlbumHandler) FindAlbumById(c *fiber.Ctx) error {
	id := c.Params("id")

	idInt, err := strconv.Atoi(id)
	if err != nil {
		return response.Error(c, http.StatusBadRequest, "id must be number")
	}

	data, err := h.s.FindAlbumById(c.Context(), idInt)

	if err != nil {
		return response.Error(c, http.StatusInternalServerError, "internal server error")
	}

	return response.Success(c, http.StatusOK, "Albums retrieved Successfully", data)
}
