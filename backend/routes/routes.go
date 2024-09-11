package routes

import (
	"github.com/debadutta98/ai-image-generator/middlewares"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(app *gin.Engine) {
	authRoute := app.Group("/auth")
	authRoute.GET("/login", LoginHandler)
	authRoute.GET("/callback", AuthCallBackHandler)
	authRoute.GET("/logout", middlewares.CheckAuth, logoutUser)

	apiRoute := app.Group("/api")

	apiRoute.GET("/user", middlewares.CheckAuth, getUserHandler)
	apiRoute.POST("/image/generate", middlewares.CheckAuth, generateImage)
	apiRoute.GET("/user/history", middlewares.CheckAuth, getUserHistory)
	apiRoute.GET("/user/feed", getAllImages)
	apiRoute.GET("/user/collection", middlewares.CheckAuth, getCollectionImages)
	apiRoute.POST("/user/image/add", middlewares.CheckAuth, addUserToImageCollection)
	apiRoute.DELETE("/user/image/remove", middlewares.CheckAuth, deleteUserFromImageCollection)
	apiRoute.GET("/image/:fileId", getImage)
	apiRoute.GET("/image/setting/:imageId", getImageSetting)
	apiRoute.GET("/health", getHealthCheckStatus)
}
