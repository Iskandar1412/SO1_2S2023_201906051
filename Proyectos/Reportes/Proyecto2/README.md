# Manual Técnico (Proyecto 2 Sistemas Operativos 1 "N")

## Introducción

<p style="text-align: justify;">
Dentro del proyecto final (Proyecto 2) del Laboratorio de Sistemas Operativos 1 Sección "N", fue un proyecto que fue realizado por medio de Kubernetes Engine el cual contendrá el proyecto en sí PODs de los servicios gRPC, API Redis (Python), base de datos de Redis, backend de NodeJS y el Ingress de Nginx con balanceo de datos al 50% de carga de datos con la aplicación de API Redis y el otro 50% de carga de datos con el cliente de gRPC; Cloud SQL el cual tiene una base de datos al igual que es para Redis, para el almacenamiento de información; el Cloud Run que contiene el Fronted de React mediante una imagen subida por medio de Container Registry (Otro servicio de Google Cloud); Generador de Trafico de Locust que envía postea al servicio de Ingress la información.

Se empleo el lenguaje de programación Go para las aplicaciones de gRPC del cliente y de servidor para la obtención de la información del servidor de Locust y enviar la información a la base de datos de Cloud SQL; el lenguaje de programación de Python para la creación de la Api Redist que obtiene la información de Locust de la misma forma o forma similar que los servicios de gRPC, con la diferencia que este envia la información tanto a la base de datos de Cloud SQL como de la base de datos de Redis y la creación de la aplicación de Locust; NodeJS para la creación del backend que conecta por medio de SOCKET IO con el fronted de React; React (JavaSript) para la creación del fronted que conecta por medio de SOCKET IO con el backend de NodeJS. Por último se utilizo el lenguaje compilado de Protobuf para la generación de los servicios de gRPC del cliente y del servidor. El cluster de Kubernetes para este proyecto conto con 5 nodos.

Se pudo determinar que en la implementación de los servicios dentro de Kubernetes y la escritura/lectura de información en las bases de datos de Cloud SQL y Redis no mostraron ningun problema en su ejecución y uso.
</p>

## Requisitos del Sistema

>- **_Sistema Operativo:_** Ubuntu 20.04 o superior
>- **_CPU:_** Intel Pentium D o AMD Athlon 64 (K8) 2.6GHz. (Requisitos Mínimo)
>- **_RAM:_** 4Gb
>- **_Lenguajes Utilizados:_** Go, Markdown, JavaScript, Python, Protobuf
>- **_Base de Datos:_** MySQL, Redis
>- **_Contenedores:_** Docker, Dockerhub
>- **_Kubernetes:_** Kubenetes Engine (Google Cloud)
>- **_Kubectl Version:_** 1.28.3 (Client Version)
>- **_Kubectl Version:_** 5.0.4-0.20230601165947-6ce0bf390ce3 (Kustomize Version)
>- **_Kubectl Version:_** 1.27.3-gke.100 (Server Version)
>- **_IDE:_** Visual Studio Code
>- **_Servicios gRPC:_** Go 1.21.1
>- **_USO de Framework (Backend):_** NodeJS
>- **_USO de Framework (Frontend):_** React
>- **_Entorno grafico de Kubernetes:_** Lens (Kubernetes)

## Requisitos del Proyecto:

### NodeJS

>- **_"cors":_** "^2.8.5"
>- **_"express":_** "^4.18.2"
>- **_"ioredis":_** "^5.3.2"
>- **_"mysql2":_** "^3.6.2"
>- **_"socket.io":_** "^4.7.2"

### React 

#### Dependencies

>- **_"@testing-library/jest-dom":_** "^5.16.5"
>- **_"@testing-library/react":_** "^13.4.0"
>- **_"@testing-library/user-event":_** "^13.5.0"
>- **_"axios":_** "^1.4.0"
>- **_"body-parser":_** "^1.20.2"
>- **_"chart.js":_** "^4.4.0"
>- **_"faker":_** "^6.6.6"
>- **_"fusioncharts":_** "^3.20.0"
>- **_"react":_** "^18.2.0"
>- **_"react-chartjs-2":_** "^5.2.0"
>- **_"react-dom":_** "^18.2.0"
>- **_"react-draggable":_** "^4.4.5"
>- **_"react-fusioncharts":_** "^4.0.0"
>- **_"react-graphviz":_** "^0.7.0"
>- **_"react-scripts":_** "5.0.1"
>- **_"redis":_** "^4.6.10"
>- **_"socket.io-client":_** "^4.7.2"
>- **_"web-vitals":_** "^2.1.4"

