import json
import io

'''

aws_config.json:

{
    "ACCESS_KEY": "......",
    "SECRET_KEY": "......"
}
'''

# Open the JSON File and create a StringIO buffer to hold data
with open('./aws_config.json', 'r') as datafile:

    # Load data into json file
    config = json.load(datafile)
    
    # Build json strong
    ACCESS_KEY = config['ACCESS_KEY']
    SECRET_KEY = config['SECRET_KEY']

    # print(ACCESS_KEY)
    # print(SECRET_KEY)
