#
# Created by Mash, Nov 30, 2020
#

import json
import mysql.connector as mysql
import pdb
from datetime import datetime
import pandas as pd
import boto3
import os
import altair as alt
from datetime import date

from .SingleVisualizationInterface import SingleVisualizationInterface

def main():
    # initialize visualization
    sleep_visualization = SleepVisualization()

    #fetch mood data
    sleep_app_usage_ts_df = sleep_visualization.generate_time_series_for_plot("./config/saraSqlConfig.json", "88315702-a3e6-4296-8437-0a56b4c4f03b")

    if sleep_app_usage_ts_df is not None:
        sleep_visualization.store_visualization_to_s3("./config/aws_config.json", sleep_app_usage_ts_df, "mash_aya")
        sleep_visualization.store_time_series_to_s3("./config/aws_config.json", sleep_app_usage_ts_df, "mash_aya")

    

class SleepVisualization(SingleVisualizationInterface):

    def __init__(self):
        self.name = "Sleep visualization" # a name to this visualization
        self.description = "Shows app usage data between 8pm yesterday to 2pm today." # give a description to this visualization
    
    def get_visualization_description(self):
        """
        return an object with a description of the visualization.
        """
        return {
            "name":  self.name,
            "description":  self.description
        }


    def generate_time_series_for_plot(self, mysql_config_file, user_id):
        """
        return an pandas time series data frame that will be used for plotting.
        """
        # connect to db
        db = self.connect_to_database(mysql_config_file)

        # removing keys and inserting separately into table
        date_string = date.today().strftime("%Y%m%d")

        date_string = "20201130"

        cursor = db.cursor()
        sql_command = "SELECT user_id, app_usage_data, date FROM sleep_app_usage " 
        sql_command = sql_command + "where user_id=\""+ user_id + "\" and date=\"" + date_string + "\" order by id desc limit 1;"
        # print(sql_command)
        cursor.execute(sql_command)

        # https://www.mysqltutorial.org/python-mysql-blob/
        # print(cursor.fetchone())
        myresult = cursor.fetchall()
        for x in myresult:
            app_usage_data_frame_pkl_blob = x[1]
            self.write_file(app_usage_data_frame_pkl_blob, "./app_usage.pkl")
            app_usage_data_frame = pd.read_pickle("./app_usage.pkl")
            os.remove("./app_usage.pkl")
            return app_usage_data_frame
        
        return None
        

    def store_visualization_to_s3(self, s3_config_file_name, sleep_app_usage_ts_df, user_id):
        chart = alt.Chart(sleep_app_usage_ts_df).mark_circle(size=60).encode(
            x='date:T',
            y={"field": 'screenTime', "type": "quantitative", "scale": {"domain": [1.5,3.5]}}
        )

        chart.save("plot.html")

        todays_date = datetime.now().strftime("%m%d%Y")
        s3_connect_object = self.get_S3_config_from_json(s3_config_file_name)
        client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 
        client.upload_file("plot.html", 'sara-dev-data-storage',  "saraaltair_plots/" + todays_date + "/" + user_id + "_" + todays_date + "_sleep_app_usage.html")

        return chart

    def store_time_series_to_s3(self, s3_config_file_name, sleep_app_usage_ts_df, user_id):
        """
        return an pandas time series data frame that will be used for plotting.
        """

        # put hds file in directory
        sleep_app_usage_ts_df.to_pickle("./sleep_app_usage.pkl")

        todays_date = datetime.now().strftime("%m%d%Y")
        s3_connect_object = self.get_S3_config_from_json(s3_config_file_name)
        client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 
        client.upload_file("./sleep_app_usage.pkl", 'sara-dev-data-storage',  "sara_timeseries_for_plots/" + todays_date + "/" + user_id + "_" + todays_date + "_sleep_app_usage.pkl") 

        os.remove("./sleep_app_usage.pkl")



    def write_file(self, data, filename):
        with open(filename, 'wb') as f:
            f.write(data)

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
            database = mysql_connect_object["database"],
            raw=True # needed for reading blob data.
        )

    def get_S3_config_from_json(self, config_file_name):
        """
        Loads full S3 connect object . Format of the JSON object 
        is the following:
        
            {
                "AWS_ACCESS_KEY":"AKIASR52SY45PVC",
                "AWS_SECRET_KEY":"6sbt6OV/Ovv0Ch0x1eW",
                "AWS_REGION_NAME":"us-east-1"
            }  

        """
        with open(config_file_name) as f:
            s3_connect_object = json.load(f)
            
        return s3_connect_object


if __name__ == '__main__':
    main()
