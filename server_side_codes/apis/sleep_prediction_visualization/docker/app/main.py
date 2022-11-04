import sys
from flask import Flask
from flask import send_file
import altair as alt
import pandas as pd
from altair_saver import save
import json
import mysql.connector as mysql
import pdb
from datetime import datetime
import pandas as pd
import os
from datetime import date
import time
from flask import request
from datetime import timedelta 

app = Flask(__name__)

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


@app.route('/plot_altair.png')
def plot_altair_png():
    source = pd.DataFrame({
        'a': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        'b': [28, 55, 43, 91, 81, 53, 19, 87, 52]
    })

    chart = alt.Chart(source).mark_bar().encode(
        x='a',
        y='b'
    )
    #
    save(chart, 'chart.png')

    #
    return send_file("./chart.png", mimetype='image/png')

#===========================================================================================
@app.route('/get_daily_plot', methods=['GET']) #GET requests will be blocked
def get_daily_plot():

    # Fetch user id from get request
    user_id = request.args.get('username')
    date_ = request.args.get('date')
    print(user_id)

    user_id = "mash"
    date_ = "20220929"

    # 
    result_str = generate_visualization_for_user_id(user_id, date_)

    # 
    if result_str == "Success":
        # return send_file("plot_" + user_id +  ".png", mimetype='image/png')
        return send_file("plot.png", mimetype='image/png')
    else:
        return send_file("plot_" + user_id +  ".png", mimetype='image/png')

