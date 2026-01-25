package music

type Artist struct {
	ID    int     `json:"artistId"`
	Name  string  `json:"artistName"`
	Image *string `json:"artistImage"`
}
