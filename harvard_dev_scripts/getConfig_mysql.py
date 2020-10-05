import json
import io
import os
# Open the JSON File and create a StringIO buffer to hold data

def adjustPathForServerVsLocal(fileName):
    if os.path.exists(fileName): #if true then we are running locally.
        return './'+fileName
    else: #server side crontab, so we are appending full directory path.
        return os.path.join('/home/ec2-user/HarvardDevEC2/SARAv2-harvard-chloe-issue-163' \
				'/serverSideScripts/harvard_dev_scripts/' + fileName)
print(adjustPathForServerVsLocal('mysql_config.json'))
with open(adjustPathForServerVsLocal('mysql_config.json'), 'r') as datafile:

	# Load data into json file
	config = json.load(datafile)

	# Build json strong
	DB_PASSWORD = config['DB_PASSWORD']
	DB_HOST = config["DB_HOST"]
	DB_PORT = config["DB_PORT"]
	DB_USER = config["DB_USER"]