#### devDependencies

>- **_"@types/d3":_** "^7.4.0",
>- **_"@types/d3-graphviz":_** "^2.6.7",
>- **_"@types/file-saver":_** "^2.0.5",
>- **_"@types/lodash":_** "^4.14.182",
>- **_"@types/node":_** "^16.18.23",
>- **_"@types/react":_** "^18.0.35",
>- **_"@types/react-anchor-link-smooth-scroll":_** "^1.0.2",
>- **_"electron":_** "^24.8.3",
>- **_"fs-extra":_** "^11.1.1",
>- **_"path-browserify":_** "^1.0.1",
>- **_"tslint":_** "^5.12.1",
>- **_"webpack-cli":_** "^5.0.2"

### Go

>- `"context"`
>- `"fmt"`
>- `"log"`

#### Client

>- `"github.com/gofiber/fiber/v2"`
>- `"google.golang.org/grpc"`
>- `"google.golang.org/grpc/credentials/insecure"`

#### Server

>- `"database/sql"`
>- `"net"`
>- `_ "github.com/go-sql-driver/mysql"`
>- `"google.golang.org/grpc"`

## Explicación del Código

### Generador de Trafico (LOCUST)

Este obtendrá la información de un archivo Json de la siguiente estructura:

```
{
    "carnet": 197355621,
    "nombre": "Alumno 1",
    "curso": "AYD1",
    "nota": 63,
    "semestre": "2S",
    "year": 2023
}
```

Con el siguiente código:

```
class file_to_open:
    def __init__(self):
        self.data = []
    
    def getData(self):
        size = len(self.data)
        if size > 0:
            index = randrange(0, size - 1) if size > 1 else 0
            return self.data.pop(index)
        else:
            print('size -> 0')
            return None
    
    def load_file(self):
        print("Cargando ...")
        try:
            with open('./data.json', 'r', encoding='utf-8') as file:
                self.data = json.loads(file.read())
                print('ok data...')
                file.close()
        except:
            print(f'Error : {Exception}')
```

El cual abre el archivo json y envia la información por medio del Ingress de Nginx con el siguiente fragmento de código:

```
class Traffic_Generator(HttpUser):
    wait_time = between(0.1, 0.9) #tiempo espera entre registros
    reader = file_to_open()
    reader.load_file()
    
    def on_start(self):
        print('On Start')
    
    @task
    def sendMessage(self):
        data = self.reader.getData()
        print('Sending data to client') 
        if data is not None:
            res = self.client.post("/agregarAlumno", json=data)
            response = res.json()
            print(response)
        else:
            print('Empty')
            self.stop(True)
```

En el cual Traffic_Generator por medio de `@task` se encarga de parsear el archivo json por de grupo por grupo de información a lo que es el cliente de gRPC y el API Redis, para correr el archivo se usa el siguiente comando `python3 -m venv venv` para crear la carpeta del entorno virtual, con el siguiente comando `source venv/bin/activate` activamos el entorno virtual para luego instalar locust con el siguiente comando `pip install locust`, con ello instalado (en caso de que no hubiera estado instalado), se procede a correr el archivo con el siguiente comando `locust -f traffic_generator.py`, abriendo de esta forma en el `localhost:8089` el servidor de locust. En el servidor de locust para ingresar pide un host para postear la información en un tiempo determinado para lo cual se utilizará la IP de Nginx creada `http://35.202.6.186.nip.io` y con ello procedera a enviar peticiones `POST` a los servicios correspondientes.

### GO

#### Client

El siguiente código hace mediante el puerto `3255` en la dirección `/agregarAlumno` que se inserta la información de Locust mediante la función `insertData`

```
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
```

Con la función de `insertData` se encarga de parsear la información y mapearla, para luego pasarla a la función de `sendMyslqServer` el cual busca el servicio gRPC `server-service` que está en el puerto `3256`, enviando la información mediante credenciales.

```
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
```

#### Server

Este conecta con la base de datos de Cloud SQL mediante la siguiente función:

