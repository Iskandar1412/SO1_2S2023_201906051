from flask import Flask, request, jsonify
import redis
#sudo apt-get install pkg-config
#sudo apt-get install libmysqlclient-dev
#pip3 install mysqlclient
#pip install mysql-connector-python
import mysql.connector
#db-proyect2
#iskandar1412
app = Flask(__name__)

redis_client = redis.StrictRedis(host='redis', port=6379, db=0)

mysql_connection = mysql.connector.connect(
    host=''
    user=''
    password=''
    database=''
)

@app.route('/')
def main():
    return jsonify({'msg': 'Aplicación corriendo'})

@app.route('/submit', methods=['POST'])
def submit_grade():
    data = request.json
    
    redis_key = f"grade:{data['carnet']}"
    redis_client.set(redis_key, data)
    ## falta cloud sql
    return jsonify({'msg': 'Calificación guardada exitosamente'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000, debug=True)