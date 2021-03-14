''' 
Generates altair plots and upload them to AWS S3 storage
'''
import boto3
import io
import altair as alt
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import mysql.connector as mysql
import json

def get_sql_config_from_json(config_file_name):
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
    with open(config_file_name) as f:
        mysql_connect_object = json.load(f)
        
    return mysql_connect_object

def get_S3_config_from_json(config_file_name):
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


def upload_plot_to_s3(plot, userid, date):
    """
    plot altiar data as a plot.html and upload with username and date
    """
    plot.save("plot.html")

    s3_connect_object = get_S3_config_from_json("config/aws_config.json")
    client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 
    client.upload_file("plot.html", 'sara-dev-data-storage',  "saraaltair_plots/" + userid + "_" + date + ".html")



def fetch_user_data(userid, start_timestamp, cursor):
    """
    returns data frame of survey answers since a certain timestamp
    """

    query = "SELECT json_answer, survey_completion_time FROM harvardSurvey WHERE user_id = %s AND survey_completion_time > %s"
    cursor.execute(query, (userid, start_timestamp))
    data = cursor.fetchall()

    survey_responses = []
    for row in data: 
        survey_data = json.loads(row[0])
        survey_data['time_completed'] = datetime.fromtimestamp(float(row[1])/1000) # expects seconds, not milliseconds
        survey_responses.append(survey_data)

    df = pd.DataFrame(survey_responses)

    return(df)


def timestamp_n_days_ago(days):
    return (datetime.today() - timedelta(days = days)).timestamp()



# connect to db
mysql_connect_object = get_sql_config_from_json('config/saraSqlConfig.json')
db = mysql.connect(
    host = mysql_connect_object["host"],
    port = mysql_connect_object["port"],
    user = mysql_connect_object["user"],
    passwd = mysql_connect_object["passwd"],
    database = mysql_connect_object["database"]
)
cursor = db.cursor()


# get a list of all users
cursor.execute("SELECT username from users;")
users = cursor.fetchall()


# get date related fields
todays_date_string = datetime.today().strftime('%Y-%m-%d') # today's date
past_timestamp = timestamp_n_days_ago(30)

total = len(users)
uploaded = 0
for user in users:
    username = user[0]
    user_df =  fetch_user_data(username, past_timestamp, cursor)
    
    if(user_df.shape[0] > 7): # more than a week of data
        plot = alt.Chart(user_df).mark_line().encode(x='time_completed', y='Q2')
        print("uploaded ", username, " plot")
        upload_plot_to_s3(plot, username, todays_date_string)
        uploaded += 1
    else: 
        print("    ", username, " does not have a week's worth of data")



print("CREATED {} out of {} plots for {}".format(uploaded, total, todays_date_string))

