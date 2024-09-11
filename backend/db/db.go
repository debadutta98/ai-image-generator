package db

import (
	"context"
	"errors"
	"fmt"
	"log"
	"math"
	"mime"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/debadutta98/ai-image-generator/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/gridfs"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	client *mongo.Client
	db     *mongo.Database
	bucket *gridfs.Bucket
)

func ConnectDB() {
	database, mongo_url := os.Getenv("DB_NAME"), os.Getenv("MONGO_URL")
	if database == "" {
		log.Fatal("Database name is undefined")
	}
	if mongo_url == "" {
		log.Fatal("Mongo url can't be undefined")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	var err error
	if client, err = mongo.Connect(ctx, options.Client().ApplyURI(mongo_url)); err != nil {
		log.Fatal("Can't connect to mongo db")
	} else {
		db = client.Database(database)
		opt := options.GridFSBucket().SetName("images")
		bucket, err = gridfs.NewBucket(db, opt)
		if err != nil {
			log.Fatal("Unable to initialize mongo bucket")
		}
	}
}

func GetCollection(name string) *mongo.Collection {
	return db.Collection(name)
}

func InsertUser(u User) (*mongo.InsertOneResult, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	collection := GetCollection("user")
	return collection.InsertOne(ctx, u)
}

func GetUser(user_id float64) (User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	collection := GetCollection("user")
	var user User
	err := collection.FindOne(ctx, bson.D{{Key: "user_id", Value: user_id}}).Decode(&user)
	return user, err
}

func UploadFile(upload_meta FileMeta) (*gridfs.UploadStream, error) {
	uploadOptions := options.GridFSUpload().SetMetadata(upload_meta)
	filename := uuid.Must(uuid.NewRandom()).String() + "." + upload_meta.Format
	if stream, err := bucket.OpenUploadStream(filename, uploadOptions); err != nil {
		return nil, err
	} else {
		return stream, nil
	}
}

func DownloadFile(fileId primitive.ObjectID, w gin.ResponseWriter, isDownload bool) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	info := make([]map[string]interface{}, 0)
	if cur, err := bucket.Find(bson.D{{Key: "_id", Value: fileId}}); err != nil {
		return err
	} else {
		if err = cur.All(ctx, &info); err != nil {
			return err
		}
	}
	if len(info) > 0 {
		filename := info[0]["filename"].(string)
		ext := strings.Split(filename, ".")[1]
		content_type := mime.TypeByExtension("." + ext)
		content_length := info[0]["length"].(int64)
		w.Header().Add("Content-Type", content_type)
		w.Header().Add("Content-Length", strconv.Itoa(int(content_length)))
		if isDownload {
			w.Header().Add("Content-Disposition", "attachment; filename="+filename)
		}
		if _, err := bucket.DownloadToStream(fileId, w); err != nil {
			return err
		} else {
			return nil
		}
	} else {
		return errors.New("image not found")
	}
}

func SaveImage(img Image) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	collection := GetCollection("images")
	_, err := collection.InsertOne(ctx, img)
	return err
}

func GetUserHistory(userId interface{}, limit int, page int) ([]map[string]interface{}, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	collection := GetCollection("images")
	s, l := utils.GetSkipLimit(int(page), int(limit))
	opts := options.Find().SetSort(bson.D{{Key: "_id", Value: -1}}).SetLimit(int64(l)).SetSkip(int64(s)).SetProjection(bson.D{{Key: "collection", Value: 0}})
	query := bson.D{{Key: "user_id", Value: userId}}
	count := make(chan int64, 1)
	go func() {
		if c, err := collection.CountDocuments(ctx, query); err != nil {
			count <- -1
		} else {
			count <- c
		}
	}()
	histories := make([]map[string]interface{}, 0)
	if cur, err := collection.Find(ctx, query, opts); err != nil {
		return nil, -1, err
	} else {
		if err = cur.All(ctx, &histories); err != nil {
			return nil, -1, err
		}
	}

	imageIds := make([]primitive.ObjectID, 0)
	indexMapper := make(map[string]int)

	for index, history := range histories {
		fileId := new(primitive.ObjectID)
		if err := utils.GetValue(history["image_Id"], fileId); err == nil {
			imageIds = append(imageIds, *fileId)
			indexMapper[fileId.String()] = index
		}
	}

	filesMetadata := make([]map[string]interface{}, 0)
	if cur, err := bucket.Find(bson.D{{Key: "_id", Value: bson.D{{Key: "$in", Value: imageIds}}}}); err != nil {
		return nil, -1, err
	} else {
		if err = cur.All(ctx, &filesMetadata); err != nil {
			return nil, -1, err
		}
	}

	for _, data := range filesMetadata {
		fileId := new(primitive.ObjectID)
		if err := utils.GetValue(data["_id"], fileId); err == nil {
			metadata := data["metadata"].(map[string]interface{})
			index := indexMapper[fileId.String()]
			histories[index]["width"] = metadata["width"]
			histories[index]["height"] = metadata["height"]
			histories[index]["createdAt"] = metadata["generated_at"]
		}
	}

	totalElement := <-count

	defer close(count)

	if totalElement < 0 {
		return nil, 0, errors.New("failed to get count")
	}

	return histories, int(math.Ceil(float64(totalElement) / float64(limit))), nil
}

