#
# Created by Mash, Nov 16, 2020
#

import json
import mysql.connector as mysql
import pdb
from datetime import datetime
import pandas as pd
import boto3
import os
import altair as alt

from .SingleVisualizationInterface import SingleVisualizationInterface

def main():
    # initialize visualization
    mood_visualization = MoodVisualization()

    #fetch mood data
    mood_time_series_df = mood_visualization.generate_time_series_for_plot(
        { "config_file_name": "./config/mysql_config.json", 
          "database_name" : "HarvardDev",
          "userid" : "mash_aya" }
    )

    #
    mood_visualization.store_time_series_to_s3(
        { "s3_config_file_name": "./config/aws_config.json", 
          "mood_time_series_data" : mood_time_series_df,
          "userid" : "mash_aya" }
    )

    #
    mood_visualization.store_visualization_to_s3(
        { "s3_config_file_name": "./config/aws_config.json", 
          "mood_time_series_df" : mood_time_series_df,
          "userid" : "mash_aya" }
    )




class MoodVisualization(SingleVisualizationInterface):

    def __init__(self):
        self.name = "Mood visualization" # give a name to this visualization
        self.description = "Uses Russel's Affect Grid to show a scatter plot for last 30-days" # give a description to this visualization
    

    def get_visualization_description(self):
        """
        return an object with a description of the visualization.
        """
        return {
            "name":  self.name,
            "description":  self.description
        }

    def generate_time_series_for_plot(self, arguments = {}):
        """
        return an pandas time series data frame that will be used for plotting.
        """
        print("Generating time series for mood")

        db = self.connect_to_database(arguments["config_file_name"], arguments["database_name"])
        arousal_array, valenence_array, ts_array = self.get_mood(db, arguments["userid"])

        #create a time series
        
        #-- convert to pandas dataframe, with time based indexing
        datetime_ts_string = ['null'] * len(ts_array)
        for i in range(len(ts_array)):
            ts =  ts_array[i]["ts"]/1000 - 7*60*60 # TODO: correct 7 for day light saving
            datetime_ts = datetime.utcfromtimestamp(ts) 
            datetime_ts_string[i] = datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p')

        mood_time_series_data = {
            'timestamp': datetime_ts_string,
            'arousal': arousal_array,
            'valence': valenence_array,   
        }

        mood_time_series_data = pd.DataFrame(mood_time_series_data, columns = ['timestamp', 'arousal', 'valence']) 
        mood_time_series_data['timestamp'] = pd.to_datetime(mood_time_series_data['timestamp'], format='%Y-%m-%d %I:%M:%S %p')

        return mood_time_series_data


    def store_visualization_to_s3(self, arguments):
        """
        created altair plot file from timeseries and saves to s3 with todays date.
        """
        print("Storing mood plot to S3")

        mood_time_series_df = arguments["mood_time_series_df"]

        # color scheme for all plots 
        # https://htmlcolorcodes.com/color-picker/
        background_col = 'aliceblue'
        title_col = '#004B99'
        mark_col = '#99004B'
        background_text_col = '#4B9900'

        chart = alt.Chart(mood_time_series_df, title="Mood this month").mark_circle(size=60,color=mark_col).encode(
            x=alt.X('arousal',title='Negative \u21e8 Positive', scale=alt.Scale(domain=[-5, 5])), #change the axis title
            y=alt.Y('valence',title='Sleepy \u21e8 Alert', scale=alt.Scale(domain=[-5, 5])), #have to use unicode symbols; \u21e8 is thick right arrow
        )

        #put text on background
        watermark1 = alt.Chart(pd.DataFrame([1])).mark_text(
            align='left', dx=-180, dy=-180, fontSize=20, text='Stress', color=background_text_col
        ).encode(
            opacity=alt.value(0.5)
        )
        watermark2 = alt.Chart(pd.DataFrame([1])).mark_text(
            align='right', dx=180, dy=-180, fontSize=20, text='Excitement', color=background_text_col
        ).encode(
            opacity=alt.value(0.5)
        )
        watermark3 = alt.Chart(pd.DataFrame([1])).mark_text(
            align='left', dx=-180, dy=180, fontSize=20, text='Depressed', color=background_text_col
        ).encode(
            opacity=alt.value(0.5)
        )
        watermark4 = alt.Chart(pd.DataFrame([1])).mark_text(
            align='right', dx=180, dy=180, fontSize=20, text='Relaxed', color=background_text_col
        ).encode(
            opacity=alt.value(0.5)
        )

        #combine plot and background text
        final_chart = alt.layer(chart,watermark1,watermark2,watermark3,watermark4).configure(background=background_col).configure_axis(
            titleFontSize=15,titleColor=title_col).configure_title(fontSize=25,color=title_col).properties(width=400,height=400)

        line_x_0 = alt.Chart(pd.DataFrame({'x': [0]})).mark_rule().encode(x='x', size=alt.value(1))
        line_y_0 = alt.Chart(pd.DataFrame({'y': [0]})).mark_rule().encode(y='y', size=alt.value(1))
        line_x_5 = alt.Chart(pd.DataFrame({'x': [5]})).mark_rule().encode(x='x', size=alt.value(0.5))
        line_y_5 = alt.Chart(pd.DataFrame({'y': [5]})).mark_rule().encode(y='y', size=alt.value(0.5))

        final_chart = final_chart + line_x_0 + line_y_0 + line_x_5 + line_y_5

        final_chart.save("plot.html")

        todays_date = datetime.now().strftime("%m%d%Y")
        s3_connect_object = self.get_S3_config_from_json(arguments["s3_config_file_name"])
        client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 
        key = "saraaltair_plots/" + todays_date + "/" + arguments["userid"] + "_" + todays_date + "_mood.html"
        client.upload_file("plot.html", 'sara-dev-data-storage',  "saraaltair_plots/" + todays_date + "/" + arguments["userid"] + "_" + todays_date + "_mood.html")

        # more here
        # https://stackoverflow.com/questions/55991996/altair-rotate-text-by-value-specified-in-feature

        return key, final_chart


    def store_time_series_to_s3(self, arguments = {}):
        """
        created pkl file from timeseries and saves to s3 with todays date.
        """
        print("Storing mood time series to S3")

        #
        mood_time_series_data = arguments["mood_time_series_data"]

        # put hds file in directory
        mood_time_series_data.to_pickle("./mood_data.pkl")

        todays_date = datetime.now().strftime("%m%d%Y")
        s3_connect_object = self.get_S3_config_from_json(arguments["s3_config_file_name"])
        client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY'])
        key = "sara_timeseries_for_plots/" + todays_date + "/" + arguments["userid"] + "_" + todays_date + "_mood.pkl"
        client.upload_file("./mood_data.pkl", 'sara-dev-data-storage',  key) 

        os.remove("./mood_data.pkl")

        return key



    #============================================================================
    #
    # Helper functions
    #
    #============================================================================

    def get_mood(self, db, username = 'mash_aya', num_days = 60):
        """
        creates a time serioes of mood values 
        """

        cursor = db.cursor()
        sql_command = "SELECT when_inserted, json_answer, survey_completion_time FROM harvardSurvey " 
        sql_command = sql_command + "where user_id=\""+username +"\" and when_inserted > NOW() - INTERVAL " + str(num_days) + " DAY "
        sql_command =  sql_command + " order by survey_completion_time desc;"
        # print(sql_command)

        cursor.execute(sql_command)
        returnedData = cursor.fetchall()
        mood1=[]
        mood2=[]
        ts = []
        for row in returnedData:
            date = row[0]
            row_json=json.loads(row[1])
            try:

                
                if len(row_json['QMood'].split(":")) < 2:
                    continue
                mood1.append(float(row_json['QMood'].split(":")[0]))
                mood2.append(float(row_json['QMood'].split(":")[1])  + 5) # correction that was mistake in the real code.
                ts.append({"ts": int(row[2])})
            except:
                # print(str(date) + " no mood")
                pass
        
        # print(str(len(mood1)) + ", " + str(len(mood2)) + ", " + str(len(ts)))
        return mood1, mood2,  ts

    def connect_to_database(self, mysql_config_file, db_name):
        """
        Connects to sql database. Returns a db object.
        """
        
        with open(mysql_config_file) as f:
            mysql_connect_object = json.load(f)

        # mysqlConnectObject = getSqlConfigFromJSON('./saraSqlConfig.json')

        db = mysql.connect(
            host = mysql_connect_object["DB_HOST"],
            port = mysql_connect_object["DB_PORT"],
            user = mysql_connect_object["DB_USER"],
            passwd = mysql_connect_object["DB_PASSWORD"],
            database = db_name # "HarvardDev"
        )
            
        return db


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
