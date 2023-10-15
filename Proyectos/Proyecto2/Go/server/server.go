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
	"fmt"
	"log"
	"net"
	pb "proyecto/proto" //agregado

	_ "github.com/go-sql-driver/mysql"
	"google.golang.org/grpc"
)

var ctx = context.Background()
var db *sql.DB

type server struct {
	pb.UnimplementedGradeServiceServer
}

const (
	port = ":50051"
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
	dsn := "<usuario>:<password>@tcp(host:port)"
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

func (s *server) SubmitGrade(ctx context.Context, grade *pb.CalificacionRequest) (*pb.ReplyInfo, error) {
	fmt.Printf("Solicitud para guardar calificación: %+v\n", grade)
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
	quey := "INSERT INTO alumno (carnet, nombre, curso, nota, semestre, year) VALUES (?, ?, ?, ?, ?, ?)"
	_, err := db.ExecContext(ctx, quey, rank.Carnet, rank.Nombre, rank.Curso, rank.Nota, rank.Semestre, rank.Year)
	if err != nil {
		log.Println("Error en la inserción de información del alumno:", err)
	}
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("No se pudo escuchar el puerto %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterGradeServiceServer(s, &server{})

	mysqlConnect()

	fmt.Println("Servidor gRPC iniciado en puerto", port)

	if err := s.Serve(lis); err != nil {
		log.Fatalf("Error en : %v", err)
	}
}
