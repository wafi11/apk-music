package types

type MyQueue struct {
	QueueItemsId     int    `json:"queueItemsId"`
	QueueItemsOrder  int    `json:"queueItemsOrder" db:"order"`
	SongName         string `json:"songName"`
	SongImage        string `json:"songImage"`
	SongDuration     string `json:"songDuration"`
	SongUrlStreaming string `json:"songUrlStreaming"`
}
