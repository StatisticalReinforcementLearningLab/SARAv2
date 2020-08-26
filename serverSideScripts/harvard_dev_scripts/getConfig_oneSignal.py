import json
import io

# Open the JSON File and create a StringIO buffer to hold data

with open('./onesignal_config.json', 'r') as datafile:

	# Load data into json file
	config = json.load(datafile)

	# Build json strong
	AUTHORIZATION_ID = config['AUTHORIZATION_ID']
	ONE_SIGNAL_APP_ID = config['ONE_SIGNAL_APP_ID']
	IMAGE_LOCATION = config['IMAGE_LOCATION']


