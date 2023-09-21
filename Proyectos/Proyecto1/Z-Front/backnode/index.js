//en caso de que la db sea en docker
//sudo docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' proyect_db
//nahhh sirve en localhost
//correr imagen sql docker
//sudo docker start proyect_db

//mv1: proyecto1-c2n1  ::  34.67.121.223
//mv2: Proyecto1-t16q  ::  34.42.36.164
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mysql = require('mysql2/promise');
const app = express();
const port = process.env.PORT || 3200;

app.use(bodyParser.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'secret',
    database: 'proyect_db',
};

async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        // Consulta para obtener la lista de tablas en la base de datos
        const [rows] = await connection.query('SHOW TABLES');
        
        // Mostrar las tablas disponibles
        console.log('Tablas en la base de datos:');
        for (const row of rows) {
            console.log('Tabla: [', row[`Tables_in_${dbConfig.database}`], ']');
        }
        
        console.log('Conexión a la base de datos exitosa');
        return connection;
    } catch (error) {
        console.error('Error al conectar a la base de datos: ', error);
        throw error;
    }
}

connectToDatabase();

app.get('/envivo', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();

        const externalServiceResponseRAM1 = await axios.get('http://34.67.121.223:8080/ram-info');
        const externalServiceResponseCPU1 = await axios.get('http://34.67.121.223:8080/cpu-info');

        const ramData1 = externalServiceResponseRAM1.data;
        const cpuData1 = externalServiceResponseCPU1.data;

        await insertarRegistroRAM(connection, ramData1);
        await insertarRegistrosProceso(connection, cpuData1);
        const ultimoIdProceso = await obtenerUltimoIdProceso(connection);
        const ultimoRegistroRAM = await obtenerUltimoRegistroRAM(connection);
        await insertarRegistroInfo(connection, ultimoIdProceso, ultimoRegistroRAM, cpuData1);

        const responseData = {
            CPU1: cpuData1,
            RAM1: ramData1,
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error al obtener la información:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (connection) {
            connection.end();
        }
    }
});

app.delete('/eliminarproceso', async (req, res) => {
    try {
        const pid = req.body.pid;
        const backendGoUrl = 'http://34.42.36.164:8080/kill';

        const data = {
            pid: pid,
        };

        axios
            .post(backendGoUrl, data)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error al realizar la solicitud POST:', error);
            });

        res.json({ message: 'Operación exitosa' });
    } catch (error) {
        console.error('Error en /eliminarproceso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/obtenerinformacionmes', async (req, res) => {
    try {
        const { mes, anio } = req.body;

        if (!mes || !anio) {
            return res.status(400).json({ error: 'Debe proporcionar mes y año en el cuerpo de la solicitud.' });
        }

        const connection = await connectToDatabase();
        const resultados = await obtenerInformacionMes(connection, mes, anio);
        connection.end();

        if (resultados.length > 0) {
            res.json({ datos: resultados });
        } else {
            res.json({ mensaje: 'No se encontraron datos en el intervalo especificado.' });
        }
    } catch (error) {
        console.error('Error al obtener información por mes y año:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/obtenerprocesos', async (req, res) => {
    try {
        const externalServiceResponseCPU1 = await axios.get('http://34.16.77.112:8080/cpu-info');
        const cpuData1 = externalServiceResponseCPU1.data;

        const responseData = {
            ProcesosVM1: cpuData1.Procesos,
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error en /obtenerprocesos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

async function insertarRegistroRAM(connection, ramData) {
    try {
        await connection.query('INSERT INTO ram_info (total_ram, ram_en_uso, ram_libre, porcentaje_en_uso) VALUES (?, ?, ?, ?)', [
            ramData.Uso_ram[0].total_ram,
            ramData.Uso_ram[0].Ram_en_uso,
            ramData.Uso_ram[0].Ram_libre,
            ramData.Uso_ram[0].Porcentaje_en_uso
        ]);
        console.log('Datos de la RAM insertados exitosamente');
    } catch (error) {
        console.error('Error al insertar el registro de RAM:', error);
    }
}

async function insertarRegistrosProceso(connection, cpuData) {
    try {
        for (const proceso of cpuData.Procesos) {
            const { Proceso, PID, UID, Estado, Memoria_virtual, Memoria_fisica } = proceso;

            await connection.query('INSERT INTO cpu_process (Proceso, PID, UID, Estado, Memoria_virtual, Memoria_fisica) VALUES (?, ?, ?, ?, ?, ?)', [
                Proceso,
                PID,
                UID,
                Estado,
                Memoria_virtual,
                Memoria_fisica
            ]);
            //console.log(`Proceso "${Proceso}" insertado correctamente.`);
        }
    } catch (error) {
        console.error('Error al insertar los registros de proceso:', error);
    }
}

async function obtenerUltimoIdProceso(connection) {
    try {
        const [rows] = await connection.query('SELECT MAX(id) AS ultimoId FROM cpu_process');
        if (rows && rows.length > 0) {
            return rows[0].ultimoId;
        } else {
            return null;
        }
    } catch (error) {
        console.error('No se pudo obtener el ID del preoceso:', error);
        return null;
    }
}

async function obtenerUltimoRegistroRAM(connection) {
    try {
        const [rows] = await connection.query('SELECT * FROM ram_info ORDER BY id DESC LIMIT 1');
        if (rows && rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('No se pudo obtener el registro RAM:', error);
        return null;
    }
}

async function insertarRegistroInfo(connection, ultimoIdProceso, ultimoRegistroRAM, cpuData) {
    try {
        const fechaHoraActual = new Date();
        const fechaHoraFormateada = fechaHoraActual.toISOString().slice(0, 19).replace('T', ' ');

        await connection.query('INSERT INTO computer (Proceso_id, Ram_id, Nombre_equipo, Uso_de_CPU, fecha_registro) VALUES (?, ?, ?, ?, ?)', [
            ultimoIdProceso,
            ultimoRegistroRAM.id,
            cpuData.Nombre_equipo,
            cpuData.Uso_de_CPU,
            fechaHoraFormateada
          ]);
        //console.log(cpuData.Uso_de_CPU);
        console.log('Información del equipo insertada correctamente.');
    } catch (error) {
        console.error('No se pudo insertar la información del equipo:', error);
    }
}

app.listen(port, () => {
    console.log(`Servidor API REST en ejecución en el puerto ${port}`);
});
