from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def saludo():
    return 'salu2 saludables <201906051>'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3300)
    
