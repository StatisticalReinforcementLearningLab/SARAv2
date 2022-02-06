#
# Created by Mash, Nov 15, 2020
#

import boto3
import json
import subprocess
import pdb
import time
import mysql.connector as mysql
from datetime import datetime
import uuid
import pkg_resources
from .GenericParserInterface import GenericParserInterface

# To use decrypt.js, need to install package in the same folder as
# decrypt.js in Command Prompt: npm install crypto-js


class SurveyParser(GenericParserInterface):
    def __init__(self, database, survey_name):
        self.surveyName = survey_name
        self.database = database
        self.sql_config_file = pkg_resources.resource_filename('sara', 'config/mysql_config.json')
        self.aws_config_file = pkg_resources.resource_filename('sara', 'config/aws_config.json')

    def fetch_raw_data(self, data_location):
        """Function to fetch raw data. Decrypts the encrypted data. Returns an array of latest survey data as a JSON array. 
            - data_location: string, name of s3 bucket where evening survey data uploaded
        """
        print("Fetching evening survey data")

        #Use Client to access s3 
        client = self.create_boto_client()

        # read a list of objects (i.e., filenames) from S3
        bucket_name = data_location["bucket_name"]
        directory = data_location["directory"]

        raw_survey_data_list = []
         
        resp = client.list_objects_v2(Bucket=bucket_name,Prefix=directory)
        # print(json.dumps(resp, indent=4, sort_keys=True))

        if 'Contents' in resp: # if there is no survey to parse then 'Contents' is absent in resp.
            processed_file_count = 1
            for obj in resp['Contents']:
                filename = obj['Key']
                print("   Fetching file, {} of {}: {}".format(processed_file_count, len(resp['Contents']), filename))
                processed_file_count = processed_file_count + 1

                if("result" in filename) :
                    # read JSON from the S3 file.
                    s3_data_object = client.get_object(Bucket=bucket_name, Key=filename) 
                    encrypted_survey_data_string = s3_data_object['Body'].read().decode('utf-8')

                    raw_survey_data_list.append(encrypted_survey_data_string)
                else:
                    print("Strangely named file %s was not moved." %filename)

        return raw_survey_data_list


    
    def process_raw_data(self, raw_survey_array):
        """Gets the raw data array and preprocess into another array for storage"""

        # This version of the parser decrypts the encrypted array
        print("Processing evening survey data")
        processed_survey_data_list = []
        processed_survey_count = 1

        for raw_survey_json in raw_survey_array:
            print("   Processing surveys, {} of {}".format(processed_survey_count, len(raw_survey_array)))
            encrypted_survey_data_string = raw_survey_json
            encrypted_survey_data_json=json.loads(encrypted_survey_data_string)
            #get encrypted obj and decrypt it.
            encrypted_survey_data_json = encrypted_survey_data_json['encrypted']
            decrypt_file = pkg_resources.resource_filename('sara', 'node/decrypt.js')
            decrypted_survey_data_json = subprocess.check_output(["/home/ec2-user/sara/bin/node", decrypt_file, encrypted_survey_data_json])
            decrypted_survey_data_json = json.loads(decrypted_survey_data_json.decode('utf-8'))
            processed_survey_data_list.append(decrypted_survey_data_json)

            processed_survey_count = processed_survey_count + 1

        return processed_survey_data_list
        

    def store_processed_data(self, processed_survey_array):
        """Gets the preprocessed data array and store into another array for storage"""

        print("Storing evening survey data")
        stored_survey_count = 1

        for processed_survey_json in processed_survey_array:
            self.insert_data_into_mysql(processed_survey_json)
            
            print("   Storing surveys, {} of {}".format(stored_survey_count, len(processed_survey_array)))
            stored_survey_count = stored_survey_count + 1


    def post_parsing_cleanup(self, args):
        """
        Cleans up any data after parsing finishes.
        Copies surveys from S3 src directory to dest directory.
        """

        print("Commencing post processing cleanup")

        source_s3_directory = args["source_s3_directory"]
        destination_s3_directory = args["destination_s3_directory"]
        bucket_name = args["bucket_name"]

        self.move_all_data(bucket_name, source_s3_directory, destination_s3_directory)


    def create_boto_client(self):
        """
        Returns a boto3 client created using the credentials above.
        """
        s3_connect_object = self.get_S3_config_from_json()
        return boto3.client("s3", region_name = s3_connect_object["AWS_REGION_NAME"],
                                aws_access_key_id= s3_connect_object["AWS_ACCESS_KEY"],
                                aws_secret_access_key= s3_connect_object["AWS_SECRET_KEY"])

    def get_S3_config_from_json(self):
        """
        Loads full S3 connect object . Format of the JSON object 
        is the following:
            {
                "AWS_ACCESS_KEY":"AKIASR52SY45PVC",
                "AWS_SECRET_KEY":"6sbt6OV/Ovv0Ch0x1eW",
                "AWS_REGION_NAME":"us-east-1"
            }  
        """
        with open(self.aws_config_file) as f:
            s3_connect_object = json.load(f)
            
        return s3_connect_object

    def insert_data_into_mysql(self, survey_data):
        """
        Inserts user survey data into the mysql database.
        - payload: a dictionary with username, survey endtime, and the answers to survey questions
        to all of the questions
        """
        # connect to db
        db = self.connect_to_database()
        cursor = db.cursor()

        # removing keys and inserting separately into table
        userID = survey_data.pop('userName')
        completionTime = str(survey_data.pop('endtimeUTC'))
        whenIntertedTs = time.time()
        whenInsertedReadableTs = datetime.utcfromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')

        # to ensure idempotency of onesignal
        responseUUID = str(uuid.uuid4())

        insertStmt = (
            "INSERT INTO filled (user_id, survey_completion_time, json_answer, when_inserted, response_id, survey_name) "
            "VALUES (%s, %s, %s, %s, %s, %s)"
        )
        data = (userID, completionTime, json.dumps(survey_data), whenInsertedReadableTs, responseUUID, self.surveyName)
        cursor.execute(insertStmt, data)
        db.commit()

    def connect_to_database(self):
        """
        Connects to sql database. Returns a db object.
        """

        with open(self.sql_config_file) as f:
            mysql_connect_object = json.load(f)
            
        return mysql.connect(
            host = mysql_connect_object["DB_HOST"],
            port = mysql_connect_object["DB_PORT"],
            user = mysql_connect_object["DB_USER"],
            passwd = mysql_connect_object["DB_PASSWORD"],
            database = self.database
        )

    def create_boto_resource(self):
        """
        Returns a boto3 resource created using the credentials above.
        """
        s3_connect_object = self.get_S3_config_from_json()
        return boto3.resource("s3", region_name = s3_connect_object["AWS_REGION_NAME"],
                                aws_access_key_id= s3_connect_object["AWS_ACCESS_KEY"],
                                aws_secret_access_key= s3_connect_object["AWS_SECRET_KEY"])

    def move_data_point(self, bucketName, sourceDirectory, destDirectory, filename):
        """
        Move a datapoint from sourceDirectory to destDirectory in AWS s3 bucket. Deletes
        the data in the original directory.
        - bucketName: string, name of AWS s3 bucket we are operating within
        - sourceDirectory: string, folder name where surveys are originally stored
        - destDirectory: string, folder name to which to transfer the survey data
        - filename: string, name of survey data entry
        """
        s3 = self.create_boto_resource()
        print("Moving {} from {} to {}.".format(filename, sourceDirectory, destDirectory))
        copySource = {
            "Bucket": bucketName,
            'Key': sourceDirectory + filename
        }
        s3.Object(bucketName, destDirectory + filename).copy_from(CopySource=copySource)
        s3.Object(bucketName, sourceDirectory + filename).delete()

    def move_all_data(self, bucketName, sourceDirectory, destDirectory):
        """
        Moves all of the data from sourceDirectory into destDirectory.
        within the AWS s3 bucket.
        - bucketName: string, name of AWS s3 bucket we are operating within
        - sourceDirectory: string, folder name where surveys are originally stored
        - destDirectory: string, folder name to which to transfer the survey data
        """
        print("Moving all contents of {} to {}.".format(sourceDirectory, destDirectory))
        client = self.create_boto_client() 
        # read a list of objects (i.e., filenames) from S3
        resp = client.list_objects_v2(Bucket=bucketName,Prefix=sourceDirectory)

        if 'Contents' in resp: # if there is no survey to parse then 'Contents' is absent in resp.
            for obj in resp['Contents'][1:]:
                filename = obj['Key'].split("/")[-1]
                self.move_data_point(bucketName, sourceDirectory, destDirectory, filename)

