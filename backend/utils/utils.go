package utils

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"io"
	"log"
)

func GenerateRandomString(length int) (string, error) {
	bytes := make([]byte, length)

	_, err := rand.Read(bytes)

	if err != nil {
		return "", err
	}

	return base64.URLEncoding.EncodeToString(bytes), nil
}

func GetValue[T interface{}](val interface{}, p *T) error {
	if v, ok := val.(T); ok {
		*p = v
		return nil
	} else {
		return errors.New("not a valid type")
	}
}

func GetSkipLimit(page int, limit int) (int, int) {
	skip, limit := (page - 1*limit), limit
	if skip < 0 {
		skip = 0
	}
	return skip, limit
}

func Some[T interface{}](arr []T, cb func(v T, i int) bool) bool {
	if len(arr) == 0 {
		return false
	}
	for i, val := range arr {
		if cb(val, i) {
			return true
		}
	}
	return false
}

func Pump(r io.Reader, w ...io.Writer) error {
	buf := make([]byte, 1024)
	mw := io.MultiWriter(w...)
	for {
		if n, err := r.Read(buf); err != nil {
			if err == io.EOF {
				if n <= 0 {
					clear(buf)
					break
				}
			} else {
				log.Printf("Error reading data: %v\n", err)
				return err
			}
		} else {
			if _, err = mw.Write(buf[:n]); err != nil {
				log.Printf("Error while writing data: %v\n", err)
				return err
			}
		}
	}
	return nil
}
