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
	"strconv"

	pb "proyecto/proto" //agregado

	"github.com/gofiber/fiber/v2"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var ctx = context.Background()

type Data struct {
	Carnet   int64
	Nombre   string
	Curso    string
	Nota     int64
	Semestre string
	Year     int64
}

func insertData(c *fiber.Ctx) error {
	var data map[string]string
	e := c.BodyParser(&data)
	if e != nil {
		return e
	}
	//n, car := strconv.ParseInt(data["carnet"], 10, 64)
	carnet, err := strconv.ParseInt(data["carnet"], 10, 64)
	if err != nil {
		return err
	}

	nota, err := strconv.ParseInt(data["nota"], 10, 64)
	if err != nil {
		return err
	}

	year, err := strconv.ParseInt(data["year"], 10, 64)
	if err != nil {
		return err
	}

	rank := Data{
		Carnet:   carnet,
		Nombre:   data["nombre"],
		Curso:    data["curso"],
		Nota:     nota,
		Semestre: data["semestre"],
		Year:     year,
	}

	go sendMyslqServer(rank)
	return nil
}

func sendMyslqServer(rank Data) {
	conn, err := grpc.Dial("localhost:", grpc.WithTransportCredentials(insecure.NewCredentials()), grpc.WithBlock())
	if err != nil {
		log.Fatalf("No se pudo conectar a: %v", err)
	}

	cl := pb.NewGradeServiceClient(conn)
	defer func(conn *grpc.ClientConn) {
		err := conn.Close()
		if err != nil {
			log.Fatalln(err)
		}
	}(conn)

	ret, err := cl.SubmitGrade(ctx, &pb.CalificacionRequest{
		Carnet:   rank.Carnet,
		Nombre:   rank.Nombre,
		Curso:    rank.Curso,
		Nota:     rank.Nota,
		Semestre: rank.Semestre,
		Year:     rank.Year,
	})

	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println("Respuesta del servidor: ", ret.GetInfo())
}

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"res": "ok",
		})
	})

	app.Post("/insert", insertData)

	err := app.Listen(":50051")
	if err != nil {
		return
	}

	/*
		conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
		if err != nil {
			log.Fatalf("No se pudo conectar a: %v", err)
		}
		defer conn.Close()
		c := pb.NewGradeServiceClient(conn)
		grade := &pb.Grade{
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
	*/
}
