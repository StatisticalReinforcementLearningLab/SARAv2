from flask_cors import CORS
from flask import Flask
from libs import buckets
from flask import request
import json

app = Flask(__name__)
CORS(app)

"""
Freeze packages with the following command.
   pip3 freeze > requirements.txt
"""

@app.route('/')
def hello_world():
    return 'Hello, Docker!'


@app.route('/sleep_messages', methods = ['POST'])
def sleep_messages():
    req_data = request.get_json()
    user_id = req_data['user_id']
    today_sleep_data = None

    # new survey data is available then we append the data to the json
    if "sleep_data" in req_data:
        today_sleep_data = req_data["sleep_data"]

    sleep_mesage_object = buckets.get_sleep_monitoring_state_and_messages(user_id, today_sleep_data)
    response = app.response_class(
        response=json.dumps(sleep_mesage_object),
        mimetype='application/json'
    )
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5001)