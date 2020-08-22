#
# Created by Mash, Aug 1, 2020
#

# 
# WHAT THIS FILE DO?
# This code goes through a S3 directory that contains encrypted survey data.
# Each S3 file is one survey. 
# Then for each survey, it adds a line in an output CSV file for future analysis.
# 

# To use decrypt.js, need to install package in the same folder as
# decrypt.js in Command Prompt: npm install crypto-js

import json
import csv
import boto3
import subprocess
from collections import OrderedDict
from mysql_functions import (insert_data_into_mysql, select_data_from_mysql,
    select_questions_from_mysql, clear_all_sql, get_usernames)

#Look at getConfig.py to create config Json file.
from getConfig import ACCESS_KEY, SECRET_KEY

#Use Client to access s3 
client = boto3.client("s3", region_name = "us-east-1",
                           aws_access_key_id=ACCESS_KEY,
                           aws_secret_access_key=SECRET_KEY)

# open a file for writing
#cvs_data = open('./survey_sample.csv', 'w', newline='')
# create the csv writer object
#csvwriter = csv.writer(cvs_data)

# Write the header file. 'Q1', 'Q2' has to match the question names in the angular app.
# header=["Q1","Q2","Q3","Q4",
#         "starttimeUTC","reponse_ts","endtimeUTC","userName","ts","devicInfo","appVersion"]
#header=["user_id", "survey_completion_time", "json_answer"]

# If there are 4 questions
#header=["Q1","Q2","Q3","Q4",
#        "starttimeUTC","reponse_ts","endtimeUTC","userName","ts","devicInfo","appVersion"]
#csvwriter.writerow(header)


bucket_name = 'sara-dev-data-storage' #Change this for a different project
s3_directory_location_with_surveys = 'harvard_survey/' #Change this for a different project

# read a list of objects (i.e., filenames) from S3
resp = client.list_objects_v2(Bucket=bucket_name,Prefix=s3_directory_location_with_surveys)

# clear the sql database
clear_all_sql() # figure out a more elegant way to do this
#select_questions_from_mysql()


for obj in resp['Contents']:
    filename = obj['Key']
    print("Processing file: %s" %filename)

    if("result" in filename) :

        # read JSON from the S3 file.
        json_obj = client.get_object(Bucket=bucket_name, Key=filename) 
        json_data = json_obj['Body'].read().decode('utf-8')
        encrypted_survey_json=json.loads(json_data)

        #get encrypted obj and try to decrypt it.
        encrypted_data = encrypted_survey_json['encrypted']
        decrypted_data = subprocess.check_output(["node", "decrypt.js", encrypted_data])
        decrypted_json = json.loads(decrypted_data.decode('utf-8'))
        
        #print(json.dumps(decrypted_json, indent=4, sort_keys=True)) #use this line to debug if good JSON file is coming out.

        if "Q4" in decrypted_json: #if decryption goes ok then we should get a JSON key 'Q4'
            
            clean_data = decrypted_json.copy()
            _ = clean_data.pop("onclickTimeForDifferentQuestions")
            _ = clean_data.pop("devicInfo")
            _ = clean_data.pop("surveyStartTimeUTC")
            _ = clean_data.pop("ts")

            insert_data_into_mysql(clean_data)

# make sure we've inserted everything properly into the sql database
# read all existing usernames in mysql 

user = 'mash_aya'
recent_q4_answer = select_questions_from_mysql(user)
print("This is the most recent_answer from {}: {}".format(user, recent_q4_answer))


# print(get_usernames())
# for user in get_usernames():
#     recent_q4_answer = select_questions_from_mysql(user)
#     print("This is the most recent_answer from {}: {}".format(user, recent_q4_answer))

# call Frank's function here with username, time, and q4 response

# break this up into different functions --> functions should not be more than 10 lines





