import subprocess
import boto3
from datetime import datetime
import mysql.connector as mysql
import os
import json
from sara.parsers.SurveyParser import SurveyParser
import sys


#log in database
def load_database_config():
    config_location = 'mysql_config.json'
    if os.path.isfile(config_location):
        pass
    else:
        config_location = '/home/ec2-user/SARATemplate/sara-python-package/sara/config/' + config_location


    with open(config_location) as f:
        mysql_connect_object = json.load(f)

    return mysql_connect_object

# Command line arguments
if len(sys.argv) != 3: 
    print("Correct usage: python backup_mysql.py <database name> <bucket_name>")
    print("FOR EXAMPLE: python backup_mysql.py study sara-template-data-storage")
database = sys.argv[1]
bucket_name = sys.argv[2]

# Create dumpfile
db_conf = load_database_config() # database config
date_string = datetime.today().strftime('%Y-%m-%d') # current date
filename = '{}-dump.sql'.format(date_string)
with open(filename, 'wb') as output:
    proc = subprocess.Popen(['mysqldump', '-u',db_conf['DB_USER'],'-p{}'.format(db_conf['DB_PASSWORD']), '-P', str(db_conf['DB_PORT']), '-h', 
        db_conf['DB_HOST'], 'study'],stdout=output)

# Upload to s3
parser = SurveyParser('study', 'bleh') # Default database is study
s3 = parser.create_boto_resource()
#s3.Object(bucket_name, filename).put(Body=open(filename, 'rb'))
s3.Bucket(bucket_name).put_object(
        Key='mysql_backups/'+filename,
        Body = open(filename,'rb')
        )

# Delete dumpfile
os.remove(filename)
