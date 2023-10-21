// go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
//
// go mod init servidor
// go mod tidy
// sudo apt install protobuf-compiler
// sudo apt install protobuf
// sudo apt install golang-goprotobuf-dev
// sudo apt install protoc-gen-go
// protoc-gen-go --version
// protoc --version
package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net"
	pb "proyecto/proto" //agregado

	_ "github.com/go-sql-driver/mysql"
	"github.com/redis/go-redis/v9"
	"google.golang.org/grpc"
)

var ctx = context.Background()
var rdb *redis.Client
var db *sql.DB

type server struct {
	pb.UnimplementedGradeServiceServer
}

const (
	port = ":3256"
)

type Data struct {
	Carnet   int64
	Nombre   string
	Curso    string
	Nota     int64
	Semestre string
	Year     int64
}

func mysqlConnect() {
	//      root por defecto
	//      Gilgamesh@,14.12#= pass de db
	//      /proyect2    base de datos
	dsn := "root:Gilgamesh@,14.12#=@tcp(35.245.152.29:3306)/proyect2"
	var err error
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalln(err)
	}
	err = db.Ping()
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println("Conexión a MySQL exitosa")
}

func redisConnect() {
	rdb = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		fmt.Println("not Ok")
		//error en conectar redis
	} else {
		fmt.Println("Ok")
	}
}

func (s *server) SubmitGrade(ctx context.Context, grade *pb.CalificacionRequest) (*pb.ReplyInfo, error) {
	fmt.Printf("Solicitud para guardar calificación: %+v\n", grade.GetNombre())
	data := Data{
		Carnet:   grade.GetCarnet(),
		Nombre:   grade.GetNombre(),
		Curso:    grade.GetCurso(),
		Nota:     grade.GetNota(),
		Semestre: grade.GetSemestre(),
		Year:     grade.GetYear(),
	}
	insertMySQL(data)
	return &pb.ReplyInfo{Info: "Información recibida exitosamente"}, nil
}

func insertMySQL(rank Data) {
	quey := "INSERT INTO Estudiante (Carnet, Nombre, Curso, Nota, Semestre, Year) VALUES (?, ?, ?, ?, ?, ?)"
	_, err := db.ExecContext(ctx, quey, rank.Carnet, rank.Nombre, rank.Curso, rank.Nota, rank.Semestre, rank.Year)
	if err != nil {
		log.Println("Error en la inserción de información del alumno:", err)
	}
	data := map[string]interface{}{
		"Carnet":   rank.Carnet,
		"Nombre":   rank.Nombre,
		"Curso":    rank.Curso,
		"Nota":     rank.Nota,
		"Semestre": rank.Semestre,
		"Year":     rank.Year,
	}

	jsonData, err := json.Marshal(data)

	if err != nil {
		//fmt.Println()
	}

	err = rdb.Publish(ctx, "redis-local", jsonData).Err()

	if err != nil {
		fmt.Println("Error:", err)
	}
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("No se pudo escuchar el puerto %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterGradeServiceServer(s, &server{})

	fmt.Println("Conectando con DB de MySQL")
	mysqlConnect()
	redisConnect()
	fmt.Println("Servidor gRPC iniciado en puerto", port)

	if err := s.Serve(lis); err != nil {
		log.Fatalf("Error en : %v", err)
	}
}
