//en caso de que la db sea en docker
//sudo docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' proyect_db
//nahhh sirve en localhost
//correr imagen sql docker
//sudo docker start proyect_db

//mv1: proyecto1-c2n1  ::  34.42.36.164
//mv2: proyecto1-t16q  ::  34.135.153.28
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const mysql = require('mysql2/promise');
const app = express();
const port = 3200;

app.use(cors());
app.use(bodyParser.json());

const maquinas_virtuales = [
    { id: 'proyecto1-c2n1', url: '34.42.36.164' },
    { id: 'proyecto1-t16q', url: '34.135.153.28' }
];

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        // Consulta para obtener la lista de tablas en la base de datos
        //const [rows] = await connection.query('SHOW TABLES');
        
        // Mostrar las tablas disponibles
        //console.log('Tablas en la base de datos:');
        //for (const row of rows) {
        //    console.log('Tabla: [', row[`Tables_in_${dbConfig.database}`], ']');
        //}
        
        console.log('Conexión a la base de datos exitosa');
        return connection;
    } catch (error) {
        console.error('Error al conectar a la base de datos: ', error);
        throw error;
    }
}

connectToDatabase();

//http://localhost:3200/live?nombreEquipo=proyecto1-c2n1
app.get('/live', async (req, res) => {
    const eQuipo = req.query.eQuipo;

    if (!eQuipo) {
        return res.status(400).json({error: 'Error de maquina'})
    }

    let connection;
    try {
        connection = await connectToDatabase();
        
        if (eQuipo.toString() === maquinas_virtuales[0].id){
            //maquina1
            const externalServiceResponseRAM1 = await axios.get('http://34.42.36.164:8080/ram-info');
            const externalServiceResponseCPU1 = await axios.get('http://34.42.36.164:8080/cpu-info');

            const ramData1 = externalServiceResponseRAM1.data;
            const cpuData1 = externalServiceResponseCPU1.data;
            
            await insertarNuevaMaquina(connection, ramData1, cpuData1);
            
            console.log('Datos ingresados correctamente en', eQuipo.toString());
            const responseData = {
                CPU: cpuData1,
                RAM: ramData1,
            };    
            res.json(responseData);
        }else if (eQuipo.toString() === maquinas_virtuales[1].id){
            //maquina2
            const externalServiceResponseRAM2 = await axios.get('http://34.135.153.28:8080/ram-info');
            const externalServiceResponseCPU2 = await axios.get('http://34.135.153.28:8080/cpu-info');
            
            const ramData2 = externalServiceResponseRAM2.data;
            const cpuData2 = externalServiceResponseCPU2.data;
            await insertarNuevaMaquina(connection, ramData2, cpuData2);
            
            console.log('Datos ingresados correctamente en', eQuipo.toString());
            const  responseData = {
                CPU: cpuData2,
                RAM: ramData2
            };
            res.json(responseData);
        }else{
            res.json({ error: 'Maquina no existente' })
        }
    } catch (error) {
        console.error('Error al obtener la información:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (connection) {
            connection.end();
        }
    }
});

app.delete('/kill-proccess', async (req, res) => {
    const equipo = req.query.equipo;

    if (!equipo) {
        return res.status(400).json({error: 'Error maquina no existente'})
    }

    try {
        const pid = req.body.pid; // Obtiene el PID del cuerpo de la solicitud POST
        let backendGoUrl = '';
        maquinas_virtuales.forEach((value) => {
            if (equipo.toString() === value.id.toString()){
                backendGoUrl = 'http://'+value.url+':8080/kill';
            }
        });

        if (!backendGoUrl) {
            return res.status(400).json({ error: 'Ruta no existente' });
        }

        console.log(backendGoUrl);

        const data = {
            pid: pid,
        };

        axios
            .post(backendGoUrl, data)
            .then((response) => {
                console.log(response.data);
                res.json(response.data); // Devuelve la respuesta del servidor Go
            })
            .catch((error) => {
                console.error('Error al realizar la solicitud POST:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            });
    } catch (error) {
        console.error('Error en eliminar el proceso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


async function insertarNuevaMaquina(connection, ram_data, cpu_data) {
    try {
        const fechaHoraActual = new Date();
        const hora_ac = fechaHoraActual.toISOString().slice(0, 19).replace('T', ' ');

        await connection.query('INSERT INTO InfoCOMPU (Nombre_equipo, UsoCPU, Total_RAM, RAM_Uso, RAM_Libre, Porcentaje_RAM, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?)', [
            cpu_data.Nombre_equipo, //neqipo
            cpu_data.Uso_de_CPU, //usocpu totalram ramuso ramlibre %ram fecha
            ram_data.Uso_ram[0].total_ram,
            ram_data.Uso_ram[0].Ram_en_uso,
            ram_data.Uso_ram[0].Ram_libre,
            ram_data.Uso_ram[0].Porcentaje_en_uso,
            hora_ac
        ]);
        //console.log('Datos subidos con exito')
    } catch (e) {
        console.log('Error en la inserción de datos', e);
    }
}

//http://localhost:3200/registros-por-equipo?nombreEquipo=proyecto1-c2n1
app.get('/registros-por-equipo', async (req, res) => {
    const nombreEquipo = req.query.nombreEquipo;

    if (!nombreEquipo) {
        return res.status(400).json({ error: 'Debe proporcionar el nombre del equipo como parámetro de consulta (nombreEquipo).' });
    }
    
    let connection;
    try {
        connection = await connectToDatabase();

        const [rows] = await connection.query('SELECT * FROM InfoCOMPU WHERE Nombre_equipo = ?', [nombreEquipo]);

        if (rows.length === 0) {
            return res.json({ mensaje: 'No se encontraron registros para el equipo especificado.' });
        }

        res.json({ registros: rows });
    } catch (error) {
        console.error('Error al obtener los registros por equipo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (connection) {
            connection.end();
        }
    }
});



app.listen(port, () => {
    console.log(`Servidor API REST en ejecución en el puerto ${port}`);
});