func GetFeed(userId interface{}, searchQuery string, limit int, page int, coll bool) ([]map[string]interface{}, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	collection := GetCollection("images")
	s, l := utils.GetSkipLimit(int(page), int(limit))
	count := make(chan int64, 1)
	go func() {
		if c, err := collection.CountDocuments(ctx, bson.D{}); err != nil {
			count <- -1
		} else {
			count <- c
		}
	}()

	feeds := make([]map[string]interface{}, 0)

	pipeline := mongo.Pipeline{}

	if strings.Trim(searchQuery, "") != "" {
		pipeline = append(pipeline, bson.D{{Key: "$match", Value: bson.D{{Key: "prompt", Value: bson.D{{Key: "$regex", Value: fmt.Sprintf(".*%s.*", regexp.QuoteMeta(strings.Trim(searchQuery, "")))}, {Key: "$options", Value: "i"}}}}}})
	}

	pipeline = append(pipeline, bson.D{{Key: "$lookup", Value: bson.D{{Key: "from", Value: "user"}, {Key: "localField", Value: "user_id"}, {Key: "foreignField", Value: "user_id"}, {Key: "as", Value: "user"}}}})
	pipeline = append(pipeline, bson.D{{Key: "$unwind", Value: "$user"}})
	pipeline = append(pipeline, bson.D{{Key: "$addFields", Value: bson.D{{Key: "isSaved", Value: bson.D{{Key: "$cond", Value: append(bson.A{}, bson.D{{Key: "$in", Value: bson.A{userId, "$collection"}}}, true, false)}}}}}})
	if coll {
		pipeline = append(pipeline, bson.D{{Key: "$match", Value: bson.D{{Key: "isSaved", Value: true}}}})
	}
	pipeline = append(pipeline, bson.D{{Key: "$sort", Value: bson.D{{Key: "_id", Value: -1}}}})
	pipeline = append(pipeline, bson.D{{Key: "$limit", Value: l}})
	pipeline = append(pipeline, bson.D{{Key: "$skip", Value: s}})
	pipeline = append(pipeline, bson.D{{Key: "$project", Value: bson.D{{Key: "_id", Value: 1}, {Key: "image_Id", Value: 1}, {Key: "isSaved", Value: true}, {Key: "username", Value: "$user.name"}, {Key: "profile_img", Value: "$user.profile_img"}}}})

	if cur, err := collection.Aggregate(ctx, pipeline); err != nil {
		return nil, -1, err
	} else {
		if err = cur.All(ctx, &feeds); err != nil {
			return nil, -1, err
		}
	}

	imageIds := make([]primitive.ObjectID, 0)
	indexMapper := make(map[string]int)

	for index, feed := range feeds {
		fileId := new(primitive.ObjectID)
		if err := utils.GetValue(feed["image_Id"], fileId); err == nil {
			imageIds = append(imageIds, *fileId)
			indexMapper[fileId.String()] = index
		}
	}

	filesMetadata := make([]map[string]interface{}, 0)
	if cur, err := bucket.Find(bson.D{{Key: "_id", Value: bson.D{{Key: "$in", Value: imageIds}}}}); err != nil {
		return nil, -1, err
	} else {
		if err = cur.All(ctx, &filesMetadata); err != nil {
			return nil, -1, err
		}
	}

	for _, data := range filesMetadata {
		fileId := new(primitive.ObjectID)
		if err := utils.GetValue(data["_id"], fileId); err == nil {
			metadata := data["metadata"].(map[string]interface{})
			index := indexMapper[fileId.String()]
			feeds[index]["width"] = metadata["width"]
			feeds[index]["height"] = metadata["height"]
		}
	}

	totalElement := <-count

	defer close(count)

	if totalElement < 0 {
		return nil, 0, errors.New("failed to get count")
	}

	return feeds, int(math.Ceil(float64(totalElement) / float64(limit))), nil
}

type Action string

const (
	Add    Action = "add"
	Remove Action = "remove"
)

func UpdateUserCollection(imageId primitive.ObjectID, userId interface{}, action Action) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	collection := GetCollection("images")
	var (
		res *mongo.UpdateResult
		err error
	)
	if action == Add {
		if res, err = collection.UpdateOne(ctx, bson.D{{Key: "_id", Value: imageId}, {Key: "collection", Value: bson.D{{Key: "$nin", Value: bson.A{userId}}}}}, bson.D{{Key: "$push", Value: bson.D{{Key: "collection", Value: userId}}}}); err != nil {
			return err
		}
	} else {
		if res, err = collection.UpdateOne(ctx, bson.D{{Key: "_id", Value: imageId}, {Key: "collection", Value: bson.D{{Key: "$in", Value: bson.A{userId}}}}}, bson.D{{Key: "$pull", Value: bson.D{{Key: "collection", Value: userId}}}}); err != nil {
			return err
		}
	}

	if res.ModifiedCount == 0 {
		return errors.New("image is already " + string(action) + "ed")
	} else {
		return nil
	}
}

func GetImageInfo(imageId primitive.ObjectID) (map[string]interface{}, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	collection := GetCollection("images")

	res := collection.FindOne(ctx, bson.D{{Key: "_id", Value: imageId}})

	if err := res.Err(); err != nil {
		return nil, err
	} else {
		img := make(map[string]interface{})
		if err = res.Decode(&img); err != nil {
			return nil, err
		} else {
			filesMetadata := make([]map[string]interface{}, 0)
			cur := new(mongo.Cursor)
			if cur, err = bucket.Find(bson.D{{Key: "_id", Value: img["image_Id"].(primitive.ObjectID)}}); err != nil {
				return nil, err
			} else {
				if err := cur.All(ctx, &filesMetadata); err != nil {
					return nil, err
				} else {
					if len(filesMetadata) > 0 {
						metadata := filesMetadata[0]["metadata"].(map[string]interface{})
						img["width"] = metadata["width"]
						img["height"] = metadata["height"]
						img["createdAt"] = metadata["generated_at"]
						return img, nil
					} else {
						return nil, errors.New("no metadata found")
					}
				}
			}
		}
	}
}
