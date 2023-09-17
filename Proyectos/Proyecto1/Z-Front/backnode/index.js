const express = require('express')
const axios = require('axios')
const app = express()
const port = 3200

app.use(express.json())

app.get('/node-go/info-ram', async(req, res) => {
    try {
        const response = await axios.get('http://localhost:8080/info-ram')
        res.json(response.data)
    } catch(error) {
        console.error(error)
        res.status(500).json({ error: 'Error en la comunicación con el Backend de go' })
    }
});

app.get('/node-go/info-cpu', async(req, res) => {
    try {
        const response = await axios.get('http://localhost:8080/info-cpu')
        res.json(response.data)
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: 'Error en la comunicación con el Backend de go' })
    }
});

app.post('/node-go/post-go', async(req, res) => {
    try {
        const requestData = req.body
        const response = await axios.post('http://localhost:8080/kill', requestData)
        res.json(response.data)
    } catch(err) {
        console.error(err)
        res.status(500).json({ error: 'Error al comunicarse con el Backend de go' })
    }
});

app.listen(port, () => {
    console.log(`Backend (NodeJS) funcionando en http://localhost:${port}`)
});