def generate_visualization_for_user_id(user_id, date_):
    sleep_visualization = SleepVisualization()
    aware_id = sleep_visualization.get_aware_id_for_user_id(user_id)
    print("Processing: "+ user_id + ", " + aware_id)

    today = datetime.today()
    s = today.strftime("%Y%m%d")
    s =  date_ # UNCOMMENT LATER date_

    timezone_offset = 7 # UNCOMMENT LATER sleep_visualization.get_timezone_for_user_id(user_id) #for server in pacific time
    
    # time since the 1970 in pacific time since server is pacific.
    end_unix_time = 1000*time.mktime(datetime.strptime(s + " 02:00 PM", "%Y%m%d %I:%M %p").timetuple())
    end_unix_time = end_unix_time - (timezone_offset + 8 - 0)*3600*1000 #0-->8 for server
    start_unix_time = end_unix_time - 18*3600*1000

    ts = int(start_unix_time)/1000 + timezone_offset*60*60 #convert to pacific timezone. ToDo: change fixed value.      
    datetime_ts = datetime.utcfromtimestamp(ts) 
    print("start time: " + datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p'))
    ts = int(end_unix_time)/1000 + timezone_offset*60*60 #convert to pacific timezone. ToDo: change fixed value.      
    datetime_ts = datetime.utcfromtimestamp(ts) 
    print("end time: " + datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p'))

    #fetch sleep data
    date_string_for_app_usage_list, screen_time_value_list = sleep_visualization.fetch_raw_data(
        './config/awareSqlConfig.json', 
        aware_id, 
        start_unix_time, 
        end_unix_time,
        timezone_offset
    )
    # print(user_id)
    
    
    #
    sleep_app_usage_ts_df = sleep_visualization.process_raw_data(date_string_for_app_usage_list, screen_time_value_list)
    # print(sleep_app_usage_ts_df)

    if sleep_app_usage_ts_df is not None:
        sleep_visualization.generate_visualization("./config/aws_config.json", sleep_app_usage_ts_df, user_id, date_, timezone_offset)
        return "Success"
    else:
        return "Failure"


class SleepVisualization:

    def __init__(self):
        self.name = "Sleep visualization" # a name to this visualization
        self.description = "Shows app usage data between 8pm yesterday to 2pm today." # give a description to this visualization
    
    def get_visualization_description(self):
        """
        return an object with a description of the visualization.
        """
        return {
            "name":  self.name,
            "description":  self.description
        }
    
    def to_altair_datetime(self, dt):
        dt = pd.to_datetime(dt)
        return alt.DateTime(year=dt.year, month=dt.month, date=dt.day,
                            hours=dt.hour, minutes=dt.minute, seconds=dt.second,
                            milliseconds=0.001 * dt.microsecond)

    def generate_visualization(self, s3_config_file_name, sleep_app_usage_ts_df, user_id, date_, timezone_offset = -8):

        #today = datetime.today()
        today = datetime.strptime(date_, '%Y%m%d')
        s_today = today.strftime("%m/%d/%Y")

        yesterday = today - timedelta(days = 1) 
        s_yesterday = yesterday.strftime("%m/%d/%Y")

        # pdb.set_trace()
        domain = [self.to_altair_datetime(s_yesterday + " 08:00 PM"), self.to_altair_datetime(s_today + " 02:00 PM")]
        print(domain)

        # sleep_app_usage_ts_df["presence"] = sleep_app_usage_ts_df['screenTime'] > 0
        sleep_app_usage_ts_df["screen lock/unlock"] =  [1 for x in sleep_app_usage_ts_df['screenTime']]

        # xticks = ["10PM", "12AM", "02AM", "04AM", "06AM", "08AM", "10AM", "12PM", "02M"]
        chart = alt.Chart(sleep_app_usage_ts_df).mark_circle(size=60).encode(
            x=alt.X('date:T', axis=alt.Axis(format='%I%p', title='hour of the day (GMT' + str(timezone_offset) + ")", labelAngle=-45), scale=alt.Scale(domain=domain)),
            # x=alt.X('date:T', axis=alt.Axis(format='%I%p', title='hour of the day (GMT' + str(timezone_offset) + ")", labelAngle=-45)),
            y={"field": 'screen lock/unlock', "type": "quantitative", "scale": {"domain": [0.75,1.25]}, "axis": alt.Axis(labels=False, grid=False)}
            # y=alt.Y('presence', type='quantitative', axis=alt.Axis(labels=False)),
        ).properties(
            width=500,
            height=100,
            title=alt.TitleParams(
                ['For ' + user_id],
                baseline='bottom',
                orient='bottom',
                anchor='end',
                fontWeight='normal',
                fontSize=10
            )
        )

        line = alt.Chart(pd.DataFrame({'screen lock/unlock': [1]})).mark_rule().encode(y={
            "field": 'screen lock/unlock', "type": "quantitative", "scale": {"domain": [0.75,1.25]}},
            size=alt.value(0.25)
        )
        # alt.Chart(pd.DataFrame({'y': [5]})).mark_rule().encode(y='y', size=alt.value(0.5))
        # save as svg
        # pip install altair_saver
        # npm install vega-lite vega-cli canvas
        chart = chart + line
        save(chart, "plot_" + user_id +  ".png") 
        # save(chart, "plot_" + user_id +  ".svg") 

        

    def get_aware_id_for_user_id(self, user_id):
        mysql_config_file = "./config/saraSqlConfig.json"
        
        with open(mysql_config_file) as f:
            mysql_connect_object = json.load(f)
        
        db = mysql.connect(
            host = mysql_connect_object["host"],
            port = mysql_connect_object["port"],
            user = mysql_connect_object["user"],
            passwd = mysql_connect_object["passwd"],
            database = mysql_connect_object["database"]
        )
        
        cursor = db.cursor()
        select_statement = "select username, aware_id from users where aware_id IS NOT NULL;"
        cursor.execute(select_statement)
        aware_id_user_ids = cursor.fetchall()

        aware_ids_and_user_ids = {}
        aware_id = None
        for x in aware_id_user_ids:
            print(x)
            if str(x[0]) == user_id:
                aware_id  = str(x[1])
                break
        db.close()
        return aware_id

    def get_timezone_for_user_id(self, user_id):
        mysql_config_file = "./config/saraSqlConfig.json"
        
        with open(mysql_config_file) as f:
            mysql_connect_object = json.load(f)
        
        db = mysql.connect(
            host = mysql_connect_object["host"],
            port = mysql_connect_object["port"],
            user = mysql_connect_object["user"],
            passwd = mysql_connect_object["passwd"],
            database = mysql_connect_object["database"]
        )
        
        cursor = db.cursor()
        
        select_statement = "SELECT * FROM SARAApp.user_ids WHERE (user_id,currentTimeTs) IN  \
                                ( SELECT user_id, MAX(currentTimeTs) \
                                FROM SARAApp.user_ids \
                                GROUP BY user_id \
                                )  AND user_id = " + '"' + user_id + '"'
        
        cursor.execute(select_statement)
        aware_id_user_ids = cursor.fetchone()
        x = aware_id_user_ids
        readable_ts = x[3]
        splitted_parts = readable_ts.split(" ")
        print(str(x[1]) + "," + str(x[3]) + ", " + splitted_parts[-1].split(":")[0])
        
        db.close()
        return int(splitted_parts[-1].split(":")[0])


    def write_file(self, data, filename):
        with open(filename, 'wb') as f:
            f.write(data)

    # "./config/awareSqlConfig.json"
    def fetch_raw_data(self, db_config_location, aware_id, start_unix_time, end_unix_time, timezone_offset):
        """Function to fetch raw data. Returns an array of latest data."""
        aware_db = self.connect_to_database(db_config_location)
        cursor = aware_db.cursor()

        #-- fetch screen usage data
        where_clause = "device_id='" + aware_id + "'"
        where_clause = where_clause + " AND timestamp > " + str(start_unix_time) 
        where_clause = where_clause + " AND timestamp < " + str(end_unix_time) 
        where_clause = "(" + where_clause +  ")"
        cursor.execute("SELECT * FROM screen where " + where_clause + " order by timestamp asc;")
        records_in_screen_usage_table = cursor.fetchall()

        #--
        # initialize variables
        date_string_for_app_usage_list = [] # ["null" for i in range(len(records_in_screen_usage_table))]
        timestamp_for_app_usage_list = [] #[0 for i in range(len(records_in_screen_usage_table))]
        screen_time_value_list = [] # [0 for i in range(len(records_in_screen_usage_table))]

        
        for row in records_in_screen_usage_table:

            # aware times are in utc.
            ts = int(row[1])/1000 + timezone_offset*60*60 #convert to pacific timezone. ToDo: change fixed value.

            timestamp_for_app_usage_list.append(ts)
            
            datetime_ts = datetime.utcfromtimestamp(ts) 
            date_string_for_app_usage_list.append(datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p'))
            screen_time_value_list.append(int(row[3]))

        ts = start_unix_time/1000 + timezone_offset*60*60
        datetime_ts = datetime.utcfromtimestamp(ts)
        print("Start time: " + datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p'))

        ts = end_unix_time/1000 + timezone_offset*60*60
        datetime_ts = datetime.utcfromtimestamp(ts)
        print("End time: " + datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p'))


        #
        # pdb.set_trace()
        return date_string_for_app_usage_list, screen_time_value_list

    def get_timezone_for_user_id(self, user_id):
        mysql_config_file = "./config/saraSqlConfig.json"
        
        with open(mysql_config_file) as f:
            mysql_connect_object = json.load(f)
        
        db = mysql.connect(
            host = mysql_connect_object["host"],
            port = mysql_connect_object["port"],
            user = mysql_connect_object["user"],
            passwd = mysql_connect_object["passwd"],
            database = mysql_connect_object["database"]
        )
        
        cursor = db.cursor()
        
        select_statement = "SELECT * FROM SARAApp.user_ids WHERE (user_id,currentTimeTs) IN  \
                                ( SELECT user_id, MAX(currentTimeTs) \
                                FROM SARAApp.user_ids \
                                GROUP BY user_id \
                                )  AND user_id = " + '"' + user_id + '"'
        
        cursor.execute(select_statement)
        aware_id_user_ids = cursor.fetchone()
        x = aware_id_user_ids
        readable_ts = x[3]
        splitted_parts = readable_ts.split(" ")
        print(str(x[1]) + "," + str(x[3]) + ", " + splitted_parts[-1].split(":")[0])
        
        db.close()
        return int(splitted_parts[-1].split(":")[0])
    
    def process_raw_data(self, date_string_for_app_usage_list, screen_time_value_list):
        """Gets the raw data array and preprocess into another array for storage"""
        app_usage_data = {
            'date': date_string_for_app_usage_list,
            'screenTime': screen_time_value_list   
        }
        
        #-- convert to pandas dataframe, with time based indexing
        app_usage_data_frame = pd.DataFrame(app_usage_data, columns = ['date','screenTime']) 
        app_usage_data_frame['date'] = pd.to_datetime(app_usage_data_frame['date'], format='%Y-%m-%d %I:%M:%S %p')
        
        return app_usage_data_frame

    def connect_to_database(self, mysql_config_file):
        """
        Connects to sql database. Returns a db object.
        """

        with open(mysql_config_file) as f:
            mysql_connect_object = json.load(f)
            
        return mysql.connect(
            host = mysql_connect_object["host"],
            port = mysql_connect_object["port"],
            user = mysql_connect_object["user"],
            passwd = mysql_connect_object["passwd"],
            database = mysql_connect_object["database"],
            raw=True # needed for reading blob data.
        )

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5001)