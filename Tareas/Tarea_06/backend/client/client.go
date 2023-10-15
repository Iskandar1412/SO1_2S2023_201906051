package main

import (
	"context"
	"fmt"
	"log"
	pb "servidor/proto"

	"github.com/gofiber/fiber/v2"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var ctx = context.Background()

type Data struct {
	Album   string
	Artista string
	Year    string
}

func insertData(c *fiber.Ctx) error {
	var data map[string]string
	e := c.BodyParser(&data)
	if e != nil {
		return e
	}
	rank := Data{
		Album:   data["album"],
		Artista: data["artista"],
		Year:    data["year"],
	}

	go sendRedis(rank)
	return nil
}

func sendRedis(rank Data) {
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
		Album:   rank.Album,
		Artista: rank.Artista,
		Year:    rank.Year,
	})
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println("Respuesta del servidor:", ret.GetInfo())
}

func main() {
	app := fiber.New()
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"res": "ok",
		})
	})
	app.Post("/insertData", insertData)

	err := app.Listen(":3255")
	if err != nil {
		return
	}
}
