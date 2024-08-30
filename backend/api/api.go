package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

func GetUserInfo(token string) (*http.Response, error) {
	client := http.Client{}
	req, err := http.NewRequest(http.MethodGet, "https://api.github.com/user", nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", "Bearer "+token)
	req.Header.Add("Accept", "application/vnd.github+json")
	req.Header.Add("X-GitHub-Api-Version", "2022-11-28")
	return client.Do(req)
}

func GetGitHubAccessToken(body GetTokenRequestBody) (*http.Response, error) {
	client := http.Client{}
	data := url.Values{}
	data.Set("client_id", body.ClientId)
	data.Set("client_secret", body.ClientSecret)
	data.Set("code", body.Code)
	req, err := http.NewRequest(http.MethodPost, "https://github.com/login/oauth/access_token", strings.NewReader(data.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Add("Accept", "application/json")
	return client.Do(req)
}

func GenerateImage(body GenerateImageRequestBody) (*http.Response, error) {
	client := http.Client{
		Timeout: 60 * time.Second,
	}
	var request *http.Request
	if data, err := json.Marshal(body); err != nil {
		return nil, err
	} else {
		if request, err = http.NewRequest(http.MethodPost, "https://api.segmind.com/v1/sdxl1.0-txt2img", bytes.NewReader(data)); err != nil {
			return nil, err
		}
	}
	request.Header.Add("Content-Type", "application/json")
	request.Header.Add("x-api-key", os.Getenv("MODEL_API_KEY"))
	return client.Do(request)
}
