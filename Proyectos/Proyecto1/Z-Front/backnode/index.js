const express = require('express')
const axios = require('axios')
const app = express()
const port = 3200

app.use(express.json())

app.get('/node-go/info-machine', async(req, res) => {
    try {
        const response1 = await axios.get('http://localhost:8080/info-ram')
        const response2 = await axios.get('http://localhost:8080/info-cpu')
        res.json(response1.data, response2.data)
    } catch(error) {
        console.error(error)
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