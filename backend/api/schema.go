package api

type GetTokenRequestBody struct {
	ClientId     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
	Code         string `json:"code"`
}

type GenerateImageRequestBody struct {
	Prompt            string  `json:"prompt"`
	NegativePrompt    string  `json:"negative_prompt"`
	Style             string  `json:"style"`
	Samples           int     `json:"samples"`
	Scheduler         string  `json:"scheduler"`
	NumInferenceSteps int     `json:"num_inference_steps"`
	GuidanceScale     float64 `json:"guidance_scale"`
	Strength          float64 `json:"strength"`
	HighNoiseFraction float64 `json:"high_noise_fraction"`
	Seed              int     `json:"seed"`
	Width             int     `json:"width"`
	Height            int     `json:"height"`
	Refiner           bool    `json:"refiner"`
	Base64            bool    `json:"base64"`
}
