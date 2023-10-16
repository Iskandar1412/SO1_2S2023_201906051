package main

//para ver si la información esta
//redis-cli
//SELECT 1
//KEYS *
//GET <nombre_key>
//para vaciar las keys de redis
//FLUSHALL

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"
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
	Album   string `json:"album"`
	Artista string `json:"artista"`
	Year    string `json:"year"`
}

func redisConnect() {
	rdb = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379", // Cambia la dirección y el puerto de acuerdo a tu configuración
		Password: "",               // Contraseña de Redis si es necesario
		DB:       1,                // Número de la base de datos
	})

	// Realiza un ping para asegurarte de que la conexión a Redis se establezca correctamente
	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		log.Fatalf("Error al conectar a Redis: %v", err)
	}
	fmt.Println("Conexión exitosa a Redis")
}

func (s *server) SubmitGrade(ctx context.Context, in *pb.CalificacionRequest) (*pb.ReplyInfo, error) {
	//println(in)
	data := Data{
		Album:   in.GetAlbum(),
		Artista: in.GetArtista(),
		Year:    in.GetYear(),
	}
	insertRedis(data)
	return &pb.ReplyInfo{Info: "Información recibida"}, nil
}

func getNumber() (int64, error) {
	keys, err := rdb.Keys(ctx, "album_*").Result()
	if err != nil {
		return 0, err
	}

	highest := int64(0)
	for _, key := range keys {
		var number int64
		fmt.Sscanf(key, "album_%d", &number)
		if number > highest {
			highest = number
		}
	}

	next := highest + 1
	return next, nil
}

func insertRedis(rank Data) {
	// Generar una nueva clave única para cada entrada en Redis
	//fmt.Println(rank)

	newnumber, err := getNumber()
	if err != nil {
		log.Fatalln(err)
	}
	key := fmt.Sprintf("album_%d", newnumber)

	// Crear un mapa de datos
	data := map[string]string{
		"album":   rank.Album,
		"artista": rank.Artista,
		"year":    rank.Year,
	}

	// Serializar el mapa a JSON
	jsonData, err := json.Marshal(data)
	if err != nil {
		fmt.Println("Error al serializar a JSON:", err)
	}
	//fmt.Println(string(jsonData))

	// Almacenar los datos en un hash set en Redis
	//key := "album_" + string(rdb.Incr(context.Background(), "album_counter").Val())
	err = rdb.Set(context.Background(), key, jsonData, 0).Err()
	if err != nil {
		log.Fatalln(err)
	}

	log.Printf("Datos insertados en Redis con clave única %s\n", key)
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
