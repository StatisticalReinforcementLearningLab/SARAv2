import json
import mysql.connector as mysql
import pdb
import dateutil.parser 

def connect_to_database(mysql_config_file, db_name):
    """
    Connects to sql database. Returns a db object.
    """
    
    with open(mysql_config_file) as f:
        mysql_connect_object = json.load(f)

    db = mysql.connect(
        host = mysql_connect_object["DB_HOST"],
        port = mysql_connect_object["DB_PORT"],
        user = mysql_connect_object["DB_USER"],
        passwd = mysql_connect_object["DB_PASSWORD"],
        database = db_name # "HarvardDev"
    )
      
    return db

def format_single_survey(sleep_survey_in_json):
    """
    Output sleep survey in the following format.
    {"report_date": "20210724", "start": "11:00", "end": "09:00"}
    """
    formatted_sleep_data = {}
    formatted_sleep_data["start"] = sleep_survey_in_json["Q2_modified"].split()[0]
    formatted_sleep_data["end"] = sleep_survey_in_json["Q3_modified"].split()[0]

    ts = sleep_survey_in_json["ts"].split(",")[0]#.replace(":","") # in "September 5th 2021, 9:33:45 am -07:00" format
    datetime_object = dateutil.parser.parse(ts) 
    formatted_sleep_data["report_date"] = datetime_object.strftime("%Y%m%d")

    return formatted_sleep_data

def get_sleep_survey(db, username = 'mash', num_days = 14):
    cursor = db.cursor()
    sql_command = "SELECT when_inserted, json_answer FROM study.filled " 
    sql_command = sql_command + "where user_id=\""+username +"\" and survey_name = 'sleep_survey' and when_inserted > NOW() - INTERVAL " + str(num_days) + " DAY "
    sql_command =  sql_command + " order by survey_completion_time;"

    cursor.execute(sql_command)  
    returned_data = cursor.fetchall()
    
    formatted_sleep_survey_array = []
    for row in returned_data:
        date = row[0]
        row_json=json.loads(row[1])
        formatted_sleep_survey_array.append(format_single_survey(row_json))

    return formatted_sleep_survey_array

db = connect_to_database('./mysql_config.json', "study")
formatted_sleep_survey_array = get_sleep_survey(db, "mash")
print(formatted_sleep_survey_array)

