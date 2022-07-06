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
    print("Scheduling notification for {}".format(user_id))
    
    # Randomly pick from csv
    post_body = {
            "user_id":user_id,
            "player_id":onesignal_id,
            "heading":"Time for evening self-reflection",
            "body":"Evening self-reflection survey is now open for you.",
            "db_update":"y",
            "image":"sleep.png",
            "time":"18:00"
        }
    
    print(post_body)
    
    # Send the message
    r = requests.post('http://saraapp.org:6000/schedule_message', data = post_body)
    print("received status {} value {}\n".format(r.status_code, r.text))
