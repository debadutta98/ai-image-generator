package main

import (
	"log"
	"os"

	"github.com/Kardbord/hfapigo/v3"
	"github.com/debadutta98/ai-image-generator/db"
	"github.com/debadutta98/ai-image-generator/routes"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/mongo/mongodriver"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	if err := godotenv.Load(); err != nil {
		log.Fatal("Error while loading env file", err)
	}

	hfapigo.SetAPIKey(os.Getenv("HUGGINGFACE_MODEL_API_KEY"))

	db.ConnectDB()

	app := gin.Default()

	collection := db.GetCollection("sessions")

	//secret, err := utils.GenerateRandomString(20)

	// if err != nil {
	// 	log.Fatal("Unable to generate cookie secret")
	// }

	secret := "sdadad"

	app.Use(sessions.Sessions("user_session", mongodriver.NewStore(collection, 10*24*3600, true, []byte(secret))))

	routes.RegisterRoutes(app)

	var addr string
	if port := os.Getenv("PORT"); port != "" {
		addr = "0.0.0.0:" + port
	}

	if err := app.Run(addr); err == nil {
		log.Println("App is running", addr)
	} else {
		log.Fatal("Error while running App", err)
	}
}
