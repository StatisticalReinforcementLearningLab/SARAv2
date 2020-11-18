#
# Created by Mash, Nov 16, 2020
#

import json
import mysql.connector as mysql
import pdb

from SingleVisualizationInterface import SingleVisualizationInterface

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
        db = self.connect_to_database('./config/mysql_config.json', "HarvardDev")
        arousal_array, valenence_array, ts_array = self.get_mood(db)

        #
        

    

    def store_visualization_to_s3(self):
        pass

    
    #============================================================================
    #
    # Helper functions
    #
    #============================================================================

    def get_mood(self, db, username = 'mash_aya', num_days = 30):
        cursor = db.cursor()
        sql_command = "SELECT when_inserted, json_answer FROM HarvardDev.harvardSurvey " 
        sql_command = sql_command + "where user_id=\""+username +"\" and when_inserted > NOW() - INTERVAL " + str(num_days) + " DAY "
        sql_command =  sql_command + " order by survey_completion_time desc;"
        print(sql_command)

        cursor.execute(sql_command)
        returnedData = cursor.fetchall()
        mood1=[]
        mood2=[]
        ts = []
        for row in returnedData:
            date = row[0]
            row_json=json.loads(row[1])
            try:
                mood1.append(float(row_json['QMood'].split(":")[0]))
                mood2.append(float(row_json['QMood'].split(":")[1])  + 5) # correction that was mistake in the real code.
                ts.append({"ts": row_json[u'surveyStartTimeUTC'], "readable_ts": row_json[u'ts']})
            except:
                print(str(date) + " no mood")
        
        # pdb.set_trace()
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


if __name__ == '__main__':

    # initialize parser
    mood_visualization = MoodVisualization()

    #fetch evening survey data
    raw_survey_data_list = mood_visualization.generate_time_series_for_plot()
