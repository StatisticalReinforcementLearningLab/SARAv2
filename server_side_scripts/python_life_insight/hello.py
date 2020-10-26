import io
import random
from flask import Response
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import mysql.connector as mysql
from datetime import datetime
import pandas as pd
import matplotlib.pyplot as plt
import json
import time
import matplotlib.dates as mdates

from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'


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



@app.route('/plot.png')
def plot_png():
    fig = create_figure()
    output = io.BytesIO()
    FigureCanvas(fig).print_png(output)
    return Response(output.getvalue(), mimetype='image/png')

def create_figure():

    today = datetime.today()
    s = today.strftime("%m/%d/%Y")
    #print("d1 =", s)
    end_unix_time = 1000*time.mktime(datetime.strptime(s + " 02:00 PM", "%m/%d/%Y %I:%M %p").timetuple())
    start_unix_time = end_unix_time - 18*3600*1000


    user_id = '88315702-a3e6-4296-8437-0a56b4c4f03b'
    appUsageDataFrame = getScreenUsageDataFrame(user_id, start_unix_time, end_unix_time)

    fig = Figure(figsize=(6, 4), dpi=80)
    ax = fig.add_subplot(111)
    myFmt = mdates.DateFormatter('%-I%p')
    ax.plot(appUsageDataFrame['date'], appUsageDataFrame['screenTime'], '*')
    ax.xaxis.set_major_formatter(myFmt)
    return fig