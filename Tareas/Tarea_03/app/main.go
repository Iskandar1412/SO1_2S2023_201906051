package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

var conexion = ConexionMysql()

func ConexionMysql() *sql.DB {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	connString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUser, dbPassword, dbHost, dbPort, dbName)

	conexion, err := sql.Open("mysql", connString)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("Conexion con MySQL Correcta")
	}
	return conexion
}

/*
CREATE TABLE music (

	id INT AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(50) NOT NULL,
	artist VARCHAR(50) NOT NULL,
	year INT NOT NULL,
	genre VARCHAR(50) NOT NULL

);
*/
type Datos struct {
	ID     int    `json:"id"`
	Title  string `json:"title"`
	Artist string `json:"artist"`
	Year   int    `json:"year"`
	Genre  string `json:"genre"`
}

func indexRoute(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to my api")
}

func registro(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	var dat Datos

	json.NewDecoder((request.Body)).Decode(&dat)
	//fmt.Println(&dat)
	conexion.Exec(`USE tarea3`)
	conexion.Exec(`SELECT * FROM music`)
	query := `INSERT INTO music(title, artist, year, genre) VALUES (?,?,?,?);`
	//fmt.Println(dat.Title, dat.Artist, dat.Year, dat.Genre)
	result, err := conexion.Exec(query, dat.Title, dat.Artist, dat.Year, dat.Genre)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(result)
	json.NewEncoder(response).Encode(dat)
}

func getMusic(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	var lista []Datos
	query := "select * from music;"
	result, err := conexion.Query(query)
	if err != nil {
		fmt.Println(err)
	}

	for result.Next() {
		var logc Datos

		err = result.Scan(&logc.ID, &logc.Title, &logc.Artist, &logc.Year, &logc.Genre)
		if err != nil {
			fmt.Println(err)
		}
		lista = append(lista, logc)
	}
	json.NewEncoder(response).Encode(lista)
}

func main() {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", indexRoute)
	router.HandleFunc("/reg", registro).Methods("POST")
	router.HandleFunc("/music", getMusic).Methods("GET")
	//-------------- Exponer el Puerto
	fmt.Println("Server on port", 8000)
	handler := cors.Default().Handler(router)
	log.Fatal((http.ListenAndServe(":8000", handler)))
	http.Handle("/", router)
}
