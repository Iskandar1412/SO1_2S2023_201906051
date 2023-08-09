//llamamos libreria de express
const express = require('express');
//llamamos libreria morgan
const morgan = require('morgan');

const app = express();
const port = 3280;

const usuarios = [
    {id: 1, nombre: 'Usuario 1'},
    {id: 2, nombre: 'Usuario 2'},
    {id: 3, nombre: 'Usuario 3'},
    {id: 4, nombre: 'Usuario 4'},
    {id: 5, nombre: 'Usuario 5'}
]

app.use(express.json());

app.get('/', (req, res) => {
    req.json({
        mensaje: "Aplicattion in Node JS"
    })
})

app.get('/data', (req, res) => {
    req.json({
        nombre: 'Paco',
        carnet: '201906051'
    })
})

app.get('/usuarios', (req, res) => {
    req.json(usuarios)
})

app.listen(port, () => {
    console.log('Servidor en puerto: ' + port)
})