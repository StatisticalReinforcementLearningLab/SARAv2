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
from getConfig import ACCESS_KEY, SECRET_KEY

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
        self.s3client = boto3.client("s3", region_name="us-east-1",
                                     aws_access_key_id=ACCESS_KEY,
                                     aws_secret_access_key=SECRET_KEY)

        # start a sqlite3 client

    def surveyDataCheckAYA(self, bucketId, prefix):
        """
        Takes a bucketId and prefix, and outputs the survey.

        TODO: make the headers input to the function.
        """

        resp = self.s3client.list_objects_v2(Bucket=bucketId, Prefix=prefix)

        # header=["Q1","Q2","Q3","Q4","Q5","Q6","Q7","Q8","Q9","Q10","Q11",
        #                "starttimeUTC","reponse_ts","endtimeUTC","userName","ts","devicInfo","appVersion"]

        header = ["userName", "ts", "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8",
            "Q9", "Q10", "Q11", "starttimeUTC", "endtimeUTC", "devicInfo", "appVersion"]
                       # "starttimeUTC","reponse_ts","endtimeUTC","userName","ts","devicInfo","appVersion"]

        # key_order=["Q1d","Q2d","Q3d","Q4d","Q5d","Q6d","Q7d","Q11","Q8d","Q9d","Q10",
        #                "starttimeUTC","reponse_ts","endtimeUTC","userName","ts","devicInfo","appVersion"]
        key_order = ["userName", "ts", "Q1d", "Q2d", "Q3d", "Q4d", "Q5d", "Q6d", "Q7d",
            "Q11", "Q8d", "Q9d", "Q10", "starttimeUTC", "endtimeUTC", "devicInfo", "appVersion"]

        surveyPrettyTable = PrettyTable()
        surveyPrettyTable.field_names = header

        # get_last_modified = lambda obj: int(obj['LastModified'].strftime('%s'))
        def get_last_modified(obj): return obj['LastModified'].timetuple()
        objS3 = resp['Contents']
        sortedS3DataModified = [obj['Key'] for obj in sorted(
            objS3, key=get_last_modified, reverse=True)]

        numberOfFilesProcessed = 0
        TOTAL_NUMBER_OF_RECORDS_TO_DISPLAY = 50

        print('\n\n\n\n==========================================================================')
        print("Survey data for AYA")
        print("Number of file processing: " +
              str(TOTAL_NUMBER_OF_RECORDS_TO_DISPLAY))
        print('==========================================================================')

        for filename in sortedS3DataModified:

            if("result" in filename):

                # print("Processing file #" + str(numberOfFilesProcessed) + ": " + filename)
                print(str(numberOfFilesProcessed+1)),

                json_obj = self.s3client.get_object(
                    Bucket=bucketId, Key=filename)
                json_data = json_obj['Body'].read().decode('utf-8')
                each_json = json.loads(json_data)

                # get encrypted obj and try to decrypt it.
                try:
                    encrypted_data = each_json['encrypted']
                    decrypted_data = subprocess.check_output(
                        ["node", "decrypt.js", encrypted_data])
                    decrypted_json = json.loads(decrypted_data)

                    # modify the the deviceInfo
                    decrypted_json["devicInfo"] = decrypted_json["devicInfo"][0]

                    # --- Pretty print
                    # print(json.dumps(decrypted_json, indent=4, sort_keys=True))

                    # ordered list of data.
                    if "Q1" in decrypted_json:
                        ordered = OrderedDict(
                            (key, decrypted_json.get(key)) for key in header)
                    else:  # <---- older version
                        ordered = OrderedDict(
                            (key, decrypted_json.get(key)) for key in key_order)

                    # print([str(data_point).strip().encode('ascii', 'ignore') for data_point in ordered.values()])
                    surveyPrettyTable.add_row([str(data_point).strip().encode(
                        'ascii', 'ignore') for data_point in ordered.values()])

                    numberOfFilesProcessed = numberOfFilesProcessed + 1
                    if numberOfFilesProcessed == TOTAL_NUMBER_OF_RECORDS_TO_DISPLAY:
                        break

                except:
                    pass
                    # print("Unexpected error:", sys.exc_info()[0])

        print('\n')
        print(surveyPrettyTable)
        print('\n\n\n\n')

    def surveyDataCheckCG(self, bucketId, prefix):
        """
        Takes a bucketId and prefix, and outputs the survey.

        TODO: make the headers input to the function.
        """

        resp = self.s3client.list_objects_v2(Bucket=bucketId, Prefix=prefix)

        # header=["Q1","Q2","Q3","Q4","Q5","Q6","Q7","Q8","Q9","Q10","Q11",
        #                "starttimeUTC","reponse_ts","endtimeUTC","userName","ts","devicInfo","appVersion"]

        header = ["userName", "ts", "Q1", "Q2", "Q3", "Q4",
            "starttimeUTC", "endtimeUTC", "devicInfo", "appVersion"]
                       # "starttimeUTC","reponse_ts","endtimeUTC","userName","ts","devicInfo","appVersion"]

        # key_order=["Q1d","Q2d","Q3d","Q4d","Q5d","Q6d","Q7d","Q11","Q8d","Q9d","Q10",
        #                "starttimeUTC","reponse_ts","endtimeUTC","userName","ts","devicInfo","appVersion"]
        key_order = ["userName", "ts", "Q1p", "Q7d", "Q9d", "Q10",
            "starttimeUTC", "endtimeUTC", "devicInfo", "appVersion"]

        surveyPrettyTable = PrettyTable()
        surveyPrettyTable.field_names = header

        # get_last_modified = lambda obj: int(obj['LastModified'].strftime('%s'))
        def get_last_modified(obj): return obj['LastModified'].timetuple()
        objS3 = resp['Contents']
        sortedS3DataModified = [obj['Key'] for obj in sorted(
            objS3, key=get_last_modified, reverse=True)]

        numberOfFilesProcessed = 0
        TOTAL_NUMBER_OF_RECORDS_TO_DISPLAY = 50

        print('\n\n\n\n==========================================================================')
        print("Survey data for Caregivers")
        print("Number of file processing: " +
              str(TOTAL_NUMBER_OF_RECORDS_TO_DISPLAY))
        print('==========================================================================')

        for filename in sortedS3DataModified:

            if("result" in filename):

                # print("Processing file #" + str(numberOfFilesProcessed) + ": " + filename)
                print(str(numberOfFilesProcessed+1)),

                json_obj = self.s3client.get_object(
                    Bucket=bucketId, Key=filename)
                json_data = json_obj['Body'].read().decode('utf-8')
                each_json = json.loads(json_data)

                # get encrypted obj and try to decrypt it.
                try:
                    encrypted_data = each_json['encrypted']
                    decrypted_data = subprocess.check_output(
                        ["node", "decrypt.js", encrypted_data])
                    decrypted_json = json.loads(decrypted_data)

                    # modify the the deviceInfo
                    decrypted_json["devicInfo"] = decrypted_json["devicInfo"][0]

                    # --- Pretty print
                    # print(json.dumps(decrypted_json, indent=4, sort_keys=True))

                    # ordered list of data.
                    if "Q1" in decrypted_json:
                        ordered = OrderedDict(
                            (key, decrypted_json.get(key)) for key in header)
                    else:  # <---- older version
                        ordered = OrderedDict(
                            (key, decrypted_json.get(key)) for key in key_order)

                    # print([str(data_point).strip().encode('ascii', 'ignore') for data_point in ordered.values()])
                    surveyPrettyTable.add_row([str(data_point).strip().encode(
                        'ascii', 'ignore') for data_point in ordered.values()])

                    numberOfFilesProcessed = numberOfFilesProcessed + 1
                    if numberOfFilesProcessed == TOTAL_NUMBER_OF_RECORDS_TO_DISPLAY:
                        break

                except:
                    pass
                    #print("Unexpected error:", sys.exc_info()[0])

        print('\n')
        print(surveyPrettyTable)
        print('\n\n\n\n')

    def reinforcementRandomizationCheck(self, bucketId, prefix):
        """
        Takes a bucketId and prefix, and outputs the reinforcement data.

        TODO: make the headers input to the function.
        """

        resp = self.s3client.list_objects_v2(Bucket=bucketId, Prefix=prefix)

        header = ["userName", "date", "day_count", "Prob", "isRandomized", "reward",
            "reward_img_link", "Like", "unix_ts", "readable_ts", "appVersion"]

        reinforcementPrettyTable = PrettyTable()
        reinforcementPrettyTable.field_names = header

        # get_last_modified = lambda obj: int(obj['LastModified'].strftime('%s'))
        def get_last_modified(obj): return obj['LastModified'].timetuple()
        objS3 = resp['Contents']
        sortedS3DataModified = [obj['Key'] for obj in sorted(
            objS3, key=get_last_modified, reverse=True)]

        numberOfFilesProcessed = 0
        TOTAL_NUMBER_OF_RECORDS_TO_DISPLAY = 70

        print('\n\n\n\n==========================================================================')
        print("Reinforcement data for AYA")
        print("Number of file processing: " +
              str(TOTAL_NUMBER_OF_RECORDS_TO_DISPLAY))
        print('==========================================================================')

        for filename in sortedS3DataModified:

            if("result" in filename):

                # print("Processing file #" + str(numberOfFilesProcessed) + ": " + filename)
                print(str(numberOfFilesProcessed+1)),

                json_obj = self.s3client.get_object(
                    Bucket=bucketId, Key=filename)
                json_data = json_obj['Body'].read().decode('utf-8')
                # print(json_data)
                each_json = json.loads(json_data)

                # modify the the deviceInfo
                if "userName" not in each_json:
                    numberOfFilesProcessed = numberOfFilesProcessed + 1
                    if numberOfFilesProcessed == TOTAL_NUMBER_OF_RECORDS_TO_DISPLAY:
                        break
                    continue

                ordered = OrderedDict((key, each_json.get(key))
                                      for key in header)

                # print([str(data_point).strip().encode('ascii', 'ignore') for data_point in ordered.values()])
                reinforcementPrettyTable.add_row([str(data_point).strip().encode(
                    'ascii', 'ignore') for data_point in ordered.values()])

                numberOfFilesProcessed = numberOfFilesProcessed + 1
                if numberOfFilesProcessed == TOTAL_NUMBER_OF_RECORDS_TO_DISPLAY:
                    break

        print('\n')
        print(reinforcementPrettyTable)
        print('\n\n\n\n')

    def appUsageCheck(self, bucketId, prefix):
        """
        Takes a bucketId and prefix, and outputs the app usage.

        TODO: make the headers input to the function.
        """

        resp = self.s3client.list_objects_v2(Bucket=bucketId, Prefix=prefix)
        isHeader = True

        # get_last_modified = lambda obj: int(obj['LastModified'].strftime('%s'))
        def get_last_modified(obj): return obj['LastModified'].timetuple()
        objS3 = resp['Contents']
        sortedS3DataModified = [obj['Key'] for obj in sorted(
            objS3, key=get_last_modified, reverse=True)]

        numberOfFilesProcessed = 0
        TOTAL_NUMBER_OF_RECORDS_TO_DISPLAY = 100

        print('\n\n\n\n==========================================================================')
        print("App usage data ")
        print("Number of file processing: " +
              str(TOTAL_NUMBER_OF_RECORDS_TO_DISPLAY))
        print(
            '==========================================================================\n')

        for filename in sortedS3DataModified:
            # print("Processing file: %s" %filename)
            if("result" in filename):

                print(str(numberOfFilesProcessed+1)),

                json_obj = self.s3client.get_object(
                    Bucket=bucketId, Key=filename)
                json_data = json_obj['Body'].read().decode('utf-8')
                each_json = json.loads(json_data)

                if 'tracks' in each_json['data']['inserts']:
                    tracks_json = each_json['data']['inserts']['tracks']
                    for each_result in tracks_json:
                        if isHeader == True:
                            header = each_result.keys()
                            isHeader = False
                            key_order = list(header)

                        ordered = OrderedDict(
                            (key, each_result.get(key)) for key in key_order)
                        print(ordered.values())

                    numberOfFilesProcessed = numberOfFilesProcessed + 1
                    if numberOfFilesProcessed == TOTAL_NUMBER_OF_RECORDS_TO_DISPLAY:
                        break
        print('\n\n\n\n')

    def notification4PMCheck(self):
        """
        Gets 4PM notification data and like/dislike. Comes from a database.

        TODO: make the headers input to the function.
        """

        print('\n\n\n\n==========================================================================')
        print("4PM notification assignment")
        print(
            '==========================================================================\n')

        db = mysql.connect(
            host=HOST,
            port=PORT,
            user=USERNAME,
            passwd=PASSWORD,
            database=DATABASE
        )

        cursor = db.cursor()
        cursor.execute("SELECT user_id, date, whenSentReadableTs, author_image, author_name, quote_text, is_sent, randomization_pron FROM 4PMNotifications order by whenSentTs DESC limit 50;")
        result = cursor.fetchall()

        header = ["user_id", "date", "whenSentReadableTs", "author_image",
            "author_name", "quote_text", "is_sent", "randomization_prob"]

        notification4PMPrettyTable = PrettyTable()
        notification4PMPrettyTable.field_names = header

        for notification4PMRecord in result:
            is_sent = notification4PMRecord[6]
            # if is_sent == 1:
            x = [notification4PMRecord[0], notification4PMRecord[1], notification4PMRecord[2], notification4PMRecord[3],
                notification4PMRecord[4], notification4PMRecord[5], notification4PMRecord[6], notification4PMRecord[7]]
            # else:
            # x = [notification4PMRecord[0], notification4PMRecord[1], notification4PMRecord[2], notification4PMRecord[3], notification4PMRecord[4], notification4PMRecord[5], notification4PMRecord[6], notification4PMRecord[7]]
            # print(x)
            notification4PMPrettyTable.add_row(
                [str(data_point).strip().encode('ascii', 'ignore') for data_point in x])

        print('\n')
        print(notification4PMPrettyTable)
        print('\n\n\n\n')

        print('\n\n\n\n==========================================================================')
        print("4PM notification receipts")
        print(
            '==========================================================================\n')

        db = mysql.connect(
            host=HOST,
            port=PORT,
            user=USERNAME,
            passwd=PASSWORD,
            database=DATABASE
        )

        cursor = db.cursor()
        cursor.execute("SELECT PARTICIAPANT_ID, DATE, whenReceivedReadableTs, whenActedonReadableTs, typeOfAction, device_type FROM SARA_Notifications where typeOfNotification = '4:00PM' order by whenReceivedTs DESC limit 50;")
        result = cursor.fetchall()

        header = ["userName", "date", "whenReceivedReadableTs",
            "whenActedonReadableTs", "typeOfAction", "device_type"]

        notification4PMPrettyTable = PrettyTable()
        notification4PMPrettyTable.field_names = header

        for notification4PMRecord in result:
            x = [notification4PMRecord[0], notification4PMRecord[1], notification4PMRecord[2],
                notification4PMRecord[3], notification4PMRecord[4], notification4PMRecord[5]]
            # print(x)
            notification4PMPrettyTable.add_row(
                [str(data_point).strip().encode('ascii', 'ignore') for data_point in x])

        print('\n')
        print(notification4PMPrettyTable)
        print('\n\n\n\n')

        


    def lastSurveyCompleted(self):
        print('\n\n\n\n==========================================================================')
        print("Last survey completed record")
        print('==========================================================================\n')

        db = mysql.connect(
            host=HOST,
            port=PORT,
            user=USERNAME,
            passwd=PASSWORD,
            database=DATABASE
        )

        cursor = db.cursor()
        cursor.execute("SELECT * FROM survey_completed WHERE (user_id,whenCompletedTs) \
                        IN  ( SELECT user_id, MAX(whenCompletedTs) FROM survey_completed  \
                            GROUP BY user_id \
                            ) order by whenCompletedTs desc")
        result = cursor.fetchall()

        header = ["id","user_id", "dateString", "whenCompleteTs",
            "whenCompletedReadableTs"]

        surveyCompletePrettyTable = PrettyTable()
        surveyCompletePrettyTable.field_names = header

        for surveyCompletedRecord in result:
            x = [surveyCompletedRecord[0], surveyCompletedRecord[1], surveyCompletedRecord[2], 
                    surveyCompletedRecord[3], surveyCompletedRecord[4]]
                # print(x)
            surveyCompletePrettyTable.add_row(
                    [str(data_point).strip().encode('ascii', 'ignore') for data_point in x])

        print('\n')
        print(surveyCompletePrettyTable)
        print('\n\n\n\n')

    def lastAppAccess(self):
        print('\n\n\n\n==========================================================================')
        print("Last app access record")
        print('==========================================================================\n')

        db = mysql.connect(
            host=HOST,
            port=PORT,
            user=USERNAME,
            passwd=PASSWORD,
            database=DATABASE
        )

        cursor = db.cursor()
        cursor.execute("SELECT * FROM user_ids WHERE (user_id,currentTimeTs) IN  \
                            ( SELECT user_id, MAX(currentTimeTs) \
                            FROM user_ids \
                            GROUP BY user_id \
                            ) order by currentTimeTs desc")
        result = cursor.fetchall()

        header = ["id","user_id", "whenAccessedTs","whenAccessedReadableTs","oneSignalId"]

        lastAccessedPrettyTable = PrettyTable()
        lastAccessedPrettyTable.field_names = header

        for lastAccessedRecord in result:
            x = [lastAccessedRecord[0], lastAccessedRecord[1], lastAccessedRecord[3], 
                    lastAccessedRecord[4], lastAccessedRecord[2]]
                # print(x)
            lastAccessedPrettyTable.add_row(
                    [str(data_point).strip().encode('ascii', 'ignore') for data_point in x])

        print('\n')
        print(lastAccessedPrettyTable)
        print('\n\n\n\n')


    def notification8PMRecord(self):
        print('\n\n\n\n==========================================================================')
        print("8PM sent record")
        print('==========================================================================\n')

        db = mysql.connect(
            host=HOST,
            port=PORT,
            user=USERNAME,
            passwd=PASSWORD,
            database=DATABASE
        )

        cursor = db.cursor()
        cursor.execute("SELECT * FROM 8PMNotificationTable order by currentTimeTsUTC desc;")
        result = cursor.fetchall()

        header = ["id","user_id", "lastSurveyCompleted","when8AMIsSentInUsersTimeZone", "when8AMIsSentInGMT"]

        notification8PMPrettyTable = PrettyTable()
        notification8PMPrettyTable.field_names = header

        for notification8PMRecord in result:
            x = [notification8PMRecord[0], notification8PMRecord[1], notification8PMRecord[2], notification8PMRecord[3], notification8PMRecord[5]]
            # print(x)
            notification8PMPrettyTable.add_row(
                    [str(data_point).strip().encode('ascii', 'ignore') for data_point in x])

        print('\n')
        print(notification8PMPrettyTable)
        print('\n\n\n\n')

if __name__ == "__main__":
    studyDataCheck = StudyDataCheck()
    
    
    current_time = datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d %I:%M:%S%p %Z")
    print("Generated on:  " + current_time + "\n\n\n\n")

    # survey data check
    # studyDataCheck.surveyDataCheck('chop-sara', 'alex_survey_aya/')
    studyDataCheck.surveyDataCheckAYA('chop-sara', 'alex_survey_aya/')

    studyDataCheck.surveyDataCheckCG('chop-sara', 'alex_survey_caregiver/')

    # reinforcement data check
    studyDataCheck.reinforcementRandomizationCheck('chop-sara', 'reinforcement_data/')

    # 4PM notification list
    studyDataCheck.notification4PMCheck()

    # last survey completed
    studyDataCheck.lastSurveyCompleted()

    #
    studyDataCheck.lastAppAccess()

    #
    studyDataCheck.notification8PMRecord()

    # last access

    # app usage tracking
    studyDataCheck.appUsageCheck('chop-sara', 'Tracking/')
