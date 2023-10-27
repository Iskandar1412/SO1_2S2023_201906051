//protoc --go_out=. --go-grpc_out=. service.proto
//go mod init cliente
//go mod tidy

//buscar archivo
//find / -name <nombre_archivo.extension> 2>/dev/null

package main

import (
	"context"
	"fmt"
	"log"

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
	var data map[string]interface{}
	e := c.BodyParser(&data)
	if e != nil {
		return e
	}

	carnet, ok := data["carnet"].(float64)
	if !ok {
		return fmt.Errorf("carnet is not a valid number")
	}

	nota, ok := data["nota"].(float64)
	if !ok {
		return fmt.Errorf("nota is not a valid number")
	}

	year, ok := data["year"].(float64)
	if !ok {
		return fmt.Errorf("year is not a valid number")
	}

	rank := Data{
		Carnet:   int64(carnet),
		Nombre:   data["nombre"].(string),
		Curso:    data["curso"].(string),
		Nota:     int64(nota),
		Semestre: data["semestre"].(string),
		Year:     int64(year),
	}

	go sendMyslqServer(rank)
	return nil
}

func sendMyslqServer(rank Data) {
	fmt.Println("enviado para server") //sería localhost (server-service) de lo que es el cluster
	conn, err := grpc.Dial("server-service:3256", grpc.WithTransportCredentials(insecure.NewCredentials()), grpc.WithBlock())
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

	fmt.Println("Respuesta del servidor gRPC: ", ret.GetInfo())
}

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"res": "ok",
		})
	})

	app.Post("/agregarAlumno", insertData)

	err := app.Listen(":3255")
	if err != nil {
		return
	}

}
