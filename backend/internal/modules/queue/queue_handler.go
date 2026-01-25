package queue

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/wafi11/lms/backend/pkg/response"
)

type QueueHandler struct {
	service QueueService
}

func NewQueueHandler(service QueueService) QueueHandler {
	return QueueHandler{service: service}
}

func (h *QueueHandler) Create(c *fiber.Ctx) error {
	var req struct {
		AlbumName string `json:"albumName"`
	}

	if err := c.BodyParser(&req); err != nil {
		return response.Error(c, http.StatusBadRequest, "invalid body request")
	}

	err := h.service.Create(c.Context(), "6bNaBsyG7OHsfhIRI6xT0pOHPXNPbkmg", req.AlbumName)

	if err != nil {
		return response.Error(c, http.StatusInternalServerError, "internal server error")
	}

	return response.Success(c, http.StatusCreated, "Successfully Created Queue", nil)
}

func (h *QueueHandler) FindMyQueue(c *fiber.Ctx) error {

	data, err := h.service.FindMyQueue(c.Context(), "6bNaBsyG7OHsfhIRI6xT0pOHPXNPbkmg")

	if err != nil {
		return response.Error(c, http.StatusInternalServerError, "internal server error")
	}

	return response.Success(c, http.StatusOK, "MyQueue Retreived Successfully", data)
}
