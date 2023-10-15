//npm init
//npm install express
//npm install cors axios redis dotenv
//npm install socket.io
//npm install ioredis --save
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Redis = require('ioredis');
const portNode = 9800;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


const redis = new Redis({
    host: 'redis', //en caso que sea local sería 'redis' en otro caso se pone la dirección ip
    port: 6379
});

redis.on('connection', () => {
    console.log('Conexión a Redis exitosa');

    redis.get('clave_redis', (err, data) => {
        if (err) {
            console.log('Error en la obtención de datos de la db Redis:', err)
        } else {
            const jsonData = JSON.parse(data);
            socketIo.emit('datos_redis', jsonData);
        }
    });

    socketIo.on('disconnect', () => {
        console.log('Desconectar a db Redis');
    });
});

server.listen(portNode, () => {
    console.log('Servidor en puerto: ', portNode);
});