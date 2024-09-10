package routes

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/debadutta98/ai-image-generator/api"
	"github.com/debadutta98/ai-image-generator/db"
	"github.com/debadutta98/ai-image-generator/utils"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func LoginHandler(context *gin.Context) {
	const scope string = "user user:email"
	client_id := os.Getenv("GITHUB_AUTH_CLIENT_ID")
	state, err := utils.GenerateRandomString(15)
	if err != nil || state == "" {
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Failed to create state"})
		return
	}
	context.SetCookie("state", state, int(time.Now().Add(10*60*time.Second).Unix()), "/", "", true, true)
	url := fmt.Sprintf("https://github.com/login/oauth/authorize?response_type=code&client_id=%s&state=%s&scope=%s", client_id, state, scope)
	context.Redirect(http.StatusSeeOther, url)
}

func AuthCallBackHandler(context *gin.Context) {
	var (
		code          string = context.Query("code")
		state         string = context.Query("state")
		client_id     string = os.Getenv("GITHUB_AUTH_CLIENT_ID")
		client_secret string = os.Getenv("GITHUB_AUTH_CLIENT_SECRET")
	)

	if cookie, err := context.Request.Cookie("state"); err != nil || cookie.Value != state {
		context.Redirect(http.StatusSeeOther, "/")
		return
	}

	res, err := api.GetGitHubAccessToken(api.GetTokenRequestBody{ClientId: client_id, ClientSecret: client_secret, Code: code})

	if err != nil {
		context.Redirect(http.StatusSeeOther, "/")
		return
	}

	data := make(map[string]string)

	if err := json.NewDecoder(res.Body).Decode(&data); err != nil {
		context.Redirect(http.StatusSeeOther, "/")
		return
	}

	if access_token, ok := data["access_token"]; ok {
		if res, err := api.GetUserInfo(access_token); err != nil {
			context.Redirect(http.StatusSeeOther, "/")
			return
		} else {
			userInfo := make(map[string]interface{})
			if err := json.NewDecoder(res.Body).Decode(&userInfo); err != nil {
				context.Redirect(http.StatusSeeOther, "/")
				return
			}
			session := sessions.Default(context)
			if id, ok := userInfo["id"].(float64); ok {
				if usr, err := db.GetUser(id); err != nil {
					//Sing up new user
					var (
						name       string
						email      string
						avatar_url string
						location   string
						bio        string
					)

					if name, ok = userInfo["name"].(string); !ok {
						name = userInfo["login"].(string)
					}

					if email, ok = userInfo["email"].(string); !ok {
						email = ""
					}

					if avatar_url, ok = userInfo["avatar_url"].(string); !ok {
						avatar_url = ""
					}

					if location, ok = userInfo["location"].(string); !ok {
						location = ""
					}

					if bio, ok = userInfo["bio"].(string); !ok {
						bio = ""
					}

					if _, err := db.InsertUser(db.User{
						Name:        name,
						Email:       email,
						Profile_Img: avatar_url,
						JoinedAt:    time.Now(),
						Location:    location,
						Profile_BIO: bio,
						User_Id:     id,
					}); err != nil {
						context.Redirect(http.StatusSeeOther, "/")
						return
					}
					session.Set("name", name)
					session.Set("profile_img", avatar_url)
					session.Set("user_id", id)
				} else {
					session.Set("name", usr.Name)
					session.Set("profile_img", usr.Profile_Img)
					session.Set("user_id", usr.User_Id)
				}
			}
			if err := session.Save(); err != nil {
				context.Redirect(http.StatusSeeOther, "/")
				return
			}
			context.Redirect(http.StatusSeeOther, "/")
			return
		}
	} else {
		context.Redirect(http.StatusSeeOther, "/")
		return
	}
}

func getUserHandler(context *gin.Context) {
	session := sessions.Default(context)
	name := session.Get("name")
	profile_img := session.Get("profile_img")
	context.JSON(http.StatusOK, gin.H{"auth": true, "name": name, "profile_url": profile_img})
}

