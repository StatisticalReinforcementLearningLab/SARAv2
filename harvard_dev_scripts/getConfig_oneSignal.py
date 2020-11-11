import json
import io
import os
# Open the JSON File and create a StringIO buffer to hold data
def adjustPathForServerVsLocal(fileName):
    if os.path.exists(fileName): #if true then we are running locally.
        return './'+fileName
    else: #server side crontab, so we are appending full directory path.
        return os.path.join('/home/ec2-user/HarvardDevEC2/MySARAv2-harvard-chloe-issue-163' \
				'/serverSideScripts/harvard_dev_scripts/' + fileName)
print(adjustPathForServerVsLocal('onesignal_config.json'))
with open(adjustPathForServerVsLocal('onesignal_config.json'), 'r') as datafile:

	# Load data into json file
	config = json.load(datafile)

	# Build json strong
	AUTHORIZATION_ID = config['AUTHORIZATION_ID']
	ONE_SIGNAL_APP_ID = config['ONE_SIGNAL_APP_ID']
	IMAGE_LOCATION = config['IMAGE_LOCATION']


