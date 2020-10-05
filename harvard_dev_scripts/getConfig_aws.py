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
print(adjustPathForServerVsLocal('aws_config.json'))
with open(adjustPathForServerVsLocal('aws_config.json'), 'r') as datafile:

	# Load data into json file
	config = json.load(datafile)

	# Build json strong
	AWS_ACCESS_KEY = config['AWS_ACCESS_KEY']
	AWS_SECRET_KEY = config['AWS_SECRET_KEY']
	AWS_REGION_NAME = config['AWS_REGION_NAME']