```
func mysqlConnect() {
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
```

Mostrando un mensaje en el que se logre conectar y un error para decir que no se pudo conectar con la base de datos. Este se conectará con el puerto `3256` y va a recibir por medio de una conexión `tcp` la información que sea enviada del cliente de gRPC.

```
const (
	port = ":3256"
)

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("No se pudo escuchar el puerto %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterGradeServiceServer(s, &server{})
	fmt.Println("Conectando con DB de MySQL")
	mysqlConnect()
	fmt.Println("Servidor gRPC iniciado en puerto", port)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("Error en : %v", err)
	}
}
```

Obteniendo la información mediante la función `SubmitGrade` que pertenece a las funciones declaradas en Protobuf y enviandolas a la función `insertMySQL` el cual ya hace la inserción de la información en la base de datos de Cloud SQL.

```
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
}
```

### Protobuf

Este será el esqueleto que utilizará Go para las peticiones que hará locust.

```
syntax = "proto3";

option go_package = "./proto";
package proto;

message CalificacionRequest {
    int64 carnet = 1;
    string nombre = 2;
    string curso = 3;
    int64 nota = 4;
    string semestre = 5;
    int64 year = 6;
}

message replyInfo {
    string info = 1;
}

service GradeService {
    rpc SubmitGrade (CalificacionRequest) returns (replyInfo) {};
}
```

Es el esqueleto en lo que se van a basar los servicios gRPC para la verificación, y manejo de la información recibida.

### API Redis

Este Tiene la función de enviar tanto a la base de datos de MySQL como la de Redis la información mediante las siguiente conexiones:

```
redis_client = redis.StrictRedis(host='redis-service', port=6379, db=0) #cambiando localhost por redis-service
db_config = {
    'user': 'root',
    'password': 'Gilgamesh@,14.12#=',
    'host': '35.245.152.29',
    'database': 'proyect2',
}
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()
```

Con el siguiente código `info` tendrá lo que es la estructura del alumno que se va a ingresar; tambien se tiene la función `getNumber()` el cuál se encarga de contar los alumnos ya ingresados en la base de datos de Redis y agregarle un valor diferente para que no se repitan las llaves únicas, o sea que, Redis maneja información mediante llaves únicas que en este caso serían `alumno_x` donde `x` representa un valor numérico del alumno insertado en la base de datos de Redis

```
class info:
    def __init__(self, carnet, nombre, curso, nota, semestre, year):
        self.carnet = carnet
        self.nombre = nombre
        self.curso = curso
        self.nota = nota
        self.semestre = semestre
        self.year = year

def getNumber():
    keys = redis_client.keys('alumno_*')
    highest = 0
    for key in keys:
        try:
            nokey = key.decode('utf-8')
            number = int(nokey.split('_')[1])
        except ValueError:
            continue
        if number > highest:
            highest = number
    next = highest + 1
    return next
    

@app.route('/agregarAlumno', methods=['POST'])
def agregarAlumno():
    try:
        data = request.json
        alumno = info(
            data['carnet'],
            data['nombre'],
            data['curso'],
            data['nota'],
            data['semestre'],
            data['year']
        )
        
        json_alumno = {
            "Carnet": alumno.carnet,
            "Nombre": alumno.nombre,
            "Curso": alumno.curso,
            "Nota": alumno.nota,
            "Semestre": alumno.semestre,
            "Year": alumno.year
        }
        insert_query = "INSERT INTO Estudiante (Carnet, Nombre, Curso, Nota, Semestre, Year) VALUES (%s, %s, %s, %s, %s, %s)"
        data_insert = (alumno.carnet, alumno.nombre, alumno.curso, alumno.nota, alumno.semestre, alumno.year)
        cursor.execute(insert_query, data_insert)
        conn.commit()
    except Exception as e:
        return str(e), 500
    
    key = f'alumno_{getNumber()}'
    json_alumno_str = json.dumps(json_alumno)
    redis_client.set(key, json_alumno_str)
    redis_client.publish('redis-local', json_alumno_str)
    print('Alumno registrado:', alumno.nombre)
    return { 'msg': 'Alumnos registrados: {}'.format(getNumber() - 1)}
```

