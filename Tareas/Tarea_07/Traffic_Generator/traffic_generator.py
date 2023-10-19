# pip install locust
from locust import HttpUser, task, between
import random
from random import randrange
import  json

class file_to_open:
    def __init__(self):
        self.data = []
    
    def getData(self):
        size = len(self.data)
        if size > 0:
            index = randrange(0, size - 1) if size > 1 else 0
            return self.data.pop(index)
        else:
            print('size -> 0')
            return None
    
    def load_file(self):
        print("Cargando ...")
        try:
            with open('./data.json', 'r', encoding='utf-8') as file:
                self.data = json.loads(file.read())
                print('ok data...')
                file.close()
        except:
            print(f'Error : {Exception}')
            
class Traffic_Generator(HttpUser):
    wait_time = between(0.1, 0.9) #tiempo espera entre registros
    reader = file_to_open()
    reader.load_file()
    
    def on_start(self):
        print('On Start')
    
    @task
    def sendMessage(self):
        data = self.reader.getData()
        print('Sending data to client') 
        if data is not None:
            res = self.client.post("/insert", json=data)
            response = res.json()
            print(response)
        else:
            print('Empty')
            self.stop(True)
 
# sudo apt install python3.10-venv           
# python3 -m venv venv
# source venv/bin/activate
# pip install locust
# locust -f traffic_generator.py
# http://localhost:<host del cliente>
# http://0.0.0.0:8089