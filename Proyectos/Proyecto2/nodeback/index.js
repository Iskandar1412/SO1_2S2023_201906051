//npm init
//npm install express
//npm install cors axios redis dotenv
//npm install socket.io
//npm install ioredis --save
//npm install @grpc/grpc-js
//npm install mysql2

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Redis = require('ioredis');
const cors = require('cors');
const mysql = require('mysql2');
const { channel } = require('diagnostics_channel');

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        methods: ['GET'],
    },
});

const redis = new Redis({
    host: 'localhost',
    port: 6379,
});

//redis.select(0, () => {
//    console.log('DB1 in Redis Connected');
//});
(async () => {
    await redis.select(0);
    console.log('DB1 in Redis Connected');
})();

const db = mysql.createConnection({
    host: '35.245.152.29',
    user: 'root',
    password: 'Gilgamesh@,14.12#=',
    database: 'proyect2',
    //root:Gilgamesh@,14.12#=@tcp(35.245.152.29:3306)/proyect2
})

db.connect((err) => {
    if (err) {
        console.error('Error al conectar con MySQL:', err)
    } else {
        console.log('Conexión a MySQL exitosa')
    }
})

io.on('connection', async (socket) => {
    console.log('Conexión a WebSocket exitosa');

    // Obtener información de las claves en Redis y enviarla al cliente al conectarse
    // Escuchar el evento personalizado 'request-redis-data'
    socket.on('request-redis-data', async () => {
        const keys = await redis.keys('alumno_*');
        const redisData = [];

        for (const key of keys) {
            const data = await redis.get(key);
            const jsonData = JSON.parse(data);
            redisData.push(jsonData);
        }

        // Emitir los datos de Redis como 'redis-data' en respuesta a 'request-redis-data'
        socket.emit('redis-dot', redisData);
    });

    // Escuchar eventos en el canal 'redis-local' y enviarlos al cliente
    const redisSubscriber = new Redis();
    redisSubscriber.subscribe('redis-local');
    redisSubscriber.on('message', (channel, message) => {
        if (channel === 'redis-local') {
            //console.log('Dato recibido')
            const jsonData = JSON.parse(message);
            socket.emit('redis-data', jsonData);
        }
    });

    // Escuchar el evento personalizado 'request-mysql-data'
    socket.on('request-mysql-data', () => {
        try {
            const query = "SELECT * FROM Estudiante";
            db.query(query, (error, results) => {
                if (error) {
                    console.error('Error al consultar MySQL:', error);
                } else {
                    socket.emit('mysql-data', results);
                }
            });
        } catch (e) {
            console.error('Error al obtener datos de MySQL:', e);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
        // Deja de escuchar el canal cuando el cliente se desconecta
        redisSubscriber.unsubscribe('redis-local');
        redisSubscriber.quit();
    });
});

server.listen(9800, () => {
    console.log('Servidor en puerto: 9800');
});

