// go mod init <nombre_modulo (main)>
package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

type Song struct {
	Title  string `json:"title"`
	Artist string `json:"artist"`
	Year   string `json:"year"`
	Genre  string `json:"genre"`
}

var db *sql.DB

func main() {
	db, _ = sql.Open("mysql", "root:Gilgamesh@14.12#@tcp(db:3306)/music_library")
	defer db.Close()
	router := mux.NewRouter()
	router.HandleFunc("/songs", createSong).Methods("POST")
	router.HandleFunc("/songs", getSongs).Methods("GET")
	log.Fatal(http.ListenAndServe(":8000", router))
}

func createSong(w http.ResponseWriter, r *http.Request) {
	var song Song
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&song); err != nil {
		http.Error(w, "Invalid data", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()
	_, err := db.Exec("INSERT INTO music_library (title, artist, year, genre) VALUES (?,?,?,?)", song.Title, song.Artist, song.Year, song.Genre)
	if err != nil {
		http.Error(w, "Error ingresando datos", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func getSongs(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT title, artist, year, genre FROM music_library")
	if err != nil {
		http.Error(w, "Error buscando datos", http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	var songs []Song
	for rows.Next() {
		var song Song
		if err := rows.Scan(&song.Title, &song.Artist, &song.Year, &song.Genre); err != nil {
			http.Error(w, "Error escaneando datos", http.StatusInternalServerError)
			return
		}
		songs = append(songs, song)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(songs)
}
