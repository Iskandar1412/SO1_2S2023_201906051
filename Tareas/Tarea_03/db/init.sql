CREATE DATABASE tarea3;
USE tarea3;
CREATE TABLE music (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    artist VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    genre VARCHAR(50) NOT NULL
);

select * from music;

INSERT INTO music (title, artist, year, genre) VALUES
    ('S', 'S', 12, '23'),
    ('j', 'j', 11, '26');

DROP table music;