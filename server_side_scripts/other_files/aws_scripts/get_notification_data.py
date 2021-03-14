# To use decrypt.js, need to install package in the same folder as
# decrypt.js in Command Prompt: npm install crypto-js

import json
import csv
import boto3
import subprocess
from collections import OrderedDict
import sys
from prettytable import PrettyTable
import mysql.connector as mysql
import datetime

# Look at getConfig.py to create config Json file.
# from getConfig import ACCESS_KEY, SECRET_KEY

"""
HOST  = "ec2-54-91-131-166.compute-1.amazonaws.com"
PORT = 3308
USERNAME = "root"
PASSWORD = "helloworld"
DATABASE = "SARAApp"
"""

HOST = "reslnadaptsdb01.research.chop.edu"
PORT = 3306
USERNAME = "flask"
PASSWORD = "#Chop2716"
DATABASE = "adapts"


class StudyDataCheck:
    def __init__(self):
        # Use Client to access s3
        pass

    def notification_data_from_Nov_1(self):
        """
        Gets 4PM notification data and like/dislike. Comes from a database.

        TODO: make the headers input to the function.
        """

        print('\n\n\n\n==========================================================================')
        print("notification assignment")
        print('==========================================================================\n')

        db = mysql.connect(
            host=HOST,
            port=PORT,
            user=USERNAME,
            passwd=PASSWORD,
            database=DATABASE
        )

        cursor = db.cursor()
        cursor.execute("SELECT PARTICIAPANT_ID, whenReceivedReadableTs, typeOfNotification, device_type FROM SARA_Notifications where (PARTICIAPANT_ID LIKE 'AYA%' or PARTICIAPANT_ID LIKE 'Caregiver%') order by whenReceivedTs desc;")
        result = cursor.fetchall()

        header = ["userName", "whenReceivedReadableTs", "typeOfNotification", "device_type", "Right time?"]

        notification4PMPrettyTable = PrettyTable()
        notification4PMPrettyTable.field_names = header

        for notification4PMRecord in result:
            
            notification_type = notification4PMRecord[2]
            when_received_readable_ts = notification4PMRecord[1]


            if notification_type == "4:00PM":
                notification_delivered_at_right_time = "false"
                if when_received_readable_ts.split(" ")[1].startswith("16") == True:
                    notification_delivered_at_right_time = "true"

            elif notification_type == "6:00PM":
                notification_delivered_at_right_time = "false"
                if when_received_readable_ts.split(" ")[1].startswith("18") == True:
                    notification_delivered_at_right_time = "true"

            elif notification_type == "reminder_8PM":
                notification_delivered_at_right_time = "false"
                if when_received_readable_ts.split(" ")[1].startswith("20") == True:
                    notification_delivered_at_right_time = "true"


            x = [notification4PMRecord[0], notification4PMRecord[1], notification4PMRecord[2], notification4PMRecord[3], notification_delivered_at_right_time]
            # print(x)
            notification4PMPrettyTable.add_row(
                [str(data_point).strip().encode('ascii', 'ignore') for data_point in x])

        print('\n')
        print(notification4PMPrettyTable)
        print('\n\n\n\n')


if __name__ == "__main__":
    studyDataCheck = StudyDataCheck()
    
    
    current_time = datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d %I:%M:%S%p %Z")
    print("Generated on:  " + current_time + "\n\n\n\n")

    studyDataCheck.notification_data_from_Nov_1()
