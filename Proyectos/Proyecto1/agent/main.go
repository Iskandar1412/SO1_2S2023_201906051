package main

import (
	"fmt"
	"net/http"
	"os/exec"
)

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
