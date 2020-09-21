import json
import io

# Open the JSON File and create a StringIO buffer to hold data

with open('./aws_config.json', 'r') as datafile:

	# Load data into json file
	config = json.load(datafile)

	# Build json strong
	AWS_ACCESS_KEY = config['AWS_ACCESS_KEY']
	AWS_SECRET_KEY = config['AWS_SECRET_KEY']
	AWS_REGION_NAME = config['AWS_REGION_NAME']


