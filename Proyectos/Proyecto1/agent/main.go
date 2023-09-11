package main

import (
	"fmt"
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
	NombreEquipo  string     `json:"Nombre_equipo"`
	UsuarioActual string     `json:"Usuario_actual"`
	Proc          []Procesos `json:"Procesos"`
	UsoCPU        int        `json:"Uso_de_CPU"`
}

type Ram struct {
	total_ram         int `json:"total_ram"`
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
		pid := r.FormValue("pid")
		cmd := exec.Command("kill", "-9", pid)
		err := cmd.Run()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Fprintln(w, "Process '"+pid+"' Killed successfull")
	})
	http.ListenAndServe(":8080", nil)
}
