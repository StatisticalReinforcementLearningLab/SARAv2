import json
import mysql.connector as mysql
from datetime import datetime
from datetime import timedelta
import pandas as pd
import altair as alt
import os
from altair_saver import save
import boto3

from SingleVisualizationInterface import SingleVisualizationInterface

def main():
    # initialize visualization
    good_visualization = GoodVisualization()

    #fetch concentration data
    good_time_series_df = good_visualization.generate_time_series_for_plot(
        { "config_file_name": "./config/mysql_config.json", 
          "database_name" : "HarvardDev",
          "userid" : "mash_aya" }
    )


    """
    good_visualization.store_time_series_to_s3(
        { "s3_config_file_name": "./config/aws_config.json", 
          "good_time_series_data" : good_time_series_df,
          "userid" : "mash_aya" }
    )
    """
    
    good_visualization.store_visualization_to_s3(
        { "s3_config_file_name": "./config/aws_config.json", 
          "good_time_series_df" : good_time_series_df,
          "userid" : "mash_aya" }
    )


def generate_plot_for_everyone():
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


    # removing keys and inserting separately into table
    cursor = db.cursor()
    sql_command = "SELECT DISTINCT username from users;" 

    cursor.execute(sql_command)
    unique_ids_data = cursor.fetchall()
    for x in unique_ids_data:
        username = str(x[0])

        print("Generating plot for " + username)

        # initialize visualization
        good_visualization = GoodVisualization()

        #fetch mood data
        good_time_series_df = good_visualization.generate_time_series_for_plot(
            { "config_file_name": "./config/mysql_config.json", 
            "database_name" : "HarvardDev",
            "userid" : username }
        )

        # skip creating plots if there is no data.
        if len(good_time_series_df) == 0:
            print("No data for " + username)
            continue

        #
        good_visualization.store_time_series_to_s3(
            { "s3_config_file_name": "./config/aws_config.json", 
            "good_time_series_data" : good_time_series_df,
            "userid" : username }
        )

        #
        good_visualization.store_visualization_to_s3(
            { "s3_config_file_name": "./config/aws_config.json", 
            "good_time_series_df" : good_time_series_df,
            "userid" : username }
        )
        
    db.close()
    pass
    

