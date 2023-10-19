import  json
import random
#class TrafficGenerator:
    #wait_time = between(1, 5) #tiempo de espera aleatorio entre solicitudes (tiempo en segundos)

def submit_grade():
    alumnos = []
    for i in range(1, 10001):
        carnet = random.randint(195000000, 202399999)
        nombre = f'Alumno {i}'#.format(random.randint(1, 1000000))
        curso = random.choice(['SO1', 'BD1', 'LFP', 'SA', 'AYD1'])
        nota = random.choice([50, 60, 70, 80, 90, 100])
        semestre = random.choice(['1S', '2S'])
        year = 2023
        
        data = {
            "carnet": carnet,
            "nombre": nombre,
            "curso": curso,
            "nota": nota,
            "semestre": semestre,
            "year": year
        }
        
        alumnos.append(data)
        
    with open('data.json', 'w') as file:
        json.dump(alumnos, file, indent=4)
        file.close()

submit_grade()