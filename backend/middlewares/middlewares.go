package middlewares

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func CheckAuth(c *gin.Context) {
	session := sessions.Default(c)
	if session.Get("user_id") == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized access to api route"})
	} else {
		c.Next()
	}
}