Por último se tiene la ruta de posteo `agregarAlumno` la cual mediante las funciones y clases anteriores va a insertar tanto en la base de datos de Cloud SQL como en la base de datos de Redis la información que recibe de Locust por medio del `Ingress`

`Nota:` Para hacer un docker de una aplicación de Python, este requiere de un archivo `requirements.txt` en el cual en este caso utiliza los siguientes:

- Flask==2.3.3
- Flask-BasicAuth==0.2.0
- Flask-Cors==4.0.0
- mysql-connector-python==8.1.0
- mysqlclient==2.1.1
- redis==5.0.1
- requests==2.25.1
- simplejson==3.19.2

Las versiones pueden variar según la fecha o año.

### NodeJS (Backend)

Mediante las siguientes importaciones: 

const mysql = require('mysql2');
const Redis = require('ioredis');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

Se harán las conexiones tanto para que cualquier IP se pueda conectar y hacer peticiones `GET` que en este caso es más para `SOCKET IO` que obtiene la información a tiempo real.

```
const app = express();
app.use(cors()); // Configura CORS

// Crear un servidor HTTP con Express
const server = http.createServer(app);

// Configurar Socket.io en el servidor
const io = new Server(server, {
    cors: {
        origin: '*', // Origen permitido (tu aplicación de React)
        methods: ['GET', 'POST'],
    },
});

//ioredis
// Redis para operaciones de suscripción
const redisSubscriber = new Redis({
    host: 'redis-service', //34.134.109.230
    port: 6379
});

redisSubscriber.on('connect', function() {
    console.log('Conectado a Redis para suscripciones');
});

// Redis para comandos regulares
const redis = new Redis({
    host: 'redis-service', //34.134.109.230
    port: 6379
});

redis.on('connect', function() {
    console.log('Conectado a Redis para comandos regulares');
});

redis.on('error', (err) => {
    console.error('Error de conexión a Redis:', err);
});

const db = mysql.createConnection({
    host: '35.245.152.29',
    user: 'root',
    password: 'Gilgamesh@,14.12#=',
    database: 'proyect2',
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar con MySQL:', err);
    } else {
        console.log('Conexión a MySQL exitosa');
    }
});

db.on('error', (err) => {
    console.error('Error consulta con MySQL:', err);
});
```

De esta forma podrá emitir por medio del `socket.emit` la información que pide React en el Fronted

```
let activeSockets = 0; // Contador de conexiones activas

io.on('connection', async (socket) => {
    activeSockets++; // Incrementa el contador cuando un cliente se conecta
    
    socket.on('disconnect', () => {
        activeSockets--; // Decrementa el contador cuando un cliente se desconecta
        console.log('Cliente desconectado');
    });

    socket.on('request-redis-data', async () => {
        try {
            const keys = await redis.keys('alumno_*');
            const redisData = [];
            for (const key of keys) {
                const data = await redis.get(key);
                const jsonData = JSON.parse(data);
                redisData.push(jsonData);
            }
            socket.emit('redis-dot', redisData);
        } catch (e) {
            console.error('Error en la obtención de datos de Redis:', e);
        }
    });

    socket.on('request-mysql-data', () => {
        const query = "SELECT * FROM Estudiante";
        db.query(query, (error, results) => {
            if (error) {
                console.error('Error al consultar MySQL:', error);
            } else {
                socket.emit('mysql-data', results);
            }
        });
    });

    redisSubscriber.subscribe('redis-local');
    redisSubscriber.on('message', (channel, message) => {
        if (channel === 'redis-local') {
            const jsonData = JSON.parse(message);
            socket.emit('redis-local', jsonData);
        }
    });
});
```

Teniendo tambien un manejo del cierre de la aplicación

```
process.on('exit', () => {
    try {
        redis.quit();
        redisSubscriber.quit()
    } catch (e) {
        console.error('Error al desconectar DB Redis:', e);
    }
});
```

### React (Fronted)

En este se importarán lo que serán las graficas de Barras y de Donas

```
import React, { useEffect, useState, useCallback } from 'react';
// ... importaciones de Graficas
import socketIOClient from 'socket.io-client';
```

Para las gráficas se utilizaron los `useEffect` para que a la hora de que se actualizara la información de las bases de datos, estas mismas actualizaran las gráficas tambien.

Codigo de `useEffect` para las gráficas de MySQL.

