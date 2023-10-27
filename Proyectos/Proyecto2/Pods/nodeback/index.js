//npm init
//npm install express
//npm install cors axios redis dotenv
//npm install socket.io
//npm install ioredis --save
//npm install mysql2

// conectar en redis cualquier ip
// redis-cli -h 146.148.93.195 -p 6379


const mysql = require('mysql2');
//const { createClient } = require('redis');
//const redis = require('redis');
const Redis = require('ioredis');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

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

//createclient
//const client = createClient({
//    url: 'redis://localhost:6379'
//});
//client.on('connect', function() { console.log('conected in redis'); });
//client.on('error', err => console.log('error en conectar redis'))

//redis
//const client = redis.createClient();

// Forzar la conexión a una dirección y puerto específicos
//client.connect(6379, 'redis', function (err) {
//    if (err) {
//        console.error('Error al conectar a Redis:', err);
//    } else {
//        console.log('Conexión a Redis exitosa');
//    }
//});

//const client = redis.createClient({
//    host: 'localhost',
//    port: 6379,
//    db: 0,
//    password: ''
//});
//
//client.on('connect', function() {
//    console.log('Conexión a Redis exitosa');
//});
//
//client.on('error', function(err) {
//    console.error('Error al conectar a Redis:', err);
//});

//client.connect(() => {
//    console.log('Conexión a Redis exitosa');
//});
    
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

let activeSockets = 0; // Contador de conexiones activas

io.on('connection', async (socket) => {
    activeSockets++; // Incrementa el contador cuando un cliente se conecta
    
    socket.on('disconnect', () => {
        activeSockets--; // Decrementa el contador cuando un cliente se desconecta
        console.log('Cliente desconectado');
    });

    socket.on('request-redis-data', async () => {
        try {
            //console.log('aaa')
            const keys = await redis.keys('alumno_*');
            const redisData = [];
            //console.log('sss')
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

    redisSubscriber.subscribe('redis-local');
    redisSubscriber.on('message', (channel, message) => {
        if (channel === 'redis-local') {
            const jsonData = JSON.parse(message);
            socket.emit('redis-local', jsonData);
        }
        redisSubscriber.unsubscribe('redis-local');
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
});

server.listen(3500, () => {
    console.log('Servidor en puerto: 3500');
});

// Manejo de cierre de la aplicación
process.on('exit', () => {
    try {
        redis.quit();
        redisSubscriber.quit()
    } catch (e) {
        console.error('Error al desconectar DB Redis:', e);
    }
});
