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

from visualization import VisualizationFactory
from helper_functions import get_sql_config_from_json, get_S3_config_from_json

def fetch_num_points(userid, start_timestamp, cursor):
    """
    returns data frame of survey answers since a certain timestamp
    """
    query = "SELECT COUNT(json_answer) FROM harvardSurvey WHERE user_id = %s AND survey_completion_time > %s"
    cursor.execute(query, (userid, start_timestamp))
    data = cursor.fetchall()
    return(data[0][0])


def update_insights_database(userid, s3_key, plot_type, num_data_points, cursor):
    """
    returns data frame of survey answers since a certain timestamp
    """
    query = "INSERT INTO insights (uid, s3_key, type, num_data_points) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (userid, s3_key, plot_type, num_data_points))
    
    return(data[0][0])


def timestamp_n_days_ago(days):
    return (datetime.today() - timedelta(days = days)).timestamp()

if __name__=="__main__": 
    vis_factory = VisualizationFactory.VisualizationFactory()
    
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
        user_datapoints = fetch_num_points(username, past_timestamp, cursor)
        if(user_datapoints > 7): # more than a week of data
            # create plot
            s3_key = vis_factory.generate_mood_visualization(username)
           
            # update mysql database
            query = "INSERT INTO insights (uid, s3_key, type, num_data_points) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (username, s3_key, vis_factory.list_of_visualizations[0], user_datapoints))
            db.commit()
            if(cursor.rowcount > 0): 
                print("uploaded ", username, " plot")
            else: 
                print("error uploading ", username, " to mysql")
            uploaded += 1
        else: 
            print("    ", username, " does not have a week's worth of data")


    print("CREATED {} out of {} plots for {}".format(uploaded, total, todays_date_string))

