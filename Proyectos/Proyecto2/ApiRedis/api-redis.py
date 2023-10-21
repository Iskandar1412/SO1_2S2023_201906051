from flask import Flask, request, jsonify
import simplejson as json
import redis
import mysql.connector

# pip install mysql-connector-python
# pip install simplejson

app = Flask(__name__)

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

db_config = {
    'user': 'root',
    'password': 'Gilgamesh@,14.12#=',
    'host': '35.245.152.29:3306',
    'database': 'proyect2',
}

conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()
class info:
    def __init__(self, carnet, nombre, curso, nota, semestre, year):
        self.carnet = carnet
        self.nombre = nombre
        self.curso = curso
        self.nota = nota
        self.semestre = semestre
        self.year = year

def getNumber():
    keys = redis_client.keys('alumno_*')
    highest = 0
    for key in keys:
        try:
            number = int(key.split('_')[1])
        except ValueError:
            continue
        if number > highest:
            highest = number
    next = highest + 1
    return next
    

@app.route('/agregarAlumno', methods=['POST'])
def agregarAlumno():
    try:
        data = request.json
        alumno = info(
            data['carnet'],
            data['nombre'],
            data['curso'],
            data['nota'],
            data['semestre'],
            data['year']
        )
        
        json_alumno = {
            "Carnet": alumno.carnet,
            "Nombre": alumno.nombre,
            "Curso": alumno.curso,
            "Nota": alumno.nota,
            "Semestre": alumno.semestre,
            "Year": alumno.year
        }
        
        insert_query = """INSERT INTO Estudiante (Carnet, Nombre, Curso, Nota, Semestre, Year) VALUES (?, ?, ?, ?, ?, ?)"""
        cursor.execute(insert_query)
        conn.commit()
        
        
        key = f'alumno_{getNumber()}'
        json_alumno_str = json.dumps(json_alumno)
        redis_client.set(key, json_alumno_str)
        redis_client.publish(key, json_alumno_str)
        print('Alumno registrado:', json_alumno)
        return f'Alumnos registrados: {getNumber()}'
    except Exception as e:
        return str(e), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7980, debug=True)