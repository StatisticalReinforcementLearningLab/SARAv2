#from flask_cors import CORS
from flask import jsonify
from flask import send_file
from flask import Flask
from flask import request
from flask_cors import CORS
from io import StringIO, BytesIO
import json
import mysql.connector as mysql
import boto3
from datetime import datetime

from app import app
CORS(app)

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


@app.route('/')
def hello_world():
    return 'Hello, World!'


#===========================================================================================

@app.route('/get_aware_id', methods = ['POST'])
def get_aware_id():
    # get form elements
    req_data = request.get_json()

    try: # username 
        userid = req_data['username'] 
    except KeyError:
        return("please include username")
    
    # search database for aware id
    with open("./config/saraSqlConfig.json") as f:
        mysql_connect_object = json.load(f)
        
    db = mysql.connect(
        host = mysql_connect_object["host"],
        port = mysql_connect_object["port"],
        user = mysql_connect_object["user"],
        passwd = mysql_connect_object["passwd"],
        database = mysql_connect_object["database"]
    )
    cursor = db.cursor()
    cursor.execute("select aware_id from users where username = %s", (userid,))
    awareid = cursor.fetchall()

    if(len(awareid) == 0): # no results
        response = app.response_class(
            response=json.dumps({"no_aware_id" : "there is no username with this name in our database"}),
            status=404,
            mimetype='application/json'
        )
    else: 
        response = app.response_class(
            response=json.dumps({"aware_id" : awareid[0][0]}),
            status=200,
            mimetype='application/json'
        )
    return response


#===========================================================================================
@app.route('/get_daily_plot', methods=['GET']) #GET requests will be blocked
def get_inspirational_quotes():

    user_id = request.args.get('username')
    print(user_id)

    # can be
    # -- edu.harvard.srl.MoodVisualization
    # -- edu.harvard.srl.SleepAppUsageVisualization
    plot_type = request.args.get('plot_type')

    if plot_type == "edu.harvard.srl.MoodVisualization":
        # http://54.146.43.246:56735/get_daily_plot?username=mash_aya&plot_type=edu.harvard.srl.MoodVisualization
        # search s3 bucket for today's plot
        bucket = 'sara-dev-data-storage'
        with open("config/aws_config.json") as f:
            s3_connect_object = json.load(f)
        client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 

        todays_date = datetime.now().strftime("%m%d%Y")
        try: 
            plot_obj = client.get_object(Bucket = bucket, Key =  "saraaltair_plots/" + "latest" + "/" + user_id + "_mood.png")
        except: 
            return("An error occured when retrieving a graph from S3. Please contact research administrators.")

        data = plot_obj['Body']
        f = open("temp_mood_visualization.png", 'wb')
        f.write(data.read())
        f.close()
        return send_file("../temp_mood_visualization.png", mimetype='image/png')

    if plot_type == "edu.harvard.srl.ConcentrationVisualization":
        # http://54.146.43.246:56735/get_daily_plot?username=mash_aya&plot_type=edu.harvard.srl.ConcentrationVisualization
        # search s3 bucket for today's plot
        bucket = 'sara-dev-data-storage'
        with open("config/aws_config.json") as f:
            s3_connect_object = json.load(f)
        client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 

        todays_date = datetime.now().strftime("%m%d%Y")
        try: 
            plot_obj = client.get_object(Bucket = bucket, Key =  "saraaltair_plots/" + "latest" + "/" + user_id + "_concentration_level.png")
        except: 
            return("An error occured when retrieving a graph from S3. Please contact research administrators.")

        data = plot_obj['Body']
        f = open("temp_concentration_level_visualization.png", 'wb')
        f.write(data.read())
        f.close()
        return send_file("../temp_concentration_level_visualization.png", mimetype='image/png')


    if plot_type == "edu.harvard.srl.GoodDayVisualization":
        # http://54.146.43.246:56735/get_daily_plot?username=mash_aya&plot_type=edu.harvard.srl.GoodDayVisualization
        # search s3 bucket for today's plot
        bucket = 'sara-dev-data-storage'
        with open("config/aws_config.json") as f:
            s3_connect_object = json.load(f)
        client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 

        todays_date = datetime.now().strftime("%m%d%Y")
        try: 
            plot_obj = client.get_object(Bucket = bucket, Key =  "saraaltair_plots/" + "latest" + "/" + user_id + "_good_day.png")
        except: 
            return("An error occured when retrieving a graph from S3. Please contact research administrators.")

        data = plot_obj['Body']
        f = open("temp_good_day_visualization.png", 'wb')
        f.write(data.read())
        f.close()
        return send_file("../temp_good_day_visualization.png", mimetype='image/png')

    
    if plot_type == "edu.harvard.srl.SleepAppUsageVisualization":
        # http://54.146.43.246:56735/get_daily_plot?username=mash_aya&plot_type=edu.harvard.srl.SleepAppUsageVisualization
        
        # user_id = "mash_aya"
        bucket = 'sara-dev-data-storage'
        with open("config/aws_config.json") as f:
            s3_connect_object = json.load(f)
        client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 

        todays_date = datetime.now().strftime("%m%d%Y")
        #try: 
        print("saraaltair_plots/" + todays_date + "/" + user_id + "_" + todays_date + "_sleep_app_usage.png")
        plot_obj = client.get_object(Bucket = bucket, Key =  "saraaltair_plots/" + "latest" + "/" + user_id + "_sleep_app_usage.png")
        #except: 
            #return("An error occured when retrieving a graph from S3. Please contact research administrators.")

        data = plot_obj['Body']
        f = open("temp_sleep_app_usage.png", 'wb')
        f.write(data.read())
        f.close()
        return send_file("../temp_sleep_app_usage.png", mimetype='image/png')


    return send_file("./chart.svg", mimetype='image/svg+xml')

    # return send_file("./chart.png", mimetype='image/png')

    # return("username is " + user_id)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
    
    