-- base de datos
CREATE DATABASE IF NOT EXISTS proyect_db;

-- usar tabla
USE proyect_db;

-- tabla para los procesos
CREATE TABLE IF NOT EXISTS cpu_process (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Proceso VARCHAR(255) NOT NULL,
    PID INT NOT NULL,
    UID INT NOT NULL,
    Estado VARCHAR(255) NOT NULL,
    Memoria_virtual INT NOT NULL,
    Memoria_fisica INT NOT NULL
);

-- Tabla para la infomración de la ram
CREATE TABLE IF NOT EXISTS ram_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total_ram INT NOT NULL,
    Ram_en_uso INT NOT NULL,
    Ram_libre INT NOT NULL,
    Porcentaje_en_uso INT NOT NULL
);

-- información de la maqina
CREATE TABLE IF NOT EXISTS computer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Proceso_id INT NOT NULL,
    Ram_id INT NOT NULL,
    Nombre_equipo VARCHAR(255) NOT NULL,
    Uso_de_CPU INT NOT NULL,
    fecha_registro DATETIME NOT NULL,
    FOREIGN KEY (Proceso_id) REFERENCES cpu_process(id),
    FOREIGN KEY (Ram_id) REFERENCES ram_info(id)
);