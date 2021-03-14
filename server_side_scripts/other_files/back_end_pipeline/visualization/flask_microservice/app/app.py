#from flask_cors import CORS
from flask import jsonify
from flask import send_file
from flask import Flask
from flask import request

from io import StringIO, BytesIO

#from app import app
# CORS(app)
app = Flask(__name__)

#===========================================================================================

@app.route('/')
def home():
   return "hello world!"



@app.route('/plot.svg')
def plot_svg():
    return send_file("./chart.svg", mimetype='image/svg+xml')



@app.route('/plot.png')
def plot_png():
    return send_file("./chart.png", mimetype='image/png')



#===========================================================================================
@app.route('/get_daily_plot', methods=['GET']) #GET requests will be blocked
def get_inspirational_quotes():
    req_data = request.get_json()

    if req_data is not None:
        user_id = req_data['user_id']
        print(user_id)

        # can be
        # -- edu.harvard.srl.MoodVisualization
        # -- edu.harvard.srl.SleepAppUsageVisualization
        plot_type = req_data['plot_type']

        if plot_type == "edu.harvard.srl.MoodVisualization":
            return send_file("./mash_aya_12072020_mood.png", mimetype='image/png')
        
        if plot_type == "edu.harvard.srl.SleepAppUsageVisualization":
            return send_file("./mash_aya_12072020_sleep_app_usage.png", mimetype='image/png')

    return send_file("./chart.svg", mimetype='image/svg+xml')

    # return send_file("./chart.png", mimetype='image/png')

    # return("username is " + user_id)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
    
    