from flask import Flask
app = Flask(__name__)
@app.route('/',methods=['GET'])
def hello_world():
  return 'Hello from Flask!'
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000)
