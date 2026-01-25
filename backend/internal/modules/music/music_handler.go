package music

import (
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/wafi11/lms/backend/pkg/response"
	"github.com/wafi11/lms/backend/pkg/types"
)

type Handler struct {
	svc Service
}

func NewHandler(svc Service) Handler {
	return Handler{svc: svc}
}

func (h *Handler) Create(c *fiber.Ctx) error {
	var req struct {
		LinkSpotify string `json:"linkSpotify"`
		LinkYtMusic string `json:"linkYtMusic"`
	}

	if err := c.BodyParser(&req); err != nil {
		return response.Error(c, http.StatusBadRequest, "invalid body request")
	}

	err := h.svc.Create(c.Context(), req.LinkSpotify, req.LinkYtMusic)
	if err != nil {
		if errors.Is(err, types.ErrArtistValueToLong) {
			return response.Error(c, http.StatusBadRequest, types.ErrArtistValueToLong.Error())
		}
		log.Printf("err = %s", err)
		return response.Error(c, http.StatusInternalServerError, "internal server error")
	}

	return response.Success(c, http.StatusCreated, "Create Music Successfully", nil)
}

func (h *Handler) SearchMusic(c *fiber.Ctx) error {
	search := c.Query("query")
	cursor := c.Query("cursor")
	if search == "" {
		return response.Error(c, http.StatusBadRequest, "query not found")
	}

	data, err := h.svc.SearchMusic(c.Context(), search, types.ListRequest{
		Limit:  10,
		Cursor: &cursor,
	})

	if err != nil {
		return response.Error(c, http.StatusInternalServerError, "internal server error")
	}

	return response.Success(c, http.StatusOK, "Songs retrieved Successfully", data)
}

func (h *Handler) FindAllSongs(c *fiber.Ctx) error {
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

	data, count, err := h.svc.FindAllSongs(c.Context(), paginationResult.Take, paginationResult.Skip, search)

	if err != nil {
		return response.Error(c, http.StatusInternalServerError, "internal server error")
	}

	responses := response.CreatePaginatedResponse(
		data,
		paginationResult.CurrentPage,
		paginationResult.ItemsPerPage,
		count,
	)

	return response.Success(c, http.StatusOK, "Songs retrieved Successfully", responses)
}

func (h *Handler) UpdateLinkUrlMusic(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return response.Error(c, http.StatusBadRequest, "id is required")
	}
	idInt, err := strconv.Atoi(id)

	if err != nil {
		return response.Error(c, http.StatusBadRequest, "id must be number")
	}

	url, err := h.svc.UpdateLinkUrlMusic(c.Context(), idInt)
	if err != nil {
		return response.Error(c, http.StatusInternalServerError, err.Error())
	}

	return response.Success(c, http.StatusOK, "Successfullt To Update Link", url)
}
