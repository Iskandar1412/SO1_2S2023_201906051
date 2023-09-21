-- procedimientos

-- obtención de procedimientos

DROP PROCEDURE IF EXISTS mes_info;

-- busqueda de información por mes
DELIMITER //

CREATE PROCEDURE mes_info(IN mes INT, IN anio INT)
BEGIN
    DECLARE fecha_inicio DATETIME;
    DECLARE fecha_fin DATETIME;
    
    SET fecha_inicio = STR_TO_DATE(CONCAT(anio, '-', mes, '-01'), '%Y-%m-%d');
    
    SET fecha_fin = DATE_ADD(fecha_inicio, INTERVAL 1 MONTH);
    
	SELECT ram_info.*, computer.*, cpu_process.Proceso
	FROM computer
	INNER JOIN cpu_process ON computer.Proceso_id = cpu_process.id
	INNER JOIN ram_info ON computer.Ram_id = ram_info.id
	WHERE computer.fecha_registro >= fecha_inicio AND computer.fecha_registro < fecha_fin;
    
    
END;
//

DELIMITER ;



-- insercion registros procesador

DROP PROCEDURE IF EXISTS proc_insert;

DELIMITER //

CREATE PROCEDURE proc_insert(
    IN proceso VARCHAR(255),
    IN pid INT,
    IN uid INT,
    IN estado VARCHAR(255),
    IN memoria_virtual INT,
    IN memoria_fisica INT
)
BEGIN
    INSERT INTO cpu_process (Proceso, PID, UID, Estado, Memoria_virtual, Memoria_fisica)
    VALUES (proceso, pid, uid, estado, memoria_virtual, memoria_fisica);
END;
//

DELIMITER ;



-- inserción registros ram


DROP PROCEDURE IF EXISTS ram_info_insert;

DELIMITER //

CREATE PROCEDURE ram_info_insert(
    IN total_ram INT,
    IN ram_en_uso INT,
    IN ram_libre INT,
    IN porcentaje_en_uso INT
)
BEGIN
    INSERT INTO ram_info (total_ram, Ram_en_uso, Ram_libre, Porcentaje_en_uso)
    VALUES (total_ram, ram_en_uso, ram_libre, porcentaje_en_uso);
END;
//

DELIMITER ;




-- insercion de registros de informacion

DROP PROCEDURE IF EXISTS reg_info_insert;

DELIMITER //

CREATE PROCEDURE reg_info_insert(
    IN proceso_id INT,
    IN ram_id INT,
    IN nombre_equipo VARCHAR(255),
    IN uso_de_cpu INT,
    IN fecha_registro DATETIME
)
BEGIN
    INSERT INTO computer (Proceso_id, Ram_id, Nombre_equipo, Uso_de_CPU, fecha_registro)
    VALUES (proceso_id, ram_id, nombre_equipo, uso_de_cpu, fecha_registro);
END;
//

DELIMITER ;





-- obtener registros ram

DROP PROCEDURE IF EXISTS ram_ureg;

DELIMITER //

CREATE PROCEDURE ram_ureg()
BEGIN
    SELECT id
    FROM ram_info
    ORDER BY id DESC
    LIMIT 1;
END;
//

DELIMITER ;

-- obtener registros del procesador

DROP PROCEDURE IF EXISTS proc_ureg;

DELIMITER //

CREATE PROCEDURE proc_ureg()
BEGIN
    SELECT id
    FROM cpu_process
    ORDER BY id DESC
    LIMIT 1;
END;
//

DELIMITER ;