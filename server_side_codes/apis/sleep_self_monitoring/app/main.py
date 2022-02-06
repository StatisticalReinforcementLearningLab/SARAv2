import sys
from flask import Flask
from flask import send_file
import altair as alt
import pandas as pd
from altair_saver import save
from flask import jsonify
from flask import request
from datetime import datetime, timedelta
from flask_cors import CORS, cross_origin
import json
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Hash import SHA256
from base64 import b64decode
import urllib.parse
import mysql.connector as mysql
import dateutil.parser 
import pytz

# import boto3
app = Flask(__name__)
CORS(app, allow_headers=['Content-Type', 'Access-Control-Allow-Origin',
                         'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods'])

@app.after_request
def apply_caching(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response                       

@app.route("/")
def hello():
    version = "{}.{}".format(sys.version_info.major, sys.version_info.minor)
    message = "Hello World from Mash. Flask in a uWSGI Nginx Docker container with Python {} (default)".format(
        version
    )
    return message

@app.route('/plot.png')
def plot_png():
    return send_file("./plot.png", mimetype='image/png')

@app.route('/support_message', methods = ['POST'])
def support_message():
    d = {"msg": "message"}
    content = request.get_json()
    d["content"] = content
    response = app.response_class(
        response=json.dumps(d),
        status=200,
        mimetype='application/json'
    )
    return response



def get_S3_config_from_json(self, config_file_name):
    """
    Loads full S3 connect object . Format of the JSON object 
    is the following:
    
        {
            "AWS_ACCESS_KEY":"AKIASR52SY45PVC",
            "AWS_SECRET_KEY":"6sbt6OV/Ovv0Ch0x1eW",
            "AWS_REGION_NAME":"us-east-1"
        }  

    """
    with open(config_file_name) as f:
        s3_connect_object = json.load(f)
        
    return s3_connect_object

def store_visualization_to_s3(self, s3_config_file_name, chart, user_id, file_name):
    """
    Store the visualization in the S3 bucket
    
    todays_date = datetime.now().strftime("%m%d%Y")
    s3_connect_object = self.get_S3_config_from_json(s3_config_file_name)
    client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 
    client.upload_file(file_name, 'sara-dev-data-storage',  "saraaltair_plots/" + todays_date + "/" + user_id + "_" + todays_date + "_sleep_self_monitoring.svg")

    # save as latest
    client.upload_file(file_name, 'sara-dev-data-storage',  "saraaltair_plots/latest/" + user_id + "_latest_sleep_self_monitoring.svg")
    """
    pass


def conv_table_hour_label_to_ylabels():
    """
    Helper function to return the current mapping of hour labels and corresponding y labels in the graph.
    We call this function to keep a consistent copy of the hour label mapping to y axis label in the graph.
    
    returns:
        hour_label: hour labels in am and pm
        y_labels: mapping in the y axis label for the chart
    """
        
    # note our conversion starategy is the following:
    # copied from previous function. Make it a variable.
    hour_labels = ["8p", "9p", "10p", "11p", "12a", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p"]
    y_labels    = [   0,    1,     2,     3,     4,    5,    6,    7,    8,    9,   10,   11,   12,   13,   14,    15,    16,    17,   18]

    return hour_labels, y_labels

def convert_sleep_labels_to_ylabels(type, label):
    """
    Converts a sleep start/end hour label "XX:XX" into y axis label, that we can plot.
    
    Input:
        "type":        is either "start" or "end". Start represents the sleep start time, end represents the sleep end time
        "label":       is hour and minute, and in the format of "XX:XX" 
        
    return:
        (y_label_sleep_end, hour_label)
        y_label_sleep_end: y axis label for input "label"
        hour_label: hour part in the input "label" which also is in input "hour_labels"
    """
    hour_labels, y_labels = conv_table_hour_label_to_ylabels()
    
    # note start is between 9:00PM to 8:00AM
    # note end is between 03:00AM to 2:00PM

    if type == "start":
        time_parts = label.split(":")
        hour_part = int(time_parts[0])
        minute_part = float(time_parts[1])

        if hour_part in [9, 10, 11]:
            hour_label = str(hour_part) + "p"
        else: # is between 12A to 8AM
            hour_label = str(hour_part) + "a"

        y_label_sleep_start = y_labels[hour_labels.index(hour_label)]
        y_label_sleep_start = y_label_sleep_start + minute_part/60.0
        return (y_label_sleep_start, hour_label)
        
    if type == "end":
        time_parts = label.split(":")
        hour_part = int(time_parts[0])
        minute_part = float(time_parts[1])

        if hour_part in [12, 1, 2]:
            hour_label = str(hour_part) + "p"
        else: # is between 3A to 11AM
            hour_label = str(hour_part) + "a"

        y_label_sleep_end = y_labels[hour_labels.index(hour_label)]
        y_label_sleep_end = y_label_sleep_end + minute_part/60.0
        return (y_label_sleep_end, hour_label)

def convert_raw_sleep_data_to_imputed_json(sleep_data):    
    """
    Takes sleep data in raw format, which may include missing data for days when no surveys are reported.
    It imputes missing days with empty strings.
    
        Input:
            "Sleep data:" is a list of values in the following format. The report data is when
                          the sleep data is reported. Start is the start time of sleep. 
                sleep_data = [
                    {"report_date": "20210724", "start": "11:00", "end": "09:00"},
                    {"report_date": "20210731", "start": "2:30", "end": "09:00"},
                    {"report_date": "20210801", "start": "1:30", "end": "11:00"}
                ]

        Returns: 
            "sleep_data_processed": Imputed data. The example from the above will return the following:
                [{
                    'date': 'Today',
                    'start': 0,
                    'end': 0,
                    'total_sleep_hours': ''
                 }, {'date': '08-07', 'start': 0, 'end': 0, 'total_sleep_hours': ''}, 
                    {'date': '08-06', 'start': 0, 'end': 0, 'total_sleep_hours': ''}, 
                    {'date': '08-05', 'start': 0, 'end': 0, 'total_sleep_hours': ''}, 
                    {'date': '08-04', 'start': 0, 'end': 0, 'total_sleep_hours': ''}, 
                    {'date': '08-03', 'start': 0, 'end': 0, 'total_sleep_hours': ''}, 
                    {'date': '08-02', 'start': 0, 'end': 0, 'total_sleep_hours': ''}, 
                    {'date': '08-01', 'start': 5.5, 'end': 15.0, 'total_sleep_hours': '9.5'}, 
                    {'date': '07-31', 'start': 6.5, 'end': 13.0, 'total_sleep_hours': '6.5'}, 
                    {'date': '07-30', 'start': 0, 'end': 0, 'total_sleep_hours': ''}, 
                    {'date': '07-29', 'start': 0, 'end': 0, 'total_sleep_hours': ''}, 
                    {'date': '07-28', 'start': 0, 'end': 0, 'total_sleep_hours': ''}, 
                    {'date': '07-27', 'start': 0, 'end': 0, 'total_sleep_hours': ''}, 
                    {'date': '07-26', 'start': 0, 'end': 0, 'total_sleep_hours': ''}
               ]
    """
    
    hour_labels, y_labels = conv_table_hour_label_to_ylabels()

    sleep_data_with_date_key = {}
    for index in range(len(sleep_data)):
        sleep_data_with_date_key[sleep_data[index]["report_date"]] = sleep_data[index]

    sleep_data_processed = []
    for days_to_subtract in range(14): # start with a 14 day follow-up
        # from pytz import all_timezones
        # all_timezones
        d = datetime.now(pytz.timezone('US/Hawaii')) - timedelta(days=days_to_subtract)
        date_str = d.strftime("%Y%m%d")

        if days_to_subtract == 0:
            date = "Today"
        else: 
            date = d.strftime("%m-%d")

        if date_str in sleep_data_with_date_key:
            sleep_datum = sleep_data_with_date_key[date_str]
            start_time_processed = convert_sleep_labels_to_ylabels("start", sleep_datum["start"])
            end_time_processed = convert_sleep_labels_to_ylabels("end", sleep_datum["end"])
            sleep_data_processed.append({"date": date, 
                                         "start": start_time_processed[0], 
                                         "end": end_time_processed[0], 
                                         "total_sleep_hours": str(end_time_processed[0] - start_time_processed[0])})
        else:
            sleep_data_processed.append({"date": date, 
                                         "start": 0, 
                                         "end": 0, 
                                         "total_sleep_hours": ""})
    return sleep_data_processed

def create_chart_from_pd(sleep_data_processed):
    
    hour_labels, y_labels = conv_table_hour_label_to_ylabels()
    
    source = pd.DataFrame(sleep_data_processed)
    yHourLabels = pd.DataFrame(data = {'hour_labels': hour_labels, 'y_labels': y_labels})

    bar_chart = alt.Chart(source).mark_bar().encode(
        y=alt.Y('start', axis=alt.Axis(labels=False, tickCount = len(hour_labels))),
        y2='end',
        x='date',
        color=alt.condition(
            alt.datum.end -  alt.datum.start >= 8,
            alt.value("#006600"),  # The positive color
            alt.value("#BB0000")  # The negative color
        )
    )

    text = alt.Chart(yHourLabels).mark_text(
        align='right'
    ).encode(
        y=alt.Y('y_labels:Q', title='sleep time'),
        x=alt.value(-3),
        text='hour_labels:N',
    )

    total_sleep_hour_label = bar_chart.mark_text(
        align='center',
        baseline='middle',
        dy= -15 
    ).encode(
        text='total_sleep_hours:Q',
        color = alt.value("white")
    )

    chart = bar_chart + text + total_sleep_hour_label
    return chart

def connect_to_database(mysql_config_file, db_name):
    """
    Connects to sql database. Returns a db object.
    """
    
    with open(mysql_config_file) as f:
        mysql_connect_object = json.load(f)

    db = mysql.connect(
        host = mysql_connect_object["DB_HOST"],
        port = mysql_connect_object["DB_PORT"],
        user = mysql_connect_object["DB_USER"],
        passwd = mysql_connect_object["DB_PASSWORD"],
        database = db_name # "HarvardDev"
    )
      
    return db

def format_single_survey(sleep_survey_in_json):
    """
    Output sleep survey in the following format.
    {"report_date": "20210724", "start": "11:00", "end": "09:00"}
    """
    formatted_sleep_data = {}
    formatted_sleep_data["start"] = sleep_survey_in_json["Q2_modified"].split()[0]
    formatted_sleep_data["end"] = sleep_survey_in_json["Q3_modified"].split()[0]

    ts = sleep_survey_in_json["ts"].split(",")[0]#.replace(":","") # in "September 5th 2021, 9:33:45 am -07:00" format
    datetime_object = dateutil.parser.parse(ts) 
    formatted_sleep_data["report_date"] = datetime_object.strftime("%Y%m%d")

    return formatted_sleep_data

def get_sleep_survey(db, username = 'mash', num_days = 14):
    cursor = db.cursor()
    sql_command = "SELECT when_inserted, json_answer FROM study.filled " 
    sql_command = sql_command + "where user_id=\""+username +"\" and survey_name = 'sleep_survey' and when_inserted > NOW() - INTERVAL " + str(num_days) + " DAY "
    sql_command =  sql_command + " order by survey_completion_time;"

    cursor.execute(sql_command)  
    returned_data = cursor.fetchall()
    
    formatted_sleep_survey_array = []
    for row in returned_data:
        date = row[0]
        row_json=json.loads(row[1])
        formatted_sleep_survey_array.append(format_single_survey(row_json))

    return formatted_sleep_survey_array

def get_sleep_data_for_last_14_days(user_id):
    # currently sending mock data for debug
    db = connect_to_database('./mysql_config.json', "study")
    formatted_sleep_survey_array = get_sleep_survey(db, user_id)
    print(formatted_sleep_survey_array)
    return formatted_sleep_survey_array

def draw_sleep_graph(sleep_data):
    """
    Calls the function to transform raw data to pandas data format. 
    Then calls altair to draw the plot.
    
    returns:
        altair chart with the sleep graph
    """
    sleep_data_processed = convert_raw_sleep_data_to_imputed_json(sleep_data)
    return create_chart_from_pd(sleep_data_processed)


def decrypt_user_string(user_and_sleep_info):
    """
    This function uses the private key stored in the pem file.
    The private_key.pem will be distributed from slack. Request it from mash.
    Once you have the pem file, then copy it into the app directory
    """
    print(user_and_sleep_info)
    key = RSA.import_key(open("./private_key.pem").read())
    print(key)
    cipher = PKCS1_OAEP.new(key, hashAlgo=SHA256)
    b64ized = b64decode(user_and_sleep_info)
    decrypted_message = cipher.decrypt(b64ized) # returns a byte literal
    decrypted_object = json.loads(decrypted_message.decode('UTF-8'))
    return decrypted_object

@app.route('/sleep_graph.png', methods=['GET', 'OPTIONS'])
def send_sleep_monitoring_plot():
    """
    Sends the sleep monitoring plot to the angular side of the app
    The input to this function call is a user id and optional sleep survey. 

    This function goes back to the mysql database and gets the sleep data 
    for the last 14 days. 
    If new sleep survey is provided then the new data is appended to the 
    existing 14 days of survey "TODO"
    The data format has to match the function described in "TODO"

    input (comes through post):
        user id
        latest sleep survey (optional). 

    output (as a file):
        sleep graph for the last 14 days
    """

    # check if the user_id and sleep survey is in the post
    req_data = decrypt_user_string(urllib.parse.unquote(request.args.get('raw')))

    if (req_data is not None) and (req_data['user_id'] is not None):
        user_id = req_data['user_id']

        # grab last 14 days of survey data for user_id.
        sleep_data = get_sleep_data_for_last_14_days(user_id)


        # new survey data is available then we append the data to the json
        if "sleep_data" in req_data:
            # Append the new sleep data to the list.
            sleep_data.append(req_data["sleep_data"])
        
        chart = draw_sleep_graph(sleep_data)
        chart = chart.properties(width=400).configure_axisY(
                titleAngle=-90, 
                titleX=-25,
                labelPadding=160, 
                labelAlign='left'
            )

        #combine plot and background text
        #final_chart = alt.layer(chart,watermark1,watermark2,watermark3,watermark4).configure(background=background_col).configure_axis(
        #    titleFontSize=15,titleColor=title_col).configure_title(fontSize=25,color=title_col).properties(width=400,height=400)

        chart.save("plot.html")

        # save png
        save(chart, "plot.png", scale_factor=4) 

        # create the image and store it in the local files.
        file_name = "./plot.png"
        return send_file(file_name, mimetype='image/png')

    else:
        # TODO: Send an error webpage. 
        return "ERROR: User id is not provided."
        pass



    # if sleep survey is not provided then send the cached sleep survey


    # if sleep survey is provided then create a new sleep survey

    pass


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000)