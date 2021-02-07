import mysql.connector as mysql
from datetime import datetime
import pandas as pd
import time
from datetime import date
import json
import pdb
import os

from GenericParserInterface import GenericParserInterface

# To use decrypt.js, need to install package in the same folder as
# decrypt.js in Command Prompt: npm install crypto-js

def main():
    # initialize parser
    sleep_app_usage_parser = SleepAppUsageParser()


    today = datetime.today()
    s = today.strftime("%m/%d/%Y")
    end_unix_time = 1000*time.mktime(datetime.strptime(s + " 02:00 PM", "%m/%d/%Y %I:%M %p").timetuple())
    start_unix_time = end_unix_time - 18*3600*1000
    user_id = "36c38a8d-c6d7-48a7-88a5-5f9796b540b6"
    timezone_offset = -8

    #fetch evening survey data
    date_string_for_app_usage_list, screen_time_value_list = sleep_app_usage_parser.fetch_raw_data(
        './config/awareSqlConfig.json', 
        user_id, 
        start_unix_time, 
        end_unix_time,
        timezone_offset
    )
    
    #
    app_usage_data_frame = sleep_app_usage_parser.process_raw_data(date_string_for_app_usage_list, screen_time_value_list)

    #
    sleep_app_usage_parser.store_processed_data(app_usage_data_frame, user_id)


def parse_all_users_data():


    aware_ids_and_user_ids = get_existing_user_id_and_aware_id()

    for aware_id in aware_ids_and_user_ids:
        # initialize parser
        
        sleep_app_usage_parser = SleepAppUsageParser()

        today = datetime.today()
        s = today.strftime("%m/%d/%Y")
        end_unix_time = 1000*time.mktime(datetime.strptime(s + " 02:00 PM", "%m/%d/%Y %I:%M %p").timetuple())
        start_unix_time = end_unix_time - 18*3600*1000
        # user_id = "36c38a8d-c6d7-48a7-88a5-5f9796b540b6"
        
        user_id = aware_ids_and_user_ids[aware_id]
        print("Processing: "+ user_id + ", " + aware_id)


        timezone_offset = sleep_app_usage_parser.get_timezone_for_user_id(user_id)

        #fetch sleep data
        date_string_for_app_usage_list, screen_time_value_list = sleep_app_usage_parser.fetch_raw_data(
            './config/awareSqlConfig.json', 
            aware_id, 
            start_unix_time, 
            end_unix_time,
            timezone_offset
        )
        
        #
        app_usage_data_frame = sleep_app_usage_parser.process_raw_data(date_string_for_app_usage_list, screen_time_value_list)

        #
        sleep_app_usage_parser.store_processed_data(app_usage_data_frame, aware_id)

        

    
def get_existing_user_id_and_aware_id():
    mysql_config_file = "./config/saraSqlConfig.json"
    
    with open(mysql_config_file) as f:
        mysql_connect_object = json.load(f)
    
    db = mysql.connect(
        host = mysql_connect_object["host"],
        port = mysql_connect_object["port"],
        user = mysql_connect_object["user"],
        passwd = mysql_connect_object["passwd"],
        database = mysql_connect_object["database"]
    )
    
    cursor = db.cursor()
    select_statement = "select username, aware_id from users where aware_id IS NOT NULL;"
    cursor.execute(select_statement)
    aware_id_user_ids = cursor.fetchall()

    aware_ids_and_user_ids = {}
    for x in aware_id_user_ids:
        #print(str(x[1]) + "," + str(x[0]))
        aware_ids_and_user_ids[str(x[1])] = str(x[0])
    
    db.close()
    return aware_ids_and_user_ids


