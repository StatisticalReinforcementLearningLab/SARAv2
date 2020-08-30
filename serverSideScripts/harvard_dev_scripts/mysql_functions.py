
import mysql.connector as mysql
from datetime import datetime
import time
import json
from getConfig_mysql import DB_PASSWORD, DB_HOST, DB_PORT, DB_USER
import uuid

# it would be a good idea to download mysql workbench

def connectToDatabase(db_name):
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

def configHarvardSurveyDatabase():
    """
    Ensures all columns of the harvardSurvey database are set to the appropriate type.
    """
    db = connectToDatabase("HarvardDev")
    cursor = db.cursor()

    cursor.execute("ALTER TABLE harvardSurvey MODIFY COLUMN survey_completion_time VARCHAR (20);")
    cursor.execute("ALTER TABLE harvardSurvey MODIFY COLUMN json_answer TEXT (100000);")
    # FIXME
    #cursor.execute("IF NOT EXISTS ALTER TABLE harvardSurvey ADD COLUMN when_inserted VARCHAR (50));")
    #cursor.execute("IF COL_LENGTH ('HarvardDev.harvardSurvey'.'when_inserted') IS NULL BEGIN ALTER TABLE harvardSurvey ADD COLUMN when_inserted VARCHAR (50) END;")
    cursor.execute("ALTER TABLE harvardSurvey ADD COLUMN response_id VARCHAR (50);")

    db.commit()

def insertDataIntoHarvardSurvey(payload):
    """
    Inserts user survey data into the mysql database.
    - payload: a dictionary with username, survey endtime, and the answers to survey questions
    to all of the questions

    """
    print('Inserting data')

    # connect to db
    db = connectToDatabase("HarvardDev")
    cursor = db.cursor()

    # removing keys and inserting separately into table
    userID = payload.pop('userName')
    completionTime = str(payload.pop('endtimeUTC'))
    whenIntertedTs = time.time()
    whenInsertedReadableTs = datetime.utcfromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
    # to ensure idempotency of onesignal
    responseUUID = str(uuid.uuid4())

    insertStmt = (
      "INSERT INTO harvardSurvey (user_id, survey_completion_time, json_answer, when_inserted, response_id) "
      "VALUES (%s, %s, %s, %s, %s)"
    )
    data = (userID, completionTime, json.dumps(payload), whenInsertedReadableTs, responseUUID)
    cursor.execute(insertStmt, data)
    db.commit()

# # MAYBE UNNECESSARY
# def insertDataIntoNotificationTracking(username, timeNotified):
#     """
#     Track the last time a given username was notified via OneSignal.
#     - username: string
#     - timeNotified: long? but treated as string when inserted? idk, UTC time
#     """
#     db = connectToDatabase("HarvardDev")
#     cursor = db.cursor()

#     # is this idempotent?
#     insertStmt = (
#         "INSERT INTO notificationTracking (username, time_of_last_notification) "
#         "VALUES (%s, %s)"
#     )
#     data = (username, timeNotified)
#     cursor.execute(insertStmt, data)
#     db.commit()

def selectAllDataFromHarvardSurvey():
    """
    Select all data points from the test database.
    """

    #print('Fetching data')

    # connect to db
    db = connectToDatabase("HarvardDev")
    cursor = db.cursor()

    # fetch data.
    cursor.execute("SELECT user_id, survey_completion_time, json_answer, when_inserted FROM harvardSurvey")
    return cursor.fetchall()

def getRecentTime(n):
    """
    Get the time of the most recent survey_completion_time for a given user_id.
    - n: string, user_id
    """
    db = connectToDatabase("HarvardDev")
    cursor = db.cursor()
    cursor.execute("SELECT MAX(survey_completion_time) FROM harvardSurvey WHERE user_id = {}".format("'"+n+"'"))
    try:
        return cursor.fetchall()[0][0]
    except:
        print("Could not find most recent survey completion time for this user.")

def getQuestionDataFromHarvardSurvey(n):
    """
    Select the most recent question data based on provided username. Returns that
    question data in json form, and the uuid associated with that resposne.
    - n: string, username
    """
    db = connectToDatabase("HarvardDev")
    cursor = db.cursor()
    recentTime = getRecentTime(n)
    cursor.execute("SELECT json_answer, response_id FROM harvardSurvey WHERE user_id = {} AND survey_completion_time = {}"\
        .format("'"+n+"'", recentTime))
    returnedData = cursor.fetchall()[0]

    try:
        #questionData = json.loads(cursor.fetchall()[0][0])
        questionData = json.loads(returnedData[0])
    except:
        raise Exception("Could not find most recent question data for specified user.")

    if "Q4" in questionData:
        return questionData, returnedData[1]
    else:
        pass

def getUsernamesFromHarvardSurvey():
    """
    Returns a list of unique usernames from the sql database.
    """
    db = connectToDatabase("HarvardDev")
    cursor = db.cursor()
    cursor.execute("SELECT DISTINCT user_id FROM harvardSurvey")
    userIds = cursor.fetchall()
    idLst = []
    for name, in userIds:
        idLst.append(name)
    return idLst

def clearAllHarvardSurvey():
    """
    Delete all records in the sql database.
    NOTE: currently depends on magic number for maximum number of records in
    table.
    """
    print('Clearing all records from harvardSurvey table.')

    # connect to db
    db = connectToDatabase("HarvardDev")
    cursor = db.cursor()

    cursor.execute("DELETE FROM harvardSurvey")
    db.commit()

def getPlayerId(username):
    """
    Returns most recent player id based on username.
    - username: string
    """
    # connect to db
    db = connectToDatabase("SARAApp")
    cursor = db.cursor()
    cursor.execute("SELECT oneSignalPlayerId FROM SARAApp.user_ids WHERE user_id = {} ORDER BY currentTimeTs DESC LIMIT 1"\
        .format("'"+ username+"'"))
    try:
        pid = cursor.fetchall()[0][0]
    except:
        return None

    return pid


## Testing
if __name__ == '__main__':
    #configHarvardSurveyDatabase()
    print(getPlayerId("susan_aya"))
    #getQuestionDataFromHarvardSurvey("mash_aya")
    #getUsernames()