```
useEffect(() => {
        calculateCounts();
    }, [calculateCounts]);

    useEffect(() => {
        calculateNotes();
    }, [calculateNotes]);

    useEffect(() => {
        calculateCursos();
    }, [calculateCursos]);

    useEffect(() => {
        const socket = socketIOClient('http://34.172.224.220:3500', {
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
        });
        socket.on('mysql-data', (data) => {//data es array
            setMysqlData(data);
        });
        
        socket.on('redis-local', (data) => {
            requestMySQLData();
        });

        const requestMySQLData = () => {
            socket.emit('request-mysql-data'); // Agregar un evento personalizado
        };
        
        requestMySQLData(); // Realizar la solicitud al cargar la página o cuando sea necesario
        
        // Definir un temporizador para solicitar MySQL data a intervalos regulares (por ejemplo, cada 30 segundos)
        const mysqlDataInterval = setInterval(requestMySQLData, 1000);

        return () => {
            socket.off('redis-local');
            socket.off('mysql-data');
            // Limpiar el temporizador al desmontar el componente
            clearInterval(mysqlDataInterval);
        }
    }, []);
```

Codigo de `useEffect` para las gráficas de Redis.

```
useEffect(() => {
        calculateCourses();
    }, [calculateCourses]);

    useEffect(() => {
        const socket = socketIOClient('http://34.172.224.220:3500', {
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
        });
        
        socket.on('redis-dot', (data) => {
            setRedisData(data);
        })
        
        socket.on('redis-local', (data) => {
            requestRedisData();
        });

        const requestRedisData = () => {
            socket.emit('request-redis-data');
        }

        requestRedisData();
        
        // Definir un temporizador para solicitar MySQL data a intervalos regulares (por ejemplo, cada 30 segundos)
        const redisDataInterval = setInterval(requestRedisData, 1000);

        return () => {
            socket.off('redis-dot');
            socket.off('redis-local');
            //socket.off('mysql-data');
            // Limpiar el temporizador al desmontar el componente
            clearInterval(redisDataInterval);
        }
    }, []);
```

## Creación de Base de Datos en Cloud SQL

En la lista desplegable de la parte superior izquierda se selecciona `SQL`

- `Crear Instancia`
  - `Elegir MySQL`
    - `Información de la Instancia`
      - **ID de Instancia**: Poner el nombre
      - **Contraseña**: Colocar contraseña y guardarla
    - `Elegir una edición de Cloud SQL`: depende de lo que se necesite, en este caso se usará
      - `Enterprise`
      - `Producción`: Cambiarlo a Desarrollo
    - `Personaliza tu instancia`
      - `Protección de datos`
        - Deseleccionar la casilla de `Habilitar la protección contra la eliminación`
      - `Conexiones`: En esta se podrá editar la instancia de la base de datos para permitir el ingreso de las IPs públicas que necesites que ingresen a la misma, en caso que quieras que cualquier IP ingrese a la Base de datos se puede usar lo siguiente `0.0.0.0/0`

### Base de Datos SQL

Se tiene la siguiente arquitectura para la base de datos de Cloud SQL

```
CREATE DATABASE IF NOT EXISTS proyect2;

USE proyect2;

CREATE TABLE Estudiante (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Carnet INT NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Curso VARCHAR(10) NOT NULL,
    Nota INT NOT NULL,
    Semestre varchar(10) NOT NULL,
    Year INT NOT NULL
);

SELECT * FROM Estudiante;

--Es para reestablecer el auto incrementado

ALTER TABLE Estudiante AUTO_INCREMENT = 1;

--Para eliminar por ID a los estudiantes

DELETE FROM Estudiante
WHERE ID BETWEEN 1 AND 17;

--Reestablecer de la tabla Estudiante el autoincremento

ALTER TABLE Estudiante AUTO_INCREMENT = 1;
```

## Base de datos Redis

Se tiene el siguiente YAML

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:latest
        ports:
        - containerPort: 6379
        resources:
          limits:
            cpu: "1"
          requests:
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: redis-service
spec:
  selector:
    app: redis
  ports:
  - protocol: TCP
    port: 6379
    targetPort: 6379
  type: LoadBalancer
```

## Comandos Utilizados/etc

- [View](../../Proyecto2/k8s/)