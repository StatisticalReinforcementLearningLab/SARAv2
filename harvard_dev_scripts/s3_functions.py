#
# Created by Mash, Aug 1, 2020
#

# To use decrypt.js, need to install package in the same folder as
# decrypt.js in Command Prompt: npm install crypto-js
import os
import json
import csv
import boto3
import subprocess
from collections import OrderedDict
from mysql_functions import (insertDataIntoHarvardSurvey,
    getQuestionDataFromHarvardSurvey, clearAllHarvardSurvey , 
    getUsernamesFromHarvardSurvey, getPlayerId)

#Look at getConfig.py to create config Json file.
from getConfig_aws import AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION_NAME

def createBotoClient():
    """
    Returns a boto3 client created using the credentials above.
    """
    return boto3.client("s3", region_name = AWS_REGION_NAME,
                               aws_access_key_id=AWS_ACCESS_KEY,
                               aws_secret_access_key=AWS_SECRET_KEY)

def createBotoResource():
    """
    Returns a boto3 resource created using the credentials above.
    """
    return boto3.resource("s3", region_name = AWS_REGION_NAME,
                               aws_access_key_id=AWS_ACCESS_KEY,
                               aws_secret_access_key=AWS_SECRET_KEY)

def moveDatapoint(bucketName, sourceDirectory, destDirectory, filename):
    """
    Move a datapoint from sourceDirectory to destDirectory in AWS s3 bucket. Deletes
    the data in the original directory.
    - bucketName: string, name of AWS s3 bucket we are operating within
    - sourceDirectory: string, folder name where surveys are originally stored
    - destDirectory: string, folder name to which to transfer the survey data
    - filename: string, name of survey data entry
    """
    s3 = createBotoResource()
    print("Moving {} from {} to {}.".format(filename, sourceDirectory, destDirectory))
    copySource = {
        "Bucket": bucketName,
        'Key': sourceDirectory + filename
    }
    s3.Object(bucketName, destDirectory + filename).copy_from(CopySource=copySource)
    s3.Object(bucketName, sourceDirectory + filename).delete()

def moveAllData(bucketName, sourceDirectory, destDirectory):
    """
    Moves all of the data from sourceDirectory into destDirectory.
    within the AWS s3 bucket.
    - bucketName: string, name of AWS s3 bucket we are operating within
    - sourceDirectory: string, folder name where surveys are originally stored
    - destDirectory: string, folder name to which to transfer the survey data
    """
    print("Moving all contents of {} to {}.".format(sourceDirectory, destDirectory))
    client = createBotoClient()
    # read a list of objects (i.e., filenames) from S3
    resp = client.list_objects_v2(Bucket=bucketName,Prefix=sourceDirectory)

    for obj in resp['Contents']:
        filename = obj['Key'].split("/")[-1]
        moveDatapoint(bucketName, sourceDirectory, destDirectory, filename)


def adjustPathForServerVsLocal(fileName):
    if os.path.exists(fileName): #if true then we are running locally.
        return './'+fileName
    else: #server side crontab, so we are appending full directory path.
        return os.path.join('/home/ec2-user/HarvardDevEC2/MySARAv2-harvard-chloe-issue-163' \
				'/serverSideScripts/harvard_dev_scripts/' + fileName)

def transferS3Data(bucketName, directory, processedDirectory):
    """
    Transfers survey data from s3 survey collection bucket to sql table.
    Next stage: call this function every 15 minutes
    - directory: string, name of folder where survey data uploaded
    - bucketName: string, name of amazon s3 bucket
    - processedDirectory: string, name of folder in which to store processed survey data
    """
    #Use Client to access s3 
    client = createBotoClient()

    # read a list of objects (i.e., filenames) from S3
    resp = client.list_objects_v2(Bucket=bucketName,Prefix=directory)

    for obj in resp['Contents']:
        filename = obj['Key']
        print("Processing file: %s" %filename)

        if("result" in filename) :

            # read JSON from the S3 file.
            jsonObj = client.get_object(Bucket=bucketName, Key=filename) 
            jsonData = jsonObj['Body'].read().decode('utf-8')
            encryptedSurveyJson=json.loads(jsonData)

            #get encrypted obj and try to decrypt it.
            encryptedData = encryptedSurveyJson['encrypted']
            decryptedData = subprocess.check_output(["node", adjustPathForServerVsLocal('decrypt.js'), encryptedData])
            decryptedJson = json.loads(decryptedData.decode('utf-8'))
            
            #print(json.dumps(decryptedJson, indent=4, sort_keys=True)) #use this line to debug if good JSON file is coming out.

            if "Q4" in decryptedJson: #if decryption goes ok then we should get a JSON key 'Q4'
                
                cleanData = decryptedJson.copy()
                # remove irrelevant keys
                _ = cleanData.pop("onclickTimeForDifferentQuestions")
                _ = cleanData.pop("devicInfo")
                _ = cleanData.pop("surveyStartTimeUTC")
                _ = cleanData.pop("ts")

                insertDataIntoHarvardSurvey(cleanData)

                # move the object into the processed folder
                # and delete from the survey folder
                # later we may want to create subfolders in processed directory
                # so that we can have backups from different timepoints
                name = filename.split("/")[-1]
                moveDatapoint(bucketName, directory, 'harvard_survey_processed/', name)
        else:
            print("Strangely named file was not moved.")


# Testing
if __name__ == '__main__':
    #clearAllHarvardSurvey()
    bucketName = 'sara-dev-data-storage'
    surveyDirectory = 'harvard_survey/'
    processedDirectory = 'harvard_survey_processed/'
    # transferS3Data(bucketName, surveyDirectory, processedDirectory)
    # getQuestionDataFromHarvardSurvey("mash_aya")
    moveAllData(bucketName, processedDirectory, surveyDirectory)
    #one_signal()

    # make sure we've inserted everything properly into the sql database
    # read all existing usernames in mysql 


    # user = 'mash_aya'
    # recent_q4_answer = select_questions_from_mysql(user)
    # print("This is the most recent_answer from {}: {}".format(user, recent_q4_answer))

    # print(getUsernamesFromHarvardSurvey())
    # for user in getUsernamesFromHarvardSurvey():
    #     recent_q4_answer = select_questions_from_mysql(user)
    #     print("This is the most recent_answer from {}: {}".format(user, recent_q4_answer))

    # call Frank's function here with username, time, and q4 response

    # break this up into different functions --> functions should not be more than 10 lines