class GoodVisualization(SingleVisualizationInterface):
   
    def __init__(self):
        self.name = "Good Day visualization" # give a name to this visualization
        self.description = "Colored box chart of resposponse to 'Will I have a good day tomorrow?'"
        
    
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
        print("Generating time series for 'Will I have a good day?'")

        db = self.connect_to_database(arguments["config_file_name"], arguments["database_name"])
        good_array, ts_array = self.get_good(db, arguments["userid"])

        #create a time series
        
        #-- convert to pandas dataframe, with time based indexing
        #Sarah -- this did not work for me; dates appear to be alread in correct form?
        """
        datetime_ts_string = ['null'] * len(ts_array)
        for i in range(len(ts_array)):
            ts =  ts_array[i]["ts"]/1000 - 7*60*60 # TODO: https://harvard.zoom.us/j/6628628546  correct 7 for day light saving   #this didn't work for me
            datetime_ts = datetime.utcfromtimestamp(ts) 
            datetime_ts_string[i] = datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p')
        """

        good_time_series_data = {
            #'timestamp': datetime_ts_string,
            'timestamp': ts_array,
            'good_day': good_array,
        }

        good_time_series_data = pd.DataFrame(good_time_series_data, columns = ['timestamp', 'good_day'])     
        good_time_series_data = good_time_series_data.drop_duplicates(subset='timestamp',keep="last")      
        return good_time_series_data
    
    
    def store_visualization_to_s3(self, arguments,num_days=30):
        """
        created altair plot file from timeseries and saves to s3 with todays date.
        """
        print("Storing good day plot to S3")
        
        good_time_series_df = arguments["good_time_series_df"]
        
        good_time_series_df['good_day']=good_time_series_df['good_day'].replace(' yes','Yes')
        good_time_series_df['good_day']=good_time_series_df['good_day'].replace(' no','No')
        print(good_time_series_df)
              
        
        # color scheme for all plots 
        # https://htmlcolorcodes.com/color-picker/
        background_col = 'aliceblue'
        title_col = '#004B99'
        mark_col = '#99004B'
        background_text_col = '#4B9900'
        
        all_dates =pd.date_range(datetime.now() - timedelta(num_days),datetime.now()).strftime('%m-%d-%Y')
        
        chart = alt.Chart(good_time_series_df, title = 'Response to "Will I Have a Good Day Tomorrow?"').mark_rect().encode(
        x=alt.X('timestamp',title='Date'),
        y=alt.Y(field='good_day',type='nominal',impute=alt.ImputeParams(value=None,keyvals=all_dates.values), sort=alt.EncodingSortField(field='good_day',order='descending'),title='Good Day Tomorrow'),
        color = alt.Color('good_day', legend = None, scale = alt.Scale(
                domain=['Yes', 'No'],
                range=['green', '#99004B']))
        ).properties(width=400,height=200).configure(background=background_col).configure_title(
        fontSize=25,color=title_col).configure_axis(
        titleFontSize=15,titleColor=title_col,labelAngle=45)
       
        # print("saving plot")
        chart.save("plot.html")

        #commented out for sarah testing
        """
        todays_date = datetime.now().strftime("%m%d%Y")
        s3_connect_object = self.get_S3_config_from_json(arguments["s3_config_file_name"])
        client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 
        client.upload_file("plot.html", 'sara-dev-data-storage',  "saraaltair_plots/" + todays_date + "/" + arguments["userid"] + "_" + todays_date + "_good_day.html")
        """

        todays_date = datetime.now().strftime("%m%d%Y")
        s3_connect_object = self.get_S3_config_from_json(arguments["s3_config_file_name"])
        client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 
        client.upload_file("plot.html", 'sara-dev-data-storage',  "saraaltair_plots/" + todays_date + "/" + arguments["userid"] + "_" + todays_date + "_good_day.html")

        chart.save("plot.json")
        client.upload_file("plot.json", 'sara-dev-data-storage',  "saraaltair_plots/" + todays_date + "/" + arguments["userid"] + "_" + todays_date + "_good_day.json")

        # save as svg
        # pip install altair_saver
        save(chart, "plot.png") 
        client.upload_file("plot.png", 'sara-dev-data-storage',  "saraaltair_plots/" + todays_date + "/" + arguments["userid"] + "_" + todays_date + "_good_day.png")
        client.upload_file("plot.png", 'sara-dev-data-storage',  "saraaltair_plots/" + "latest" + "/" + arguments["userid"] + "_good_day.png")

        return chart
    
    
    def store_time_series_to_s3(self, arguments = {}):
        """
        created pkl file from timeseries and saves to s3 with todays date.
        """
        print("Storing good day time series to S3")

        #
        good_time_series_data = arguments["good_time_series_data"]

        # put hds file in directory
        good_time_series_data.to_pickle("./good_data.pkl")

        todays_date = datetime.now().strftime("%m%d%Y")
        s3_connect_object = self.get_S3_config_from_json(arguments["s3_config_file_name"])
        client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 
        client.upload_file("./good_data.pkl", 'sara-dev-data-storage',  "sara_timeseries_for_plots/" + todays_date + "/" + arguments["userid"] + "_" + todays_date + "_good_day.pkl") 

        os.remove("./good_data.pkl")


    #============================================================================
    #
    # Helper functions
    #
    #============================================================================
    
    
    def get_good(self, db, username = 'mash_aya', num_days = 30):
        
        """
        creates a time series of concentration values 
        """

        cursor = db.cursor()
        sql_command = "SELECT when_inserted, json_answer FROM HarvardDev.harvardSurvey " 
        sql_command = sql_command + "where user_id=\""+username +"\" and when_inserted > NOW() - INTERVAL " + str(num_days) + " DAY "
        sql_command =  sql_command + " order by survey_completion_time desc;"

        cursor.execute(sql_command)
        returnedData = cursor.fetchall()

        good_day=[]
        xdates = []
        for row in returnedData:
            date = row[0]
            row_json=json.loads(row[1])
            try:
                good_day.append(row_json['Q5'])
                xdates.append(row[0])
            except:
                print(str(date) + " no good day given")
                pass

        xdates = pd.to_datetime(xdates) 
        xdates = xdates.strftime('%m-%d-%Y')
                
        return good_day, xdates
      
        
        
        
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
    # generate_plot_for_everyone()
    