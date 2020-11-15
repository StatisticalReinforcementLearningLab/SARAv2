import io
import random
from flask import Response
#from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
#from matplotlib.figure import Figure
import mysql.connector as mysql
from datetime import datetime
import pandas as pd
import json
import time

#from flask_cors import CORS
from flask import jsonify
from flask import send_file
from flask import Flask

from io import StringIO, BytesIO

import altair as alt
from altair_saver import save

#from app import app
# CORS(app)
app = Flask(__name__)

#===========================================================================================

@app.route('/')
def home():
   return "hello world! 2"


@app.route('/showplot')
def show_png():
    return '<img src="/plot.png" alt="my plot" style="width: 80%;">'



def getSqlConfigFromJSON(configFileName):
    """
    Loads full mysql connect object from database returns the value as a JSON object. Format of the JSON object 
    is the following:
    
        {
            "host": "hostname.com",
            "port": 99999,
            "user": "root",
            "passwd": "passworkd",
            "database": "database_or_schema_name"
        }
    """
    
    with open(configFileName) as f:
        mysqlConnectObject = json.load(f)
        
    return mysqlConnectObject



def getScreenUsageDataFrame(user_id, start_unix_time, end_unix_time):
    """
    Select screen usage data points into the test database.
    """

    print('Fetching data')
    
    #get sql connect config
    mysqlConnectObject = getSqlConfigFromJSON('./awareSqlConfig.json')

    # connect to db
    db = mysql.connect(
        host = mysqlConnectObject["host"],
        port = mysqlConnectObject["port"],
        user = mysqlConnectObject["user"],
        passwd = mysqlConnectObject["passwd"],
        database = mysqlConnectObject["database"]
    )
    cursor = db.cursor()

    # fetch data.
    where_clause = "device_id='" + user_id + "'"
    where_clause = where_clause + " AND timestamp > " + str(start_unix_time) 
    where_clause = where_clause + " AND timestamp < " + str(end_unix_time) 
    where_clause = "(" + where_clause +  ")"
    cursor.execute("SELECT * FROM screen where " + where_clause + " order by timestamp asc;")
    recordsInScreenTable = cursor.fetchall()

    # initialize variables
    dateStringForAppUsageList = []
    timestampForAppUsageList = []
    screenTimeValueList = []
    
    print('creating data frame')
    for row in recordsInScreenTable:
        
        ts = row[1]/1000 - 7*60*60 #convert to pacific timezone. ToDo: change fixed value.
        timestampForAppUsageList.append(ts)
        
        datetime_ts = datetime.utcfromtimestamp(ts) 
        dateStringForAppUsageList.append(datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p'))
        screenTimeValueList.append(row[3])
                
    appUsageData = {
        'date': dateStringForAppUsageList,
        'screenTime': screenTimeValueList   
    }
    
    #-- convert to pandas dataframe, with time based indexing
    appUsageDataFrame = pd.DataFrame(appUsageData, columns = ['date','screenTime']) 
    appUsageDataFrame['date'] = pd.to_datetime(appUsageDataFrame['date'], format='%Y-%m-%d %I:%M:%S %p')
    
    return appUsageDataFrame

def generateSvgFileForCurrentStream(appUsageDataFrame):
    chart = alt.Chart(appUsageDataFrame).mark_circle(size=60).encode(
        x='date:T',
        y={"field": 'screenTime', "type": "quantitative", "scale": {"domain": [1.5,3.5]}}
    )
    
    for fmt in ['json', 'vg.json', 'html', 'svg']:
        save(chart, f'chart.{fmt}')



@app.route('/plot.svg')
def plot_svg():

    today = datetime.today()
    s = today.strftime("%m/%d/%Y")
    end_unix_time = 1000*time.mktime(datetime.strptime(s + " 02:00 PM", "%m/%d/%Y %I:%M %p").timetuple())
    start_unix_time = end_unix_time - 18*3600*1000
    user_id = '88315702-a3e6-4296-8437-0a56b4c4f03b'
    appUsageDataFrame = getScreenUsageDataFrame(user_id, start_unix_time, end_unix_time)

    generateSvgFileForCurrentStream(appUsageDataFrame)

    return send_file("./chart.svg", mimetype='image/svg+xml')





if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)