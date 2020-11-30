import mysql.connector as mysql
from datetime import datetime
import pandas as pd

from GenericParserInterface import GenericParserInterface

# To use decrypt.js, need to install package in the same folder as
# decrypt.js in Command Prompt: npm install crypto-js


class SleepAppUsageParser(GenericParserInterface):

    def __init__(self):
        pass
    
    # "./config/awareSqlConfig.json"
    def fetch_raw_data(self, db_config_location, user_id, start_unix_time, end_unix_time):
        """Function to fetch raw data. Returns an array of latest data."""
        aware_db = self.connect_to_database(db_config_location)
        cursor = aware_db.cursor()

        #-- fetch screen usage data
        where_clause = "device_id='" + user_id + "'"
        where_clause = where_clause + " AND timestamp > " + str(start_unix_time) 
        where_clause = where_clause + " AND timestamp < " + str(end_unix_time) 
        where_clause = "(" + where_clause +  ")"
        cursor.execute("SELECT * FROM screen where " + where_clause + " order by timestamp asc;")
        records_in_screen_usage_table = cursor.fetchall()

        #--
        # initialize variables
        date_string_for_app_usage_list = ["null" for i in range(len(records_in_screen_usage_table))]
        timestamp_for_app_usage_list = [0 for i in range(len(records_in_screen_usage_table))]
        screen_time_value_list = [0 for i in range(len(records_in_screen_usage_table))]

        for row in records_in_screen_usage_table:
            ts = row[1]/1000 - 7*60*60 #convert to pacific timezone. ToDo: change fixed value.
            timestamp_for_app_usage_list.append(ts)
            
            datetime_ts = datetime.utcfromtimestamp(ts) 
            date_string_for_app_usage_list.append(datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p'))
            screen_time_value_list.append(row[3])

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


    def store_processed_data(self, app_usage_data_frame):
        """Gets the preprocessed data array and store into another array for storage"""
        pass

    def post_parsing_cleanup(self, arg):
        """Cleans up any data after parsing finishes"""
        pass


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