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

print(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))

def load_database_config(dbname):
    config_location = 'mysql_config.json'
    if os.path.isfile(config_location):
        pass
    else:
        config_location = '/home/ec2-user/SARATemplate/sara-python-package/sara/config/' + config_location
    
    with open(config_location) as f:
        mysql_connect_object = json.load(f)
        
    return mysql.connect(
        host = mysql_connect_object["DB_HOST"],
        port = mysql_connect_object["DB_PORT"],
        user = mysql_connect_object["DB_USER"],
        passwd = mysql_connect_object["DB_PASSWORD"],
        database = dbname
    )

def read_s3_csv(filename):
    with open('/home/ec2-user/SARATemplate/sara-python-package/sara/config/aws_config.json') as f:
            s3_connect_object = json.load(f)
    s3 = boto3.resource("s3", region_name = s3_connect_object["AWS_REGION_NAME"],
                                aws_access_key_id= s3_connect_object["AWS_ACCESS_KEY"],
                                aws_secret_access_key= s3_connect_object["AWS_SECRET_KEY"])
    content = s3.Object("sara-template-data-storage", "notification_options/" + filename).get()['Body']
    csv_df = pd.read_csv(content)
    return csv_df

# We need to connect this to oneSignal somehow
def getActiveUsers():
    """
    Reading active users and onesignalIds from database
    """

    db = load_database_config("study")
    cursor = db.cursor()
    cursor.execute("SELECT * FROM user_ids WHERE (user_id,currentTimeTs) IN \
                    ( SELECT user_id, MAX(currentTimeTs)  \
                    FROM user_ids \
                    GROUP BY user_id \
                   )")
    result = cursor.fetchall()

    return result

def getListOfUsersAndOnesignalID():
    """
    Returns a list of current used ids and oneSingalIds
    """

    print("create a list of active users and oneSignalID")

    activeUsersAndLatestDailySurvey = getActiveUsers()

    """
    users = {}
    for row in activeUsersAndLatestDailySurvey:
        # print(row)
        userId = row[1]
        oneSignalPlayerId = row[2]

        if '-' in oneSignalPlayerId: 
            users[userId] = oneSignalPlayerId
    """
    users = {}
    users['sarah'] = 'dc4d06b2-8990-4a0a-958c-487f109f6163'
    users['nathan'] = '0848817e-a7fd-48cf-bc5d-e864772b6d94'

    return users

def get_latest_survey(user, survey_name): 
    '''
    Survey answers all reside in the "filled" table
    '''
    db = load_database_config("study")
    cursor = db.cursor()
    statement = 'SELECT json_answer\
            FROM filled WHERE (user_id,survey_completion_time) IN ( SELECT user_id, MAX(survey_completion_time) FROM filled GROUP BY user_id )\
            AND user_id = "{}"\
            AND survey_name = "{}"'.format(user, survey_name)
    cursor.execute(statement)         
    result = cursor.fetchall()
    if len(result) > 0:
        return json.loads(result[0][0])
    else: 
        return None
    


def answer_meets_question_logic(answer, logic, name): 
    if logic == "":  # No conditoin
        return True
    else: 
        elements = logic.split(' ')
        if len(elements) < 2: 
            print("Did you format your logic for {} correctly?".format(name))
        condition = elements[0]
        value = ' '.join(elements[1:])
        if condition == ">=": 
            return float(answer) >= float(value)
        elif condition == "<=": 
            return float(answer) <= float(value)
        elif condition == "<": 
            return float(answer) < float(value)
        elif condition == ">": 
            return float(answer) > float(value)
        elif condition == "=": 
            return answer == value
        
        print("Did you format your logic for {} correctly?".format(name))
        return False

def user_meets_logic(user, logic):
    # list of tables we will parse for info
    tables = logic['tables']
    for table in tables: # Read the relevant data from each table
        if table == "filled": # Survey data
            survey_names = logic['filled']
            for survey_name in survey_names: # Grab specific survey
                # Get survey contents
                survey = get_latest_survey(user, survey_name)
                if survey is not None:
                    # check if user's survey contents meet logic
                    questions = logic[survey_name] 
                    for question in questions: 
                        question_logic = logic[question] # get condition for the question
                        answer = survey[question] # get user's answer to that question
                        res = answer_meets_question_logic(answer, question_logic, question)
                        print("{}: {} --- {} RES {}".format(user, question_logic, answer, res))
                        if not res: # logic not met at any point
                            return False
                else: 
                    return False
        else: # This will be for other types of data (i.e. AWARE)
            return False 
    return True

# Get users
onesignal_ids = getListOfUsersAndOnesignalID()

# Get logic 
logic_files = ["/home/ec2-user/SARATemplate/apis/learning/randomized_notifications/logic1.json", "/home/ec2-user/SARATemplate/apis/learning/randomized_notifications/logic2.json"]

# Execute logic
exclusive = False # user will get only one message
sent_users = []
for i, logic_file in enumerate(logic_files): 
    # read the JSON file
    with open(logic_file) as f:
        logic= json.load(f)

    print("Executing logic {}".format(i))
    # See which users qualify for send
    users_to_send = []
    for user_id in onesignal_ids: 
        user_qualifies = user_meets_logic(user_id, logic)
        if user_qualifies: 
            users_to_send.append(user_id)
    
    print(users_to_send)
    
    # Send notifications
    csv_df = read_s3_csv(logic['csv'])
    for user in users_to_send: 
        if (not exclusive) or (exclusive and user not in sent_users): 
            print("Sending notification {} for {}".format(i, user))
            # Randomly pick from csv
            content = csv_df.iloc[randint(0, csv_df.shape[0] - 1), :] # random notification
            post_body = {
                    "user_id":user,
                    "player_id":onesignal_ids[user],
                    "heading":content['heading'],
                    "body":content['body'],
                    "db_update":content['db_update'],
                    "image":content['image'],
                    }
            print(post_body)
            # Send the message
            r = requests.post('http://ec2-18-205-212-4.compute-1.amazonaws.com:6000/send_message', data = post_body)
            print("received status {} value {}".format(r.status_code, r.text))

            print("\n")
    print("\n\n")
