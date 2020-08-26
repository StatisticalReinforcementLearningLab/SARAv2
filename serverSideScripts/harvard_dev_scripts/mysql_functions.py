
import mysql.connector as mysql
from datetime import datetime
import time
import json
from getConfig_mysql import DB_PASSWORD, DB_HOST, DB_PORT, DB_USER

# it would be a good idea to download mysql workbench

def connect_to_database(db_name):
    """
    Connects to sql database. Returns a db object.
    """
    return mysql.connect(
        host = DB_HOST,
        port = DB_PORT,
        user = DB_USER,
        passwd = DB_PASSWORD,
        database = db_name
    )

def config_harvardSurvey_database():
    """
    Ensures all columns of the harvardSurvey database are set to the appropriate type.
    """
    db = connect_to_database("HarvardDev")
    cursor = db.cursor()

    cursor.execute("ALTER TABLE harvardSurvey MODIFY COLUMN survey_completion_time VARCHAR (20);")
    cursor.execute("ALTER TABLE harvardSurvey MODIFY COLUMN json_answer TEXT (100000);")
    cursor.execute("ALTER TABLE harvardSurvey ADD COLUMN when_inserted VARCHAR (50);")
    # add a column to record time inserted

    db.commit()

def insert_data_into_mysql(payload):
    """
    Inserts user survey data into the mysql database.
    - payload: a dictionary with username, survey endtime, and the answers to survey questions
    to all of the questions

    """
    print('Inserting data')

    # connect to db
    db = connect_to_database("HarvardDev")
    cursor = db.cursor()

    # removing keys and inserting separately into table
    userID = payload.pop('userName')
    completionTime = str(payload.pop('endtimeUTC'))
    whenIntertedTs = time.time()
    whenInsertedReadableTs = datetime.utcfromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')

    insert_stmt = (
      "INSERT INTO harvardSurvey (user_id, survey_completion_time, json_answer, when_inserted) "
      "VALUES (%s, %s, %s, %s)"
    )
    data = (userID, completionTime, json.dumps(payload), whenInsertedReadableTs)
    cursor.execute(insert_stmt, data)
    db.commit()

def select_all_data():
    """
    Select all data points from the test database.
    """

    #print('Fetching data')

    # connect to db
    db = connect_to_database("HarvardDev")
    cursor = db.cursor()

    # fetch data.
    cursor.execute("SELECT user_id, survey_completion_time, json_answer, when_inserted FROM harvardSurvey")
    return cursor.fetchall()

def get_recent_time(n):
    """
    Get the time of the most recent survey_completion_time for a given user_id.
    - n: string, user_id
    """
    db = connect_to_database("HarvardDev")
    cursor = db.cursor()
    cursor.execute("SELECT MAX(survey_completion_time) FROM harvardSurvey WHERE user_id = {}".format("'"+n+"'"))
    return cursor.fetchall()[0][0]

def get_question_data(n):
    """
    Select the most recent question data based on provided username. Returns that
    question data in json form.
    - n: string, username
    """
    db = connect_to_database("HarvardDev")
    cursor = db.cursor()
    recentTime = get_recent_time(n)
    cursor.execute("SELECT json_answer FROM harvardSurvey WHERE user_id = {} AND survey_completion_time = {}"\
        .format("'"+n+"'", recentTime))

    try:
        questionData = json.loads(cursor.fetchall()[0][0])
    except:
        raise Exception("Could not find most recent question data for specified user.")

    if "Q4" in questionData:
        return questionData
    else:
        pass

def get_usernames():
    """
    Returns a list of unique usernames from the sql database.
    """
    db = connect_to_database("HarvardDev")
    cursor = db.cursor()
    cursor.execute("SELECT DISTINCT user_id FROM harvardSurvey")
    user_ids = cursor.fetchall()
    id_lst = []
    for name, in user_ids:
        id_lst.append(name)
    return id_lst

def clear_all_sql():
    """
    Delete all records in the sql database.
    NOTE: currently depends on magic number for maximum number of records in
    table.
    """
    print('Clearing all records from harvardSurvey table.')

    # connect to db
    db = connect_to_database("HarvardDev")
    cursor = db.cursor()

    cursor.execute("DELETE FROM harvardSurvey WHERE id BETWEEN 0 AND 10000")
    db.commit()

def get_player_id(username):
    """
    Returns most recent player id based on username.
    """
    # connect to db
    db = connect_to_database("SARAApp")
    cursor = db.cursor()
    cursor.execute("SELECT oneSignalPlayerId FROM SARAApp.user_ids WHERE user_id = {} ORDER BY currentTimeTs DESC LIMIT 1"\
        .format("'"+ username+"'"))
    pid = cursor.fetchall()[0][0]

    return pid

## Testing
if __name__ == '__main__':
    #config_harvardSurvey_database()
    #print(get_player_id("susan_aya"))
    #get_question_data("mash_aya")
    get_usernames()



