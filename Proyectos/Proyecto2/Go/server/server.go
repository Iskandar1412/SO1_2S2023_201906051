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
	"fmt"
	"log"
	"net"

	pb "servicioproto/proto" //agregado

	"google.golang.org/grpc"
)

type server struct{}

func (s *server) SubmitGrade(ctx context.Context, grade *pb.Grade) (*pb.Grade, error) {
	fmt.Printf("Solicitud para guardar calificación: %+v\n", grade)

	return grade, nil
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("No se pudo escuchar el puerto %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterGradeServiceServer(s, &server{})

	fmt.Println("Servidor gRPC iniciado en puerto 50051")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("Error en : %v", err)
	}
}
