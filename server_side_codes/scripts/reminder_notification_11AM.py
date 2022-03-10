import mysql.connector as mysql
import pdb
import os.path
import time
import zlib
import codecs
import csv
from random import randint
from datetime import datetime
import json
import subprocess
import pandas as pd
import boto3
import requests 
import random 
from sara.connectors.connectors import connect_to_database, create_boto_resource 
import io

print(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))


def read_s3_csv(filename):
    with open('/home/ec2-user/SARATemplate/sara-python-package/sara/config/aws_config.json') as f:
            s3_connect_object = json.load(f)
    s3 = create_boto_resource() 
    content = s3.Object("sara-template-data-storage", "notification_options/" + filename).get()['Body']
    csv_df = pd.read_csv(content)
    return csv_df

def read_s3_excel(filename):
    with open('/home/ec2-user/SARATemplate/sara-python-package/sara/config/aws_config.json') as f:
            s3_connect_object = json.load(f)
    s3 = create_boto_resource() 
    content = s3.Object("sara-template-data-storage", "notification_options/" + filename).get()['Body']
    content = io.BytesIO(content.read())
    excel_df = pd.read_excel(content, dtype={'body': str, 'heading': str})
    return excel_df


def getListOfUsersAndOnesignalID():
    """
    Returns a list of current used ids and oneSingalIds
    """

    print("create a list of active users and oneSignalID")
    db = connect_to_database("study")
    cursor = db.cursor()
    cursor.execute("SELECT * FROM user_ids WHERE (user_id,currentTimeTs) IN \
                    ( SELECT user_id, MAX(currentTimeTs)  \
                    FROM user_ids \
                    GROUP BY user_id \
                   )")
    activeUsersAndLatestDailySurvey = cursor.fetchall()

    users = {}
    for row in activeUsersAndLatestDailySurvey:
        userId = row[1]
        oneSignalPlayerId = row[2]

        if '-' in oneSignalPlayerId: 
            users[userId] = oneSignalPlayerId

    return users



# Get users
ids = getListOfUsersAndOnesignalID()

for user_id, onesignal_id in ids.items(): 

    # Read csv of notifications, randomly cat or dog
    # if random.random() < 0.5: 
    #    csv_df = read_s3_csv('cat_notifications.csv')
    #else: 
    #    csv_df = read_s3_csv('dog_notifications.csv')
    excel_df = read_s3_excel('12pm_reminders.xlsx')

    print("Scheduling notification for {}".format(user_id))
    
    # Randomly pick from csv
    content = excel_df.iloc[randint(0, excel_df.shape[0] - 1), :] # random notification
    post_body = {
            "user_id":user_id,
            "player_id":onesignal_id,
            "heading":content['heading'],
            "body":content['body'],
            "db_update":"y",
            "image":"sleep.png",
            "time":"11:00"
        }
    
    print(post_body)
    
    # Send the message
    r = requests.post('http://saraapp.org:6000/schedule_message', data = post_body)
    print("received status {} value {}\n".format(r.status_code, r.text))
