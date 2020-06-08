# To use decrypt.js, need to install package in the same folder as
# decrypt.js in Command Prompt: npm install crypto-js

import json
import csv
import boto3
import subprocess
from collections import OrderedDict

#Look at getConfig.py to create config Json file.
from getConfig import ACCESS_KEY, SECRET_KEY

class StudyDataCheck:
    def __init__(self):
        #Use Client to access s3 
        self.s3client = boto3.client("s3", region_name = "us-east-1",
                                aws_access_key_id=ACCESS_KEY,
                                aws_secret_access_key=SECRET_KEY)

        # start a sqlite3 client

        


    def surveyDataCheck(self, bucketId, prefix):
        """
        Takes a bucketId and prefix, and outputs the survey.

        TODO: make the headers input to the function.
        """

        resp = self.s3client.list_objects_v2(Bucket=bucketId,Prefix=prefix)


        #header=["Q1","Q2","Q3","Q4","Q5","Q6","Q7","Q8","Q9","Q10","Q11",
        #                "starttimeUTC","reponse_ts","endtimeUTC","userName","ts","devicInfo","appVersion"]

        header=["Q1","Q2","Q3","Q4","Q5","Q6","Q7","Q8","Q9","Q10","Q11",
                        "starttimeUTC","reponse_ts","endtimeUTC","userName","ts","devicInfo","appVersion"]

        key_order=["Q1d","Q2d","Q3d","Q4d","Q5d","Q6d","Q7d","Q11","Q8d","Q9d","Q10",
                        "starttimeUTC","reponse_ts","endtimeUTC","userName","ts","devicInfo","appVersion"]

        get_last_modified = lambda obj: int(obj['LastModified'].strftime('%s'))
        objS3 = resp['Contents']
        sortedS3DataModified = [obj['Key'] for obj in sorted(objS3, key=get_last_modified, reverse=True)]


        for filename in sortedS3DataModified: 

            if("result" in filename) :
                json_obj = self.s3client.get_object(Bucket=bucketId, Key=filename)   
                json_data = json_obj['Body'].read().decode('utf-8')
                each_json=json.loads(json_data)

                #get encrypted obj and try to decrypt it.
                try:
                    encrypted_data = each_json['encrypted']
                    decrypted_data = subprocess.check_output(["node", "decrypt.js", encrypted_data])
                    decrypted_json = json.loads(decrypted_data)

                    #--- Pretty print    
                    # print(json.dumps(decrypted_json, indent=4, sort_keys=True))        
                    
                    
                    #ordered list of data.
                    if "Q1" in decrypted_json:
                        ordered = OrderedDict((key, decrypted_json.get(key)) for key in header)
                    else:
                        ordered = OrderedDict((key, decrypted_json.get(key)) for key in key_order)

                    print(ordered.values())

                except:
                    print("encrypted error:")

        



    def reinforcementRandomizationCheck(self, bucketId, prefix):
        """
        Takes a bucketId and prefix, and outputs the reinforcement data.

        TODO: make the headers input to the function.
        """

        resp = self.s3client.list_objects_v2(Bucket= bucketId, Prefix=prefix)

        header=["userName","appVersion","Prob","day_count","isRandomized",
                "unix_ts","readable_ts","date","reward","reward_img_link","Like/Dislike"]


        for obj in resp['Contents']:
            filename = obj['Key']
            print("Processing file: %s" %filename)
            if("result" in filename) :
                json_obj = self.s3client.get_object(Bucket=bucketId, Key=filename)   
                json_data = json_obj['Body'].read().decode('utf-8')
                print(json_data)
                each_json=json.loads(json_data)
                ordered = OrderedDict((key, each_json.get(key)) for key in header)

                print(ordered.values())


    def appUsageCheck(self, bucketId, prefix):
        """
        Takes a bucketId and prefix, and outputs the app usage.

        TODO: make the headers input to the function.
        """

        resp = self.s3client.list_objects_v2(Bucket= bucketId, Prefix=prefix)
        isHeader = True

        for obj in resp['Contents']:
            filename = obj['Key']
            print("Processing file: %s" %filename)
            if("result" in filename) :
                json_obj = self.s3client.get_object(Bucket=bucketId, Key=filename)  
                json_data = json_obj['Body'].read().decode('utf-8')
                each_json=json.loads(json_data)

                if 'tracks' in each_json['data']['inserts']:
                    tracks_json = each_json['data']['inserts']['tracks']
                    for each_result in tracks_json:   
                        if isHeader == True:
                            header = each_result.keys()
                            isHeader = False
                            key_order = list(header)
                            
                        ordered = OrderedDict((key, each_result.get(key)) for key in key_order)
                        print(ordered.values())
    
    

if __name__ == "__main__":
    studyDataCheck = StudyDataCheck()

    # survey data check
    studyDataCheck.surveyDataCheck('chop-sara', 'alex_survey_aya/')

    # reinforcement data check
    # studyDataCheck.reinforcementRandomizationCheck('chop-sara', 'reinforcement_data/')

    #app usage tracking
    # studyDataCheck.appUsageCheck('chop-sara', 'Tracking/')


