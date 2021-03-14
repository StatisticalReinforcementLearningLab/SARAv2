"""
Author: Mash
Date: Feb 18, 2021

This script takes a config file for data location in S3 and generates a list of survey responses per user. 
The S3 should contain survey responses. This code can't handle wrong file types.

"""
import subprocess
import json
import csv
import datetime
import pdb
from collections import OrderedDict
import boto3
from prettytable import PrettyTable
from pathlib import Path

# Look at getConfig.py to create config Json file.
from getConfig import ACCESS_KEY, SECRET_KEY
import os


class StudyDataCheck:
    def __init__(self):
        # Use Client to access s3
        self.s3client = boto3.client("s3", region_name="us-east-1",
                                     aws_access_key_id=ACCESS_KEY,
                                     aws_secret_access_key=SECRET_KEY)

        # start a sqlite3 client

    def append_to_file(self, directory, file_name, string_to_write, header_string):
        """
        Appends the string to the filename in the specified directory.

        Fault tolerance: 
        1. This function can create if directory doesn't exist (at least one level)
        2. Create filename if it doesn't exist.

        """

        # make directory if it doesn't exist
        if not os.path.exists(directory):
            os.makedirs(directory)

        # add header to what to write if file doesn't exist
        if not os.path.exists(directory + "/" + file_name):
            #append header to file
            data_to_write = header_string + "\n" + string_to_write
        else:
            data_to_write = string_to_write

        f=open(directory + "/" + file_name, "a+") # plus sign means fille will be created if it doesn't exist
        f.write(data_to_write + "\n")
        f.close()

    def remove_directory(self, dir_name):
        dir_path = Path(dir_name)
        try:
            dir_path.rmdir()
        except OSError as e:
            print("Error: %s : %s" % (dir_path, e.strerror))

    def get_all_s3_objects(self, s3, **base_kwargs):
        continuation_token = None
        while True:
            list_kwargs = dict(MaxKeys=1000, **base_kwargs)
            if continuation_token:
                list_kwargs['ContinuationToken'] = continuation_token
            response = s3.list_objects_v2(**list_kwargs)
            yield from response.get('Contents', [])
            if not response.get('IsTruncated'):  # At the end of the list?
                break
            continuation_token = response.get('NextContinuationToken')



    def reinforcementData(self, bucketId, prefix):
        """
        Takes a bucketId and prefix, and outputs the reinforcement data.
        TODO: make the headers input to the function.
        """

        # remove directory
        dir_name = "data/reinforcement"
        self.remove_directory(dir_name)

        header = ["userName", "date", "day_count", "Prob", "isRandomized", "reward",
            "reward_img_link", "Like", "unix_ts", "readable_ts", "appVersion"]

        reinforcementPrettyTable = PrettyTable()
        reinforcementPrettyTable.field_names = header

        # get_last_modified = lambda obj: int(obj['LastModified'].strftime('%s'))
        def get_last_modified(obj): return obj['LastModified'].timetuple()

        #resp = self.s3client.list_objects_v2(Bucket=bucketId, Prefix=prefix)
        #objS3 = resp['Contents']
        #pdb.set_trace()
        #sortedS3DataModified = [obj['Key'] for obj in sorted(
        #    objS3, key=get_last_modified, reverse=True)]

        objS3 = []
        for file in self.get_all_s3_objects(self.s3client, Bucket=bucketId, Prefix=prefix):
            objS3.append(file)
        sortedS3DataModified = [obj['Key'] for obj in sorted(
            objS3, key=get_last_modified, reverse=True)]

        numberOfFilesProcessed = 0
        TOTAL_NUMBER_OF_RECORDS_TO_DISPLAY = 70

        print('\n\n\n\n==========================================================================')
        print("Reinforcement data for AYA")
        print("Number of file processing: " +
              str(len(sortedS3DataModified)))
        print('==========================================================================')

        # pdb.set_trace()

        for filename in sortedS3DataModified:

            if("result" in filename):

                json_obj = self.s3client.get_object(
                    Bucket=bucketId, Key=filename)
                json_data = json_obj['Body'].read().decode('utf-8')
                # print(json_data)
                each_json = json.loads(json_data)

                # modify the the deviceInfo
                if "userName" not in each_json:
                    numberOfFilesProcessed = numberOfFilesProcessed + 1
                    continue

                ordered = OrderedDict((key, each_json.get(key))
                                      for key in header)

                header_string = ','.join(header)
                user_name = each_json["userName"]
                if (user_name.startswith('caregiver') or user_name.startswith('Caregiver') or user_name.startswith('AYA') or user_name.startswith('aya')) :
                    # save to appropriate file
                    data_m = [str(data_point).replace(",", " ").strip() for data_point in ordered.values()]
                    data_m = ','.join(data_m)
                    self.append_to_file(dir_name, user_name + ".csv", data_m, header_string)
                    print(str(numberOfFilesProcessed+1) + " of " + str(len(sortedS3DataModified)) + ": is username, " + user_name + ", date: " + each_json["readable_ts"])  
                else:
                    print(str(numberOfFilesProcessed+1) + " of " + str(len(sortedS3DataModified))) 

                numberOfFilesProcessed = numberOfFilesProcessed + 1

        print('\n')
        print(reinforcementPrettyTable)
        print('\n\n\n\n')



if __name__ == "__main__":
    studyDataCheck = StudyDataCheck()
        
    current_time = datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d %I:%M:%S%p %Z")
    print("Generated on:  " + current_time + "\n\n\n\n")

    # survey data check
    # studyDataCheck.surveyDataCheckAYA('chop-sara', 'alex_survey_aya/')

    # studyDataCheck.surveyDataCheckCG('chop-sara', 'alex_survey_caregiver/')

    # reinforcement data check
    studyDataCheck.reinforcementData('chop-sara', 'reinforcement_data/')