import json
import mysql.connector as mysql
from datetime import datetime
from datetime import timedelta
import pandas as pd
import altair as alt
import boto3
import os
import pdb
from altair_saver import save

from SingleVisualizationInterface import SingleVisualizationInterface

def main():
    # initialize visualization
    conc_visualization = ConcVisualization()

    #fetch concentration data
    conc_time_series_df = conc_visualization.generate_time_series_for_plot(
        { "config_file_name": "./config/mysql_config.json", 
          "database_name" : "HarvardDev",
          "userid" : "mash_aya" }
    )

    #
    """
    conc_visualization.store_time_series_to_s3(
        { "s3_config_file_name": "./config/aws_config.json", 
          "conc_time_series_data" : conc_time_series_df,
          "userid" : "mash_aya" }
    )
    """
    #
    conc_visualization.store_visualization_to_s3(
        { "s3_config_file_name": "./config/aws_config.json", 
          "conc_time_series_df" : conc_time_series_df,
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

        conc_visualization = ConcVisualization()

        #fetch mood data
        conc_time_series_df = conc_visualization.generate_time_series_for_plot(
            { "config_file_name": "./config/mysql_config.json", 
            "database_name" : "HarvardDev",
            "userid" : username }
        )

        # skip creating plots if there is no data.
        if len(conc_time_series_df) == 0:
            print("No data for " + username)
            continue

        #
        conc_visualization.store_time_series_to_s3(
            { "s3_config_file_name": "./config/aws_config.json", 
            "conc_time_series_data" : conc_time_series_df,
            "userid" : username }
        )

        #
        conc_visualization.store_visualization_to_s3(
            { "s3_config_file_name": "./config/aws_config.json", 
            "conc_time_series_df" : conc_time_series_df,
            "userid" : username }
        )
        
    db.close()
    pass

    

class ConcVisualization(SingleVisualizationInterface):
   
    def __init__(self):
        self.name = "Concentration visualization" # give a name to this visualization
        self.description = "Line chart of ordinal 4-category concentration data"
        
    
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
        print("Generating time series for concentration")

        db = self.connect_to_database(arguments["config_file_name"], arguments["database_name"])
        conc_label_array, conc_number_array, ts_array = self.get_conc(db, arguments["userid"])

        #create a time series
        
        #-- convert to pandas dataframe, with time based indexing
        #Sarah: this did not work for me; dates appear to be alread in correct form?
        """
        datetime_ts_string = ['null'] * len(ts_array)
        for i in range(len(ts_array)):
            ts =  ts_array[i]["ts"]/1000 - 7*60*60 # TODO: correct 7 for day light saving   #this didn't work for me
            datetime_ts = datetime.utcfromtimestamp(ts) 
            datetime_ts_string[i] = datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p')
        """

        conc_time_series_data = {
            #'timestamp': datetime_ts_string,
            'timestamp': ts_array,
            'conc_label': conc_label_array,
            'conc_number': conc_number_array
        }                  

        # pdb.set_trace()
        conc_time_series_data = pd.DataFrame(conc_time_series_data, columns = ['timestamp', 'conc_label','conc_number']) 
        conc_time_series_data = conc_time_series_data.drop_duplicates(subset='timestamp',keep="last")      
        
        return conc_time_series_data
    
    
    def store_visualization_to_s3(self, arguments, num_days = 30):
        """
        created altair plot file from timeseries and saves to s3 with todays date.
        """
        print("Storing concentration plot to S3")
        
        conc_time_series_df = arguments["conc_time_series_df"]

        # color scheme for all plots 
        # https://htmlcolorcodes.com/color-picker/
        background_col = 'aliceblue'
        title_col = '#004B99'
        mark_col = '#99004B'
        background_text_col = '#4B9900'
                      
        all_dates =pd.date_range(datetime.now() - timedelta(num_days),datetime.now()).strftime('%m-%d-%Y')
        
        #TODO fix labels on y axis
        chart = alt.Chart(conc_time_series_df,title="Concentration").mark_area(point=True,color=mark_col,opacity=.2).encode(
        color='conc_label',
        x=alt.X('timestamp',title='Date'), #change the axis title
        y=alt.Y(field='conc_number',type='quantitative', impute=alt.ImputeParams(value=None,keyvals=all_dates.values),title='Concentration',
                axis=alt.Axis(values=[1,2,3,4]))
        ).properties(width=400,height=400).configure(background=background_col).configure_title(
        fontSize=25,color=title_col).configure_axis(
        titleFontSize=15,titleColor=title_col,labelAngle=45)
        
        
        chart.save("plot.html")

        #commented out for sarah testing
        """
        todays_date = datetime.now().strftime("%m%d%Y")
        s3_connect_object = self.get_S3_config_from_json(arguments["s3_config_file_name"])
        client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 
        client.upload_file("plot.html", 'sara-dev-data-storage',  "saraaltair_plots/" + todays_date + "/" + arguments["userid"] + "_" + todays_date + "_concentration.html")
        """

        todays_date = datetime.now().strftime("%m%d%Y")
        s3_connect_object = self.get_S3_config_from_json(arguments["s3_config_file_name"])
        client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 
        client.upload_file("plot.html", 'sara-dev-data-storage',  "saraaltair_plots/" + todays_date + "/" + arguments["userid"] + "_" + todays_date + "_concentration_level.html")
        

        chart.save("plot.json")
        client.upload_file("plot.json", 'sara-dev-data-storage',  "saraaltair_plots/" + todays_date + "/" + arguments["userid"] + "_" + todays_date + "_concentration_level.json")

        # save as svg
        # pip install altair_saver
        save(chart, "plot.png") 
        client.upload_file("plot.png", 'sara-dev-data-storage',  "saraaltair_plots/" + todays_date + "/" + arguments["userid"] + "_" + todays_date + "_concentration_level.png")
        client.upload_file("plot.png", 'sara-dev-data-storage',  "saraaltair_plots/" + "latest" + "/" + arguments["userid"] + "_concentration_level.png")


        return chart
    
    
    def store_time_series_to_s3(self, arguments = {}):
        """
        created pkl file from timeseries and saves to s3 with todays date.
        """
        print("Storing concentration time series to S3")

        #
        conc_time_series_data = arguments["conc_time_series_data"]

        # put hds file in directory
        conc_time_series_data.to_pickle("./conc_data.pkl")

        todays_date = datetime.now().strftime("%m%d%Y")
        s3_connect_object = self.get_S3_config_from_json(arguments["s3_config_file_name"])
        client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 
        client.upload_file("./conc_data.pkl", 'sara-dev-data-storage',  "sara_timeseries_for_plots/" + todays_date + "/" + arguments["userid"] + "_" + todays_date + "_concentration.pkl") 

        os.remove("./conc_data.pkl")


    #============================================================================
    #
    # Helper functions
    #
    #============================================================================
    
    def get_conc(self, db, username = 'mash_aya', num_days = 30):
        
        """
        creates a time series of concentration values 
        """

        cursor = db.cursor()
        sql_command = "SELECT when_inserted, json_answer FROM HarvardDev.harvardSurvey " 
        sql_command = sql_command + "where user_id=\""+username +"\" and when_inserted > NOW() - INTERVAL " + str(num_days) + " DAY "
        sql_command =  sql_command + " order by survey_completion_time;"
        
        cursor.execute(sql_command)  
        returnedData = cursor.fetchall()

        conc=[]
        xdates = []
        conc_number=[]
        for row in returnedData:
            date = row[0]
            row_json=json.loads(row[1])
            try:
                if 'Q2' in row_json:
                    concentration_level = row_json['Q2']

                    if concentration_level ==  'Rarely/Never':
                        conc_number.append(1)
                        conc.append(concentration_level)
                        xdates.append(date)
                    elif concentration_level == ' Occasionally':
                        conc_number.append(2)
                        conc.append(concentration_level)
                        xdates.append(date)
                    elif concentration_level == ' Often':
                        conc_number.append(3)
                        conc.append(concentration_level)
                        xdates.append(date)
                    elif concentration_level == ' Almost Always/Always':
                        conc_number.append(4)
                        conc.append(concentration_level)
                        xdates.append(date)
            except:
                print(str(date) + " no concentration level")

            
        xdates = pd.to_datetime(xdates) 
        xdates = xdates.strftime('%m-%d-%Y')
        
        return conc,conc_number, xdates
    
        
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
    # main()
    generate_plot_for_everyone()
    