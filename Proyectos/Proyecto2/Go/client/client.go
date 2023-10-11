//protoc --go_out=plugins=grpc:client proto/service.proto
//protoc --go_out=plugins=grpc:server proto/service.proto
//protoc --go_out=~/Escritorio/Proyectos/SO1_2S2023_201906051/Proyectos/Proyecto2/Go/proto --go-grpc_out=~/Escritorio/Proyectos/SO1_2S2023_201906051/Proyectos/Proyecto2/Go/proto ~/Escritorio/Proyectos/SO1_2S2023_201906051/Proyectos/Proyecto2/Go/proto/service.proto
//protoc --go_out=paths=source_relative:. --go-grpc_out=paths=source_relative:. service.proto
//go mod init cliente
//go mod tidy

//buscar archivo
//find / -name <nombre_archivo.extension> 2>/dev/null

package main

import (
	"context"
	"fmt"
	"log"

	"google.golang.org/grpc"
)

func main() {
	conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("No se pudo conectar a: %v", err)
	}
	defer conn.Close()
	c := definitions.NewGradeServiceClient(conn)
	grade := &definitions.Grade{
		Carnet:   22222,
		Nombre:   "Alumno 1",
		Curso:    "SO1",
		Nota:     90,
		Semestre: "2S",
		Year:     2023,
	}

	res, err := c.SubmitGrade(context.Background(), grade)
	if err != nil {
		log.Fatalf("Error al enviar los datos %v", err)
	}
	fmt.Printf("Respuesta del servidor: %v\n", res)
}
