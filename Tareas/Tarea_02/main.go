package main

//go mod init <nombre_modulo (main)>

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Student struct {
	Carnet string `json:"carnet"`
	Name   string `json:"name"`
}

func getData(w http.ResponseWriter, r *http.Request) {
	student := Student{
		Carnet: "201906051",
		Name:   "Juan Urbina",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(student)
}

func main() {
	http.HandleFunc("/data", getData)
	//port := 3200
	fmt.Println("Server on port: 8080")
	http.ListenAndServe(":8080", nil)
}
