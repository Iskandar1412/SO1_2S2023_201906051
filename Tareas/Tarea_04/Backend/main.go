package main

// go mod init <nombre modulo>
// go mod tidy

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

type info struct {
	total_ram      uint64 `json:"total_ram"`
	ram_in_use     uint64 `json:"ram_en_uso"`
	ram_libre      uint64 `json:"ram_libre"`
	porcentaje_uso uint64 `json:"porcentaje_uso"`
}

func getInfo() (info, error) {
	resp, err := http.Get("http://localhost:8000/proc/ram_info")
	if err != nil {
		return info{}, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return info{}, err
	}

	var info_ram info
	err = json.Unmarshal(body, &info_ram)
	if err != nil {
		return info{}, err
	}

	return info_ram, nil
}

func main() {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		info_ram, err := getInfo()
		if err != nil {
			fmt.Println("Error al obtener información de la RAM", err)
			continue
		}

		fmt.Printf("Total Ram: %d MB, RAM en Uso %d MB, RAM libre %d MB, Porcentaje en uso %d%%\n", info_ram.total_ram/1024/1024, info_ram.ram_in_use/1024/1024, info_ram.ram_libre/1024/1024, info_ram.porcentaje_uso)
	}
}
