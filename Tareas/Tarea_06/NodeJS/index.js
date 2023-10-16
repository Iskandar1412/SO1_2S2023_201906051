//npm init
//npm install express
//npm install cors axios redis dotenv
//npm install socket.io
//npm install ioredis --save
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Redis = require('ioredis');
const cors = require('cors');

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

redis.select(1, () => {
    console.log('DB1');
});

io.on('connection', async (socket) => {
    console.log('Conexión a WebSocket exitosa');

    // Obtener información de las claves en Redis y enviarla al cliente
    const keys = await redis.keys('album_*');
    for (const key of keys) {
        const data = await redis.get(key);
        const jsonData = JSON.parse(data);
        socket.emit('redis-data', jsonData);
        console.log(jsonData)
    }

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(9800, () => {
    console.log('Servidor en puerto: 9800');
});
