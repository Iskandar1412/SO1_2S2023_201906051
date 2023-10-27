CREATE DATABASE IF NOT EXISTS proyect2;

USE proyect2;

CREATE TABLE Estudiante (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Carnet INT NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Curso VARCHAR(10) NOT NULL,
    Nota INT NOT NULL,
    Semestre varchar(10) NOT NULL,
    Year INT NOT NULL
);

SELECT * FROM Estudiante;

--Es para reestablecer el auto incrementado

ALTER TABLE Estudiante AUTO_INCREMENT = 1;

--Para eliminar por ID a los estudiantes

DELETE FROM Estudiante
WHERE ID BETWEEN 1 AND 17;

--Reestablecer de la tabla Estudiante el autoincremento

ALTER TABLE Estudiante AUTO_INCREMENT = 1;

--Cambiar de la Tabla Estudiante alguna columna cabecilla

ALTER TABLE Estudiante CHANGE Year_a Year INT NOT NULL;