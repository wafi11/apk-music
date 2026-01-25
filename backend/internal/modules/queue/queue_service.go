package queue

import (
	"context"

	"github.com/wafi11/lms/backend/pkg/types"
)

type QueueService struct {
	repo *QueueRepository
}

func NewQueueService(repo *QueueRepository) QueueService {
	return QueueService{repo: repo}
}

func (s *QueueService) Create(c context.Context, userId, albumName string) error {
	return s.repo.CreateQueueWithItems(c, userId, albumName)
}

func (s *QueueService) FindMyQueue(c context.Context, userId string) ([]types.MyQueue, error) {
	return s.repo.FindMyQueue(c, userId)
}
