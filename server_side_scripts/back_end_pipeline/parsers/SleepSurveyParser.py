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
import os.path

from EveningSurveyParser import EveningSurveyParser

# To use decrypt.js, need to install package in the same folder as
# decrypt.js in Command Prompt: npm install crypto-js


class SleepSurveyParser(EveningSurveyParser):
    def __init__(self):
        pass

    

if __name__ == '__main__':
    bucketName = 'sara-dev-data-storage'
    surveyDirectory = 'sleep_survey/'
    processedDirectory = 'sleep_survey_processed/'

    # initialize parser
    sleep_survey_parser = SleepSurveyParser()

    #fetch evening survey data
    raw_survey_data_list = sleep_survey_parser.fetch_raw_data({"bucket_name": 'sara-dev-data-storage', "directory": surveyDirectory})

    # process evening survey data
    processed_survey_data_list = sleep_survey_parser.process_raw_data(raw_survey_data_list)

    # process evening survey data
    sleep_survey_parser.store_processed_data(processed_survey_data_list)

    sleep_survey_parser.post_parsing_cleanup({"bucket_name": bucketName, "source_s3_directory": surveyDirectory, "destination_s3_directory": processedDirectory})



    

    