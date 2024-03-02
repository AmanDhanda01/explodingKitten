package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"errors"
	"github.com/go-redis/redis"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

var client *redis.Client

type UserScore struct {
	Username string `json:"username"`
	Score    int    `json:"score"`
}

func initRedis() {
	client = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379", // Redis server address
		Password: "",                // No password set
		DB:       0,                 // Use default DB
	})

	_, err := client.Ping().Result()
	if err != nil {
		log.Fatal(err)
	}
}

func CreateUserScore(w http.ResponseWriter, r *http.Request) {
	var userScore UserScore
	err := json.NewDecoder(r.Body).Decode(&userScore)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Check if username already exists
	exists, err := client.HExists("users", userScore.Username).Result()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if exists {
		return
	}

	// Add user to the database
	err = client.HSet("users", userScore.Username, userScore.Score).Err()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func GetAllUserScores(w http.ResponseWriter, r *http.Request) {
	userScores, err := client.HGetAll("users").Result()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var users []UserScore
	for username, scoreStr := range userScores {
		score := 0
		fmt.Sscanf(scoreStr, "%d", &score)
		users = append(users, UserScore{Username: username, Score: score})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func GetUserScoreHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	username := params["username"]

	score, err := client.HGet("users", username).Result()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if score == "" {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	newScore, err := strconv.Atoi(score)


	userScore := UserScore{
		Username: username,
		Score:   newScore, // Convert string score to int
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(userScore)
}
func UpdateUserScore(username string, score int) error {
	// Check if username already exists
	exists, err := client.HExists("users", username).Result()
	if err != nil {
		return err
	}

	if !exists {
		// Return an error indicating that the user does not exist
		return errors.New("user not found")
	}

	// Update user score
	err = client.HSet("users", username, score).Err()
	if err != nil {
		return err
	}

	return nil
}


func UpdateUserScoreHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	username := params["username"]

	var userScore UserScore
	err := json.NewDecoder(r.Body).Decode(&userScore)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = UpdateUserScore(username, userScore.Score)
	if err != nil {
		if err.Error() == "user not found" {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	w.WriteHeader(http.StatusOK)
}




func main() {
	initRedis()

	router := mux.NewRouter()

	router.HandleFunc("/user", CreateUserScore).Methods("POST")
	router.HandleFunc("/users", GetAllUserScores).Methods("GET")
	router.HandleFunc("/user/{username}", GetUserScoreHandler).Methods("GET")
	router.HandleFunc("/user/{username}", UpdateUserScoreHandler).Methods("PUT")



	// Enable CORS with allowed origins, methods, and headers
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:3000"}), // Adjust as needed
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	log.Fatal(http.ListenAndServe(":8080", corsHandler(router)))
}
