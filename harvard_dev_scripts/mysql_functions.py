
import mysql.connector as mysql
from datetime import datetime
import time
import json
from getConfig_mysql import DB_PASSWORD

# it would be a good idea to download mysql workbench

def insert_data_into_mysql(payload):
    """
    Inserts user survey data into the mysql database.
    - payload: a dictionary with username, survey endtime, and the answers to survey questions
    to all of the questions

    """

    print('Inserting data')

    # connect to db
    db = mysql.connect(
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = DB_PASSWORD,
        database = "HarvardDev"
    )
    cursor = db.cursor()

    # insert data
    # whenIntertedTs = time.time()
    # whenInsertedReadableTs = datetime.utcfromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
    #payload = "temp data"

    #json_data = json.loads(payload)
    userID = payload.pop('userName')
    completionTime = str(payload.pop('endtimeUTC'))

    # FIXME: make this a separate function; it only requires one-time use, right?
    cursor.execute("ALTER TABLE harvardSurvey MODIFY COLUMN survey_completion_time VARCHAR (20);")
    cursor.execute("ALTER TABLE harvardSurvey MODIFY COLUMN json_answer TEXT (100000);")

    insert_stmt = (
      "INSERT INTO harvardSurvey (user_id, survey_completion_time, json_answer) "
      "VALUES (%s, %s, %s)"
    )
    data = (userID, completionTime, json.dumps(payload))
    cursor.execute(insert_stmt, data)
    db.commit()

def select_data_from_mysql():
    """
    Select all data points from the test database.
    """

    print('Fetching data')

    # connect to db
    db = mysql.connect(
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = DB_PASSWORD,
        database = "HarvardDev"
    )
    cursor = db.cursor()

    # fetch data.
    cursor.execute("SELECT * FROM harvardSurvey")
    recordsInTestTable = cursor.fetchall()

    # print data.
    for row in recordsInTestTable:
        print(row)
        print("\n")

def select_questions_from_mysql(n):
    """
    Select the question data based on provided username.
    - n: string, username
    """

    print('Fetching data')

    # connect to db
    db = mysql.connect(
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = DB_PASSWORD,
        database = "HarvardDev"
    )
    cursor = db.cursor()

    # fetch data.
    cursor.execute("SELECT * FROM harvardSurvey")
    recordsInTestTable = cursor.fetchall()

    counter = 0
    old_time = 0
    recent_answer = ''

    # eventually relevant data should be in string form in the table

    # FIXME!! STRUCTURE OF DATABASE HAS CHANGED
    #print data.
    for row in recordsInTestTable:

        row_dict = json.loads(row[3])

        # FIXME: too many magic numbers
        #if row_dict["userName"] == n:
        if row[1] == n:
            answer = row_dict["Q4"]
            #time = row_dict["endtimeUTC"]
            time = row[2]
            print("Answer to question 4 from {} at time {}: {}".format(n, time, answer))
            if int(time) > old_time:
                recent_answer = str(answer)
                old_time = int(time)

    return recent_answer


def get_usernames():
    """
    Returns a list of unique usernames from the sql database.
    """
    # FIXME: NEW DATABASE
    # connect to db
    db = mysql.connect(
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = DB_PASSWORD,
        database = "HarvardDev"
    )
    cursor = db.cursor()

    # fetch data.
    # when SQL structure changes, use SELECT DISTINCT
    cursor.execute("SELECT * FROM testTable")
    recordsInTestTable = cursor.fetchall()

    usernames = {}

    for row in recordsInTestTable:

        row_dict = json.loads(row[3])
        usernames[row_dict["userName"]] = row_dict["userName"]

    return usernames.keys()

def clear_all_sql():
    """
    Delete all records in the sql database.
    """
    print('Clearing all records.')

    # connect to db
    db = mysql.connect(
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = DB_PASSWORD,
        database = "HarvardDev"
    )
    cursor = db.cursor()

    # NOT WORKING --> maybe ask mash how to do this

    #DELETE * FROM testTable

    cursor.execute("DELETE FROM harvardSurvey WHERE id BETWEEN 0 AND 200")
    db.commit()

def get_player_id(username):
    """
    Returns most recent player id based on username.
    """
    # connect to db
    db = mysql.connect(
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = DB_PASSWORD,
        database = "SARAApp"
    )
    cursor = db.cursor()
    cursor.execute("SELECT oneSignalPlayerId FROM SARAApp.user_ids WHERE user_id = {} ORDER BY currentTimeTs DESC LIMIT 1"\
        .format("'"+ username+"'"))
    pid = cursor.fetchall()[0][0]

    return pid
# def clear_by_username(name):
#     """
#     Delete records based on username.
#     """
#     print("Clearning records with username: {}".format(name))

#     # connect to db
#     db = mysql.connect(
#         host = "ec2-54-91-131-166.compute-1.amazonaws.com",
#         port = 3308,
#         user = "root",
#         passwd = "password",
#         database = "HarvardDev"
#     )
#     cursor = db.cursor()

#     cursor.execute("DELETE * FROM testTable WHERE id BETWEEN 0 AND 200")
#     db.commit()


## Testing
# #insert_data_into_mysql()
# print("Showing what is in the database")
# select_data_from_mysql()
# print("Clearing the database")
# clear_all_sql()
# select_data_from_mysql()

#select_questions_from_mysql("chloe_aya")

test = get_player_id("mash_aya")
print(test)


