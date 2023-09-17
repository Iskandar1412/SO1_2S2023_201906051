-- Crear la base de datos "monitorizacion"
CREATE DATABASE IF NOT EXISTS monitorizacion;

-- Usar la base de datos "monitorizacion"
USE monitorizacion;

-- Crear la tabla "procesos" para almacenar la información de los procesos
CREATE TABLE IF NOT EXISTS procesos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Proceso VARCHAR(255) NOT NULL,
    PID INT NOT NULL,
    UID INT NOT NULL,
    Estado VARCHAR(255) NOT NULL,
    Memoria_virtual INT NOT NULL,
    Memoria_fisica INT NOT NULL
);

-- Crear la tabla "info_cpu" para almacenar la información de la CPU
CREATE TABLE IF NOT EXISTS info_cpu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_equipo VARCHAR(255) NOT NULL,
    Uso_de_CPU INT NOT NULL
);

-- Crear la tabla "ram" para almacenar la información de la RAM
CREATE TABLE IF NOT EXISTS ram (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total_ram INT NOT NULL,
    Ram_en_uso INT NOT NULL,
    Ram_libre INT NOT NULL,
    Porcentaje_en_uso INT NOT NULL
);

-- Crear la tabla "info_ram" para almacenar la información general de la RAM
CREATE TABLE IF NOT EXISTS info_ram (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_equipo VARCHAR(255) NOT NULL
);

-- Añadir una clave foránea para relacionar "procesos" con "info_cpu"
ALTER TABLE procesos
ADD COLUMN info_cpu_id INT NOT NULL,
ADD FOREIGN KEY (info_cpu_id) REFERENCES info_cpu(id);

-- Añadir una clave foránea para relacionar "ram" con "info_ram"
ALTER TABLE ram
ADD COLUMN info_ram_id INT NOT NULL,
ADD FOREIGN KEY (info_ram_id) REFERENCES info_ram(id);