package db

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID          string      `bson:"_id,omitempty" json:"id,omitempty"`
	Name        string      `bson:"name" json:"name"`
	Email       string      `bson:"email" json:"email"`
	Profile_Img string      `bson:"profile_img" json:"profile_img"`
	JoinedAt    time.Time   `bson:"joined_at" json:"joined_at"`
	Location    string      `bson:"location" json:"location"`
	Profile_BIO string      `bson:"bio" json:"bio"`
	User_Id     interface{} `bson:"user_id" json:"user_id"`
}

type FileMeta struct {
	GeneratedBy interface{} `bson:"generated_by" json:"generated_by"`
	Format      string      `bson:"fomat" json:"format"`
	Width       int32       `bson:"width" json:"width"`
	Height      int32       `bson:"height" json:"height"`
	GeneratedAt time.Time   `bson:"generated_at" json:"generated_at"`
}

type Image struct {
	Id             string             `bson:"_id,omitempty" jsono:"_id,omitempty"`
	Prompt         string             `bson:"prompt" json:"prompt"`
	NegativePrompt string             `bson:"negative_prompt" json:"negative_prompt,omitempty"`
	Seed           int64              `bson:"seed" json:"seed"`
	Color          string             `bson:"color" json:"color"`
	UserId         interface{}        `bson:"user_id" json:"user_id"`
	GuidanceScale  float64            `bson:"guidance_scale" json:"guidance_scale"`
	ImageId        primitive.ObjectID `bson:"image_Id" json:"image_Id"`
	Collection     []interface{}      `bson:"collection" json:"collection,omitempty"`
}
