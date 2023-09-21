//en caso de que la db sea en docker
//sudo docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' proyect_db
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3200;

app.use(bodyParser.json());

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'http://172.17.0.2:3306',
  user: 'root',
  password: 'secret',
  database: 'proyect_db',
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ', err);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});

// Microservicio /envivo
app.get('/envivo', async (req, res) => {
  try {
    //ESTO ES PARA LA VM 1
    // Consumir un servicio externo para recuperación de información de RAM
    const externalServiceResponseRAM1 = await axios.get('http://34.71.99.119:8080/ram-info');
    
    // Consumir un servicio externo para recuperación de información de CPU
    const externalServiceResponseCPU1 = await axios.get('http://34.71.99.119:8080/cpu-info');
    
    // Extraer los datos necesarios de las respuestas
    const ramData1 = externalServiceResponseRAM1.data;
    const cpuData1 = externalServiceResponseCPU1.data;
    
    // Llamar a las consultas SQL directamente en lugar de los SP
    await insertarRegistroRAM(ramData1);
    await insertarRegistrosProceso(cpuData1);
    const ultimoIdProceso = await obtenerUltimoIdProceso();
    const ultimoRegistroRAM = await obtenerUltimoRegistroRAM();
    await insertarRegistroInfo(ultimoIdProceso, ultimoRegistroRAM, cpuData1);

    // Crear un objeto de respuesta con los datos extraídos
    const responseData = {
      CPU1: ramData1,
      RAM1: cpuData1,
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error en /envivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Microservicio /eliminarproceso
app.delete('/eliminarproceso', async (req, res) => {
  try {
    const pid = req.body.pid;
    // Objeto con los datos a enviar en la solicitud POST
    
    // URL del endpoint de tu backend Go
    const backendGoUrl = 'http://34.42.36.164:8080/kill'; 

    const data = {
      pid: pid,
    };

    // Realizar la solicitud POST al endpoint de tu backend Go
    axios.post(backendGoUrl, data)
      .then((response) => {
        console.log(response.data); // Mensaje de éxito del backend Go
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

// Endpoint para obtener información por mes y año
app.post('/obtenerinformacionmes', async (req, res) => {
  try {
    // Obtener el mes y el año del cuerpo de la solicitud
    const { mes, anio } = req.body;

    // Validar que se proporcionen mes y año
    if (!mes || !anio) {
      return res.status(400).json({ error: 'Debe proporcionar mes y año en el cuerpo de la solicitud.' });
    }

    // Llamar a las consultas SQL directamente en lugar de los SP
    const resultados = await obtenerInformacionMes(mes, anio);

    // Comprobar si se encontraron datos
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

// Microservicio /obtenerprocesos
app.get('/obtenerprocesos', async (req, res) => {
  try {    
    // ESTO ES PARA LA VM 1
    // Consumir un servicio externo para recuperación de información de CPU
    const externalServiceResponseCPU1 = await axios.get('http://34.16.77.112:8080/cpu-info');
    
    // Extraer los datos necesarios de las respuestas
    const cpuData1 = externalServiceResponseCPU1.data;

    // Crear un objeto de respuesta con los datos extraídos
    const responseData = {
      ProcesosVM1: cpuData1.Procesos,
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error en /obtenerprocesos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Función para insertar un registro de RAM
async function insertarRegistroRAM(ramData) {
  try {
    // Utiliza la instancia de conexión `db` para ejecutar la consulta
    await db.query('INSERT INTO ram (total_ram, ram_en_uso, ram_libre, porcentaje_en_uso) VALUES (?, ?, ?, ?)', [
      ramData.Uso_ram[0].total_ram,
      ramData.Uso_ram[0].Ram_en_uso,
      ramData.Uso_ram[0].Ram_libre,
      ramData.Uso_ram[0].Porcentaje_en_uso
    ]);
    console.log('Registro de RAM insertado correctamente.');
  } catch (error) {
    console.error('Error al insertar el registro de RAM:', error);
  }
}

// Función para insertar registros de proceso
async function insertarRegistrosProceso(cpuData) {
  try {
    for (const proceso of cpuData.Procesos) {
      const { Proceso, PID, UID, Estado, Memoria_virtual, Memoria_fisica } = proceso;

      // Insertar un registro de proceso
      await db.query('INSERT INTO procesos (Proceso, PID, UID, Estado, Memoria_virtual, Memoria_fisica) VALUES (?, ?, ?, ?, ?, ?)', [
        Proceso,
        PID,
        UID,
        Estado,
        Memoria_virtual,
        Memoria_fisica
      ]);
      console.log(`Registro de proceso "${Proceso}" insertado correctamente.`);
    }
  } catch (error) {
    console.error('Error al insertar los registros de proceso:', error);
  }
}

// Función para obtener el último ID de proceso insertado
async function obtenerUltimoIdProceso() {
  try {
    const queryResult = await db.query('SELECT MAX(id) AS ultimoId FROM procesos');
    if (queryResult && queryResult[0] && queryResult[0].ultimoId) {
      return queryResult[0].ultimoId;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el último ID de proceso:', error);
    return null;
  }
}

// Función para obtener el último registro de RAM insertado
async function obtenerUltimoRegistroRAM() {
  try {
    const queryResult = await db.query('SELECT * FROM ram ORDER BY id DESC LIMIT 1');
    if (queryResult && queryResult[0] && queryResult[0][0]) {
      return queryResult[0][0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el último registro de RAM:', error);
    return null;
  }
}

// Función para insertar un registro de información de CPU
async function insertarRegistroInfo(ultimoIdProceso, ultimoRegistroRAM, cpuData) {
  try {
    // Obtén la fecha y hora actual en JavaScript
    const fechaHoraActual = new Date();

    // Formatea la fecha y hora en el formato que MySQL acepta (YYYY-MM-DD HH:MM:SS)
    const fechaHoraFormateada = fechaHoraActual.toISOString().slice(0, 19).replace('T', ' ');

    // Insertar un registro de información de CPU
    await db.query('INSERT INTO informacion (id_proceso, id_ram, nombre_equipo, uso_de_cpu, fecha_hora) VALUES (?, ?, ?, ?, ?)', [
      ultimoIdProceso,
      ultimoRegistroRAM.id,
      cpuData.Nombre_equipo,
      cpuData.Uso_de_CPU,
      fechaHoraFormateada
    ]);
    console.log('Registro de información insertado correctamente.');
  } catch (error) {
    console.error('Error al insertar el registro de información:', error);
  }
}

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor API REST en ejecución en el puerto ${port}`);
});