package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

type RamInfo struct {
	TotalRAM        uint64 `json:"total_ram"`
	RAMInUse        uint64 `json:"Ram_en_uso"`
	RAMFree         uint64 `json:"Ram_libre"`
	PercentageInUse int    `json:"Porcentaje_en_uso"`
}

func main() {
	http.HandleFunc("/ram-info", func(w http.ResponseWriter, r *http.Request) {
		ramInfo, err := readRamInfo()
		if err != nil {
			http.Error(w, "Error reading RAM info", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(ramInfo)
	})

	server := &http.Server{
		Addr:         ":8000",
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	fmt.Println("Backend server is running on :8000")
	server.ListenAndServe()
}

func readRamInfo() (*RamInfo, error) {
	content, err := ioutil.ReadFile("/proc/ram_201906051")
	if err != nil {
		return nil, err
	}

	var ramInfo RamInfo
	err = json.Unmarshal(content, &ramInfo)
	if err != nil {
		return nil, err
	}

	return &ramInfo, nil
}
