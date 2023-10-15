package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"redis"
	pb "servidor/proto"

	"github.com/redis/go-redis/v9"
	"google.golang.org/grpc"
)

var ctx = context.Background()
var rdb *redis.Client

type server struct {
	pb.UnimplementedGradeServiceServer
}

const (
	port = ":3256"
)

type Data struct {
	Album   string
	Artista string
	Year    string
}

func redisConnect() {
	rdb = redis.NewClient(&redis.Options{
		Addr:     "localhost",
		Password: "",
		DB:       0,
	})
	pong, err := rdb.Ping(ctx).Result()
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println(pong)
}

func (s *server) SubmitGrade(ctx context.Context, grade *pb.CalificacionRequest) (*pb.ReplyInfo, error) {
	data := Data{
		Album:   in.GetAlbum(),
		Artista: in.GetArtista(),
		Year:    in.GetYear(),
	}

}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalln(err)
	}
	s := grpc.NewServer()
	pb.RegisterGradeServiceServer(s, &server{})
	redisConnect()
	if err := s.Serve(lis); err != nil {
		log.Fatalln(err)
	}
}
