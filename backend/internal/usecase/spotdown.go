package usecase

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type SongDetails struct {
	Songs       []Song `json:"songs"`
	ContentType string `json:"contentType"`
}

type Song struct {
	Title     string  `json:"title"`
	Thumbnail string  `json:"thumbnail"`
	Album     *string `json:"album"`
	Duration  string  `json:"duration"`
	Artist    string  `json:"artist"`
}

func GetDetailsSongs(query string) (*SongDetails, error) {
	url := fmt.Sprintf("https://spotdown.org/api/song-details?url=%s", query)
	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("Error saat mengirim request: %v\n", err)
		return nil, fmt.Errorf("failed to send request")
	}
	defer resp.Body.Close()

	// Baca body sekali saja
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error saat membaca body: %v\n", err)
		return nil, fmt.Errorf("failed to read response body")
	}

	// Debug: cetak hasilnya
	fmt.Println("Response body:", string(bodyBytes))

	// Parse dari bytes yang sudah dibaca
	var songs SongDetails
	if err := json.Unmarshal(bodyBytes, &songs); err != nil {
		return nil, fmt.Errorf("failed to parse request: %s", err.Error())
	}

	return &songs, nil
}

// https://api.vidssave.com/api/contentsite_api/media/download_redirect?request=x6jdBhGhodv9nA8qHb05ZekJBE3MbShr4GjDlR4EXtUPkVNqXwhoFE61PsC4fK1CoSgtUw_5BNm45DPHmnmYbMZaje9WXuYCUyq3s0_N-Kt-yu-Fr1UGMAk71cSyHBmJ9ZkISwgPECL35mSRuyWvxA_86i3-drYuqDKAXLeHdABHOaPvOBJFPJ12ti1LtApkDQaxDX44LiJYFUiV6NvOo9wezWVHdhVZXv-sSLVAmRVbvpP6QMV1HPtr1Q0PT0CBRfoAiCBJ_znWm7b6-au5OZiuZHrZ2kzNK-Oz2WvWA1KRwTo3m5GBMW6hq_Kc6NMmyoAItnIB7sdEin-M8nPZDVoOwvlcM0ZcdD6etLLnZjCuemXDRY1dg55bEGjyBOel7jLsJX_G29zsOwyUl6vLTl_KJSlEuV5b4CotkM7Buh0ITbjaZKAEfzAhx_nbmx_DdOb6BuM1g4v0AmTRxA3jwz6EBo24_fDssJbZhlvOoHSvnAXUH7PrhJTsgzdQeGzt
