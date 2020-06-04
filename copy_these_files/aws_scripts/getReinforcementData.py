
import json
import csv
import boto3
from collections import OrderedDict

from getConfig import ACCESS_KEY, SECRET_KEY

#print(ACCESS_KEY)
#print(SECRET_KEY)

#Use Client to access s3 
client = boto3.client("s3", region_name = "us-east-1",
                           aws_access_key_id=ACCESS_KEY,
                           aws_secret_access_key=SECRET_KEY)

# open a file for writing
cvs_data = open('./reinforcement_data.csv', 'w', newline='')

# create the csv writer object

csvwriter = csv.writer(cvs_data)

header=["userName","appVersion","Prob","day_count","isRandomized",
        "unix_ts","readable_ts","date","reward","reward_img_link","Like"]
csvwriter.writerow(header)


resp = client.list_objects_v2(Bucket='chop-sara',Prefix='reinforcement_data/')

for obj in resp['Contents']:
    filename = obj['Key']
    print("Inside loop: %s" %filename)
    if("result" in filename) :
        json_obj = client.get_object(Bucket='chop-sara', Key=filename)   
        json_data = json_obj['Body'].read().decode('utf-8')
        #print("printing json_data")
        print(json_data)
        #print(type(json_data))
        each_json=json.loads(json_data)
        #print("json loaded data")
        #print(each_json)
        #print(type(each_json))
        #if "appVersion" in each_json:
        ordered = OrderedDict((key, each_json.get(key)) for key in header)
        csvwriter.writerow(ordered.values())
##        if count == 0:
##            header = each_json.keys()
##            csvwriter.writerow(header)
##            count += 1
##            csvwriter.writerow(each_json.values())
##            key_order = list(header)
##            #print(key_order)
##        if count == 1:
##            ordered = OrderedDict((key, each_json.get(key)) for key in key_order)
##            csvwriter.writerow(ordered.values())

         
cvs_data.close()