func generateImage(context *gin.Context) {
	var (
		prompt          string
		negative_prompt string
		height          float64
		width           float64
		guidance        float64
		color           string
		seed            float64
	)

	body := make(map[string]interface{})

	if err := json.NewDecoder(context.Request.Body).Decode(&body); err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Failed to parsed request body"})
		return
	}

	if err := utils.GetValue(body["prompt"], &prompt); err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "prompt must be of type string"})
		return
	}

	if err := utils.GetValue(body["negative_prompt"], &negative_prompt); err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "negative prompt must be of type string"})
		return
	}
	if err := utils.GetValue(body["height"], &height); err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "height must be of type integer"})
		return
	}
	if err := utils.GetValue(body["width"], &width); err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "width must be of type integer"})
		return
	}

	if err := utils.GetValue(body["color"], &color); err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "color must be of type string"})
		return
	}

	if err := utils.GetValue(body["seed"], &seed); err != nil {
		seed = float64(time.Now().Nanosecond())
	}

	if err := utils.GetValue(body["guidance"], &guidance); err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "guidance must be of type float"})
		return
	}

	if res, err := api.GenerateImage(api.GenerateImageRequestBody{
		Prompt:            prompt,
		NegativePrompt:    negative_prompt,
		Seed:              int(seed),
		GuidanceScale:     guidance,
		Width:             int(width),
		Height:            int(height),
		Base64:            false,
		Refiner:           true,
		HighNoiseFraction: 0.8,
		Strength:          0.2,
		NumInferenceSteps: 25,
		Samples:           1,
	}); err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	} else {

		content_type := res.Header.Get("Content-Type")

		if res.StatusCode != http.StatusOK || content_type == "application/json" {
			context.DataFromReader(res.StatusCode, res.ContentLength, content_type, res.Body, nil)
			return
		}

		session := sessions.Default(context)
		userId := session.Get("user_id")

		pr, pw := io.Pipe()

		go func(r io.Reader, userId interface{}, contentType string) {
			format, err := mime.ExtensionsByType(contentType)
			if err == nil {
				filemeta := db.FileMeta{
					GeneratedBy: userId,
					GeneratedAt: time.Now(),
					Width:       int32(width),
					Height:      int32(height),
					Format:      strings.ReplaceAll(format[0], ".", ""),
				}
				if fileId, err := db.UploadFile(filemeta, r); err == nil {
					db.SaveImage(db.Image{
						ImageId:        fileId,
						Prompt:         prompt,
						Seed:           int64(seed),
						Color:          color,
						GuidanceScale:  float64(guidance),
						NegativePrompt: negative_prompt,
						Collection:     make([]interface{}, 0),
						UserId:         userId,
					})
				}
			}
		}(pr, userId, content_type)

		defer res.Body.Close()

		context.Stream(func(w io.Writer) bool {
			buf := make([]byte, 1024)
			for {
				if n, err := res.Body.Read(buf); err != nil {
					if err == io.EOF {
						if n <= 0 {
							clear(buf)
							break
						}
					} else {
						log.Printf("Error reading data: %v", err)
						return false
					}
				} else {
					chunk := buf[:n]
					if _, err = w.Write(chunk); err != nil {
						log.Printf("Error while writing data: %v", err)
						return false
					}
					if _, err = pw.Write(chunk); err != nil {
						log.Printf("Error while writing data: %v", err)
					}
				}
			}
			return false
		})
	}

}

func getAllImages(context *gin.Context) {
	var (
		userId      interface{}
		page        int
		limit       int = 10
		searchQuery string
		err         error
	)

	userId = sessions.Default(context).Get("user_id")

	if p, ok := context.GetQuery("page"); ok {
		if page, err = strconv.Atoi(p); err != nil {
			context.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"message": "page must be an integer"})
			return
		}
	} else {
		context.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"message": "page is missing"})
		return
	}

	if l, ok := context.GetQuery("limit"); ok {
		if limit, err = strconv.Atoi(l); err != nil {
			context.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"message": "limit must be an integer"})
			return
		}
	} else {
		context.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"message": "limit is missing"})
		return
	}

	if search, ok := context.GetQuery("search"); ok {
		searchQuery = search
	}

	if data, pages, err := db.GetFeed(userId, searchQuery, limit, page, false); err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	} else {
		context.JSON(http.StatusOK, gin.H{"feeds": data, "pages": pages})
	}
}

func getUserHistory(context *gin.Context) {
	var (
		userId interface{}
		page   int
		limit  int = 10
		err    error
	)

	if userId = sessions.Default(context).Get("user_id"); userId == nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Unauthoriz access to user route"})
		return
	}

	if p, ok := context.GetQuery("page"); ok {
		if page, err = strconv.Atoi(p); err != nil {
			context.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"message": "page must be an integer"})
			return
		}
	} else {
		context.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"message": "page is missing"})
		return
	}

	if l, ok := context.GetQuery("limit"); ok {
		if limit, err = strconv.Atoi(l); err != nil {
			context.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"message": "limit must be an integer"})
			return
		}
	} else {
		context.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"message": "limit is missing"})
		return
	}

	if histories, pages, err := db.GetUserHistory(userId, limit, page); err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
	} else {
		context.JSON(http.StatusOK, gin.H{"histories": histories, "pages": pages})
	}
}

