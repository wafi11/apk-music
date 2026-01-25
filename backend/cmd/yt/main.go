package main

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
)

func main() {
	// Prepare form data
	data := url.Values{}
	data.Set("auth", "20250901majwlqo")
	data.Set("domain", "api-ak.vidssave.com")
	data.Set("origin", "source")
	data.Set("link", "https://music.youtube.com/watch?v=iJ1nnk4ZuSY&si=EnbyLwmzP9AMTP6O")

	// Create request
	req, err := http.NewRequest("POST", "https://api.vidssave.com/api/contentsite_api/media/parse",
		strings.NewReader(data.Encode()))
	if err != nil {
		panic(err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Origin", "https://vidssave.com")
	req.Header.Set("Referer", "https://vidssave.com/")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
	req.Header.Set("X-Requested-With", "XMLHttpRequest")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	fmt.Println("Status:", resp.Status)
	fmt.Println("Response:", string(body))
}
