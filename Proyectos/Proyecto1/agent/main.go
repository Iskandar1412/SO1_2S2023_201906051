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