func getCollectionImages(context *gin.Context) {
	var (
		userId interface{}
		page   int
		limit  int = 10
		err    error
	)

	if userId = sessions.Default(context).Get("user_id"); userId == nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Unauthoriz access to user route"})
		return
	}

	if p, ok := context.GetQuery("page"); ok {
		if page, err = strconv.Atoi(p); err != nil {
			context.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"message": "page must be an integer"})
			return
		}
	} else {
		context.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"message": "page is missing"})
		return
	}

	if l, ok := context.GetQuery("limit"); ok {
		if limit, err = strconv.Atoi(l); err != nil {
			context.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"message": "limit must be an integer"})
			return
		}
	} else {
		context.AbortWithStatusJSON(http.StatusPreconditionFailed, gin.H{"message": "limit is missing"})
		return
	}

	if data, pages, err := db.GetFeed(userId, "", limit, page, true); err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	} else {
		context.JSON(http.StatusOK, gin.H{"feeds": data, "pages": pages})
	}
}

func getImage(context *gin.Context) {
	var fileId primitive.ObjectID
	if id, ok := context.Params.Get("fileId"); ok {
		if _id, err := primitive.ObjectIDFromHex(id); err == nil {
			fileId = _id
		} else {
			context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Invalid fileId"})
			return
		}
	} else {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "fileId is required"})
		return
	}
	if err := db.DownloadFile(fileId, context.Writer, false); err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Image not found"})
		return
	}
}

func addUserToImageCollection(context *gin.Context) {
	var (
		userId interface{}
		imgeId string
		_id    primitive.ObjectID
	)

	if userId = sessions.Default(context).Get("user_id"); userId == nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Unauthorize access to user route"})
		return
	}

	body := make(map[string]interface{})

	if err := json.NewDecoder(context.Request.Body).Decode(&body); err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	if err := utils.GetValue(body["imageId"], &imgeId); err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "imageId must be of type string"})
		return
	} else {
		if _id, err = primitive.ObjectIDFromHex(imgeId); err != nil {
			context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "invalid imageId"})
			return
		}
	}

	if err := db.UpdateUserCollection(_id, userId, db.Add); err != nil {
		context.AbortWithStatusJSON(http.StatusOK, gin.H{"message": err.Error()})
		return
	} else {
		context.AbortWithStatusJSON(http.StatusOK, gin.H{"message": "Successfully add image to user collection"})
	}
}

func deleteUserFromImageCollection(context *gin.Context) {
	var (
		userId interface{}
		imgeId string
		_id    primitive.ObjectID
	)

	if userId = sessions.Default(context).Get("user_id"); userId == nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Unauthorize access to user route"})
		return
	}

	body := make(map[string]interface{})

	if err := json.NewDecoder(context.Request.Body).Decode(&body); err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	if err := utils.GetValue(body["imageId"], &imgeId); err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "imageId must be of type string"})
		return
	} else {
		if _id, err = primitive.ObjectIDFromHex(imgeId); err != nil {
			context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "invalid imageId"})
			return
		}
	}

	if err := db.UpdateUserCollection(_id, userId, db.Remove); err != nil {
		context.AbortWithStatusJSON(http.StatusOK, gin.H{"message": err.Error()})
		return
	} else {
		context.AbortWithStatusJSON(http.StatusOK, gin.H{"message": "Successfully remove image from user collection"})
	}
}

func getImageSetting(context *gin.Context) {
	var (
		imgeId string
		_id    primitive.ObjectID
	)

	if err := utils.GetValue(context.Param("imageId"), &imgeId); err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "imageId must be of type string"})
		return
	} else {
		if _id, err = primitive.ObjectIDFromHex(imgeId); err != nil {
			context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "invalid imageId"})
			return
		}
	}

	if settings, err := db.GetImageInfo(_id); err != nil {
		context.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	} else {
		context.JSON(http.StatusOK, settings)
		return
	}
}

func logoutUser(context *gin.Context) {
	session := sessions.Default(context)
	session.Clear()
	session.Options(sessions.Options{MaxAge: -1})
	session.Save()
	context.Redirect(http.StatusSeeOther, "/")
}
