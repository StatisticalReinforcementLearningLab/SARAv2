
# To use decrypt.js, need to install package in the same folder as
# decrypt.js in Command Prompt: npm install crypto-js

import json
import csv
import boto3
import subprocess
from collections import OrderedDict

#Look at getConfig.py to create config Json file.
from getConfig import ACCESS_KEY, SECRET_KEY

#print(ACCESS_KEY)
#print(SECRET_KEY)

#Use Client to access s3 
client = boto3.client("s3", region_name = "us-east-1",
                           aws_access_key_id=ACCESS_KEY,
                           aws_secret_access_key=SECRET_KEY)

# open a file for writing
cvs_data = open('./survey_caregiver.csv', 'w', newline='')

# create the csv writer object

csvwriter = csv.writer(cvs_data)

header=["userName","Q1","Q2","Q3","Q4",
        "starttimeUTC","reponse_ts","endtimeUTC","ts","devicInfo","appVersion"]

csvwriter.writerow(header)

key_order=["userName","Q1p","Q7d","Q9d","Q10",
           "starttimeUTC","reponse_ts","endtimeUTC","ts","devicInfo","appVersion"]

#count = 0

resp = client.list_objects_v2(Bucket='chop-sara',Prefix='alex_survey_caregiver/')

# get_last_modified = lambda obj: int(obj['LastModified'].strftime('%s'))
get_last_modified = lambda obj: obj['LastModified'].timetuple()
objS3 = resp['Contents']
sortedS3DataModified = [obj['Key'] for obj in sorted(objS3, key=get_last_modified, reverse=True)]

for filename in sortedS3DataModified:
    print("Inside loop: %s" %filename)
    if("result" in filename) :
        json_obj = client.get_object(Bucket='chop-sara', Key=filename)   
        json_data = json_obj['Body'].read().decode('utf-8')
        #print("printing json_data")
        #print(json_data)
        #print(type(json_data))
        each_json=json.loads(json_data)
        #print("json loaded data")
        #print(each_json)
        #print(type(each_json))

        #get encrypted obj and try to decrypt it.
        try:
            encrypted_data = each_json['encrypted']
            decrypted_data = subprocess.check_output(["node", "decrypt.js", encrypted_data])
            decrypted_json = json.loads(decrypted_data)
            print(json.dumps(decrypted_json, indent=4, sort_keys=True))        
            #modify the the deviceInfo
            decrypted_json["devicInfo"] = decrypted_json["devicInfo"][0]

            #for each_result in cvs_data:   #loop this over each json file instead.
            if "Q1" in decrypted_json:
                ordered = OrderedDict((key, decrypted_json.get(key)) for key in header)
            else:
                ordered = OrderedDict((key, decrypted_json.get(key)) for key in key_order)
            csvwriter.writerow(ordered.values())

##            if count == 0:
##                header = decrypted_json.keys()
##                csvwriter.writerow(header)
##                count += 1
##            csvwriter.writerow(decrypted_json.values())
            
        except:
            print("encrypted error:")        
cvs_data.close()









