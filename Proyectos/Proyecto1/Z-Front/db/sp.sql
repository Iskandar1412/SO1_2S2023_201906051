-- sudo docker start <base de datos>
-- sudo docker start proyect_db

CREATE TABLE InfoCOMPU (
    IT INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_equipo VARCHAR(255) NOT NULL,
    UsoCPU INT NOT NULL,
    Total_RAM INT NOT NULL,
    RAM_Uso INT NOT NULL,
    RAM_Libre INT NOT NULL,
    Porcentaje_RAM INT NOT NULL,
    fecha_registro DATETIME NOT NULL
);

SELECT * from InfoCOMPU;

DELETE FROM InfoCOMPU
WHERE IT BETWEEN 90 AND 404;