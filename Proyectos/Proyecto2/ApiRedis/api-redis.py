from flask import Flask, request, jsonify
import simplejson as json
import redis

#pip install simplejson

app = Flask(__name__)

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

class info:
    def __init__(self, carnet, nombre, curso, nota, semestre, year):
        self.carnet = carnet
        self.nombre = nombre
        self.curso = curso
        self.nota = nota
        self.semestre = semestre
        self.year = year

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
            "carnet": alumno.carnet,
            "nombre": alumno.nombre,
            "curso": alumno.curso,
            "nota": alumno.nota,
            "semestre": alumno.semestre,
            "year": alumno.year
        }
        
        counter = redis_client.incr("contador_alumnos")
        key = f'alumno{counter}'
        json_alumno_str = json.dumps(json_alumno)
        redis_client.set(key, json_alumno_str)
        print('Alumno registrado:', json_alumno)
        return f'Alumnos registrados: {counter}'
    except Exception as e:
        return str(e), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3200, debug=True)