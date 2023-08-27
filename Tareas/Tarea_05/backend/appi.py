from flask import Flask
app = Flask(__name__)

@app.route('/')
def inicio():
    return 'Hola Mundo <201906051>'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)