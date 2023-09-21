package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os/exec"
)

type Procesos struct {
	Proceso  string `json:"Proceso"`
	PID      int    `json:"PID"`
	UID      int    `json:"UID"`
	Estado   string `json:"Estado"`
	MemoriaV int    `json:"Memoria_virtual"`
	MemoriaF int    `json:"Memoria_fisica"`
}

type InfoCPU struct {
	NombreEquipo string     `json:"Nombre_equipo"`
	Proc         []Procesos `json:"Procesos"`
	UsoCPU       int        `json:"Uso_de_CPU"`
	//UsuarioActual string     `json:"Usuario_actual"`
}

type Ram struct {
	Total_ram         int `json:"total_ram"`
	Ram_en_uso        int `json:"Ram_en_uso"`
	Ram_libre         int `json:"Ram_libre"`
	Porcentaje_en_uso int `json:"Porcentaje_en_uso"`
}

type InfoRam struct {
	Nombre_equipo string `json:"Nombre_equipo"`
	Uso_ram       []Ram  `json:"Uso_ram"`
}

func main() {
	http.HandleFunc("/kill", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
			return
		}

		// Leer el cuerpo de la solicitud POST
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error al leer el cuerpo de la solicitud", http.StatusBadRequest)
			return
		}

		// Extraer el PID del cuerpo de la solicitud
		pid := string(body)
		fmt.Println("Borrar proceso", pid)
		cmd := exec.Command("kill", "-9", pid)
		err = cmd.Run()
		if err != nil {
			fmt.Println("Error en la ejecución")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Fprintln(w, "Proceso '"+pid+"' eliminado exitosamente")
	})
	http.HandleFunc("/ram-info", func(w http.ResponseWriter, r *http.Request) {
		ramInfo, err := readRamInfo()
		if err != nil {
			http.Error(w, "Error leyendo información del Módulo RAM", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(ramInfo)
	})
	http.HandleFunc("/cpu-info", func(w http.ResponseWriter, r *http.Request) {
		cpuinfo, err := readCPUInfo()
		if err != nil {
			fmt.Println(err)
			http.Error(w, "Error leyendo información del Módulo CPU", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(cpuinfo)
	})
	fmt.Println("Backend server is running on :8080")
	http.ListenAndServe(":8080", nil)
}

func readRamInfo() (*InfoRam, error) {
	content, err := ioutil.ReadFile("/proc/ram_201906051")
	if err != nil {
		return nil, err
	}
	var infoRam InfoRam
	err = json.Unmarshal(content, &infoRam)
	if err != nil {
		return nil, err
	}
	return &infoRam, nil
}

func readCPUInfo() (*InfoCPU, error) {
	content, err := ioutil.ReadFile("/proc/cpu_201906051")
	if err != nil {
		return nil, err
	}
	var infocpu InfoCPU
	err = json.Unmarshal(content, &infocpu)
	if err != nil {
		return nil, err
	}
	return &infocpu, nil
}
