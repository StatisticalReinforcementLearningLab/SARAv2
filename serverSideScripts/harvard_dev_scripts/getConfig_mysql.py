import json
import io

# Open the JSON File and create a StringIO buffer to hold data

with open('./mysql_config.json', 'r') as datafile:

	# Load data into json file
	config = json.load(datafile)

	# Build json strong
	DB_PASSWORD = config['DB_PASSWORD']


