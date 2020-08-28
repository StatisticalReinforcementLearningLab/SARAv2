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
from mysql_functions import (insert_data_into_mysql, select_all_data,
    get_question_data, clear_all_sql, get_usernames, get_player_id)

#Look at getConfig.py to create config Json file.
from getConfig_aws import AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION_NAME

def create_boto_client():
    """
    Returns a boto3 client created using the credentials above.
    """
    return boto3.client("s3", region_name = AWS_REGION_NAME,
                               aws_access_key_id=AWS_ACCESS_KEY,
                               aws_secret_access_key=AWS_SECRET_KEY)

def create_boto_resource():
    """
    Returns a boto3 resource created using the credentials above.
    """
    return boto3.resource("s3", region_name = AWS_REGION_NAME,
                               aws_access_key_id=AWS_ACCESS_KEY,
                               aws_secret_access_key=AWS_SECRET_KEY)

def move_datapoint(bucket_name, source_directory, dest_directory, filename):
    """
    Move a datapoint from source_directory to dest_directory in AWS s3 bucket. Deletes
    the data in the original directory.
    - bucket_name: string, name of AWS s3 bucket we are operating within
    - source_directory: string, folder name where surveys are originally stored
    - dest_directory: string, folder name to which to transfer the survey data
    - filename: string, name of survey data entry
    """
    s3 = create_boto_resource()
    print("Moving {} from {} to {}.".format(filename, source_directory, dest_directory))
    copy_source = {
        "Bucket": bucket_name,
        'Key': source_directory + filename
    }
    s3.Object(bucket_name, dest_directory + filename).copy_from(CopySource=copy_source)
    s3.Object(bucket_name, source_directory + filename).delete()

def move_all_data(bucket_name, source_directory, dest_directory):
    """
    Moves all of the data from source_directory into dest_directory.
    within the AWS s3 bucket.
    - bucket_name: string, name of AWS s3 bucket we are operating within
    - source_directory: string, folder name where surveys are originally stored
    - dest_directory: string, folder name to which to transfer the survey data
    """
    print("Moving all contents of {} to {}.".format(source_directory, dest_directory))
    client = create_boto_client()
    # read a list of objects (i.e., filenames) from S3
    resp = client.list_objects_v2(Bucket=bucket_name,Prefix=source_directory)

    for obj in resp['Contents']:
        filename = obj['Key'].split("/")[-1]
        move_datapoint(bucket_name, source_directory, dest_directory, filename)

def transfer_s3_data(bucket_name, directory, processed_directory):
    """
    Transfers survey data from s3 survey collection bucket to sql table.
    Next stage: call this function every 15 minutes
    - directory: string, name of folder where survey data uploaded
    - bucket_name: string, name of amazon s3 bucket
    - processed_directory: string, name of folder in which to store processed survey data
    """
    #Use Client to access s3 
    client = create_boto_client()

    # read a list of objects (i.e., filenames) from S3
    resp = client.list_objects_v2(Bucket=bucket_name,Prefix=directory)

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
                # remove irrelevant keys
                _ = clean_data.pop("onclickTimeForDifferentQuestions")
                _ = clean_data.pop("devicInfo")
                _ = clean_data.pop("surveyStartTimeUTC")
                _ = clean_data.pop("ts")

                insert_data_into_mysql(clean_data)

                # move the object into the processed folder
                # and delete from the survey folder
                # later we may want to create subfolders in processed directory
                # so that we can have backups from different timepoints
                name = filename.split("/")[-1]
                move_datapoint(bucket_name, directory, 'harvard_survey_processed/', name)


# Testing
if __name__ == '__main__':
    #clear_all_sql()
    bucketName = 'sara-dev-data-storage'
    surveyDirectory = 'harvard_survey/'
    processedDirectory = 'harvard_survey_processed/'
    # transfer_s3_data(bucketName, surveyDirectory, processedDirectory)
    # get_question_data("mash_aya")
    move_all_data(bucketName, processedDirectory, surveyDirectory)
    #one_signal()

# make sure we've inserted everything properly into the sql database
# read all existing usernames in mysql 


# user = 'mash_aya'
# recent_q4_answer = select_questions_from_mysql(user)
# print("This is the most recent_answer from {}: {}".format(user, recent_q4_answer))

# print(get_usernames())
# for user in get_usernames():
#     recent_q4_answer = select_questions_from_mysql(user)
#     print("This is the most recent_answer from {}: {}".format(user, recent_q4_answer))

# call Frank's function here with username, time, and q4 response

# break this up into different functions --> functions should not be more than 10 lines