class SleepAppUsageParser(GenericParserInterface):

    def __init__(self):
        pass
    
    # "./config/awareSqlConfig.json"
    def fetch_raw_data(self, db_config_location, aware_id, start_unix_time, end_unix_time, timezone_offset):
        """Function to fetch raw data. Returns an array of latest data."""
        aware_db = self.connect_to_database(db_config_location)
        cursor = aware_db.cursor()

        #-- fetch screen usage data
        where_clause = "device_id='" + aware_id + "'"
        where_clause = where_clause + " AND timestamp > " + str(start_unix_time) 
        where_clause = where_clause + " AND timestamp < " + str(end_unix_time) 
        where_clause = "(" + where_clause +  ")"
        cursor.execute("SELECT * FROM screen where " + where_clause + " order by timestamp asc;")
        records_in_screen_usage_table = cursor.fetchall()

        #--
        # initialize variables
        date_string_for_app_usage_list = [] # ["null" for i in range(len(records_in_screen_usage_table))]
        timestamp_for_app_usage_list = [] #[0 for i in range(len(records_in_screen_usage_table))]
        screen_time_value_list = [] # [0 for i in range(len(records_in_screen_usage_table))]

        
        for row in records_in_screen_usage_table:

            ts = row[1]/1000 + timezone_offset*60*60 #convert to pacific timezone. ToDo: change fixed value.

            timestamp_for_app_usage_list.append(ts)
            
            datetime_ts = datetime.utcfromtimestamp(ts) 
            date_string_for_app_usage_list.append(datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p'))
            screen_time_value_list.append(row[3])

        #
        # pdb.set_trace()
        return date_string_for_app_usage_list, screen_time_value_list
    
    def process_raw_data(self, date_string_for_app_usage_list, screen_time_value_list):
        """Gets the raw data array and preprocess into another array for storage"""
        app_usage_data = {
            'date': date_string_for_app_usage_list,
            'screenTime': screen_time_value_list   
        }
        
        #-- convert to pandas dataframe, with time based indexing
        app_usage_data_frame = pd.DataFrame(app_usage_data, columns = ['date','screenTime']) 
        app_usage_data_frame['date'] = pd.to_datetime(app_usage_data_frame['date'], format='%Y-%m-%d %I:%M:%S %p')
        
        return app_usage_data_frame


    def store_processed_data(self, app_usage_data_frame, user_id):
        """Gets the preprocessed data array and store into another array for storage in S3"""

        print("Storing sleeping data")
        self.insert_data_into_harvard_sleep_db(app_usage_data_frame, "./config/saraSqlConfig.json", user_id)

    def get_timezone_for_user_id(self, user_id):
        mysql_config_file = "./config/saraSqlConfig.json"
        
        with open(mysql_config_file) as f:
            mysql_connect_object = json.load(f)
        
        db = mysql.connect(
            host = mysql_connect_object["host"],
            port = mysql_connect_object["port"],
            user = mysql_connect_object["user"],
            passwd = mysql_connect_object["passwd"],
            database = mysql_connect_object["database"]
        )
        
        cursor = db.cursor()
        
        select_statement = "SELECT * FROM SARAApp.user_ids WHERE (user_id,currentTimeTs) IN  \
                                ( SELECT user_id, MAX(currentTimeTs) \
                                FROM SARAApp.user_ids \
                                GROUP BY user_id \
                                )  AND user_id = " + '"' + user_id + '"'
        
        cursor.execute(select_statement)
        aware_id_user_ids = cursor.fetchone()
        x = aware_id_user_ids
        readable_ts = x[3]
        splitted_parts = readable_ts.split(" ")
        print(str(x[1]) + "," + str(x[3]) + ", " + splitted_parts[-1].split(":")[0])
        
        db.close()
        return int(splitted_parts[-1].split(":")[0])


    def post_parsing_cleanup(self, arg):
        """Cleans up any data after parsing finishes"""
        pass

    def insert_data_into_harvard_sleep_db(self, app_usage_data_frame, mysql_config_file, user_id):
        """
        Inserts user survey data into the mysql database.
        - payload: a dictionary with username, survey endtime, and the answers to survey questions
        to all of the questions
        """
        # print('Inserting data')

        # connect to db
        db = self.connect_to_database(mysql_config_file)
        cursor = db.cursor()

        # removing keys and inserting separately into table
        date_string = date.today().strftime("%Y%m%d")

        # https://www.mysqltutorial.org/python-mysql-blob/
        app_usage_data_frame.to_pickle("./app_usage.pkl")
        app_usage_pickle_data = self.read_file("./app_usage.pkl")

        insertStmt = (
            "INSERT INTO sleep_app_usage (user_id, date, app_usage_data) "
            "VALUES (%s, %s, %s)"
        )
        data = (user_id, date_string, app_usage_pickle_data)
        cursor.execute(insertStmt, data)
        db.commit()

        #
        os.remove("./app_usage.pkl")
        db.close()


    def read_file(self, filename):
        with open(filename, 'rb') as f:
            photo = f.read()
        return photo

    def connect_to_database(self, mysql_config_file):
        """
        Connects to sql database. Returns a db object.
        """

        with open(mysql_config_file) as f:
            mysql_connect_object = json.load(f)
            
        return mysql.connect(
            host = mysql_connect_object["host"],
            port = mysql_connect_object["port"],
            user = mysql_connect_object["user"],
            passwd = mysql_connect_object["passwd"],
            database = mysql_connect_object["database"]
        )




if __name__ == '__main__':
    # main()
    parse_all_users_data()
    