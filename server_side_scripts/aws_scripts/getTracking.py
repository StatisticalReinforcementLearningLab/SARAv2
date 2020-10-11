
# To use decrypt.js, need to install package in the same folder as
# decrypt.js in Command Prompt: npm install crypto-js

import json
import csv
import boto3
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

cvs_data = open('./tracks.csv', 'w', newline='')

# create the csv writer object

csvwriter = csv.writer(cvs_data)

count = 0

resp = client.list_objects_v2(Bucket='chop-sara',Prefix='Tracking/')

for obj in resp['Contents']:
    filename = obj['Key']
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
        if 'tracks' in each_json['data']['inserts']:
            tracks_json = each_json['data']['inserts']['tracks']
            for each_result in tracks_json:   
                if count == 0:
                    header = each_result.keys()
                    csvwriter.writerow(header)
                    count += 1
                    key_order = list(header)
                    #print(key_order)
                if count == 1:
                    ordered = OrderedDict((key, each_result.get(key)) for key in key_order)
                    csvwriter.writerow(ordered.values())
                
        
cvs_data.close()









