import mysql.connector as mysql
import pdb
from prettytable import PrettyTable
import os.path
import time
from SendOneSignalNotification import SendOneSignalNotification
import zlib
import codecs
import csv
import json
from random import randint
from datetime import datetime
from random import uniform
import configparser

config = configparser.ConfigParser()
#-- change back
config.read('/data/html/flask-jwt/config.ini')
# config.read('./config.ini')
host =  config.get('DATABASE', 'HOST')
port =  config.get('DATABASE', 'PORT')
username = config.get('DATABASE', 'USERNAME')
password = config.get('DATABASE', 'PASSWORD')
dbname = config.get('DATABASE', 'DB')



json_array_quotes = []

def readQuotesFromCSV():
    print("reading csv file with quotes")

    quote_location = 'inspirationalquotes_final_adapts.csv'
    if os.path.isfile(quote_location):
        pass
    else:
        quote_location = '/data/scripts/sendNotifications2/' + quote_location


    with codecs.open(quote_location, encoding='utf-8', errors='ignore') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            # print(row)
            json_array_quotes.append({'author': row[1], 'quote': row[3], 'image': "engagement_images/"+row[2]})
    json_array_quotes.pop(0) 


def getActiveUsers():
    """
    Reading active users and onesignalIds from database
    """

    print("get list of active users from db")

    db = mysql.connect(
        host = host,
        port = port,
        user = username,
        passwd = password,
        database = dbname
    )

    cursor = db.cursor()
    cursor.execute("SELECT * FROM user_ids WHERE (user_id,currentTimeTs) IN \
                    ( SELECT user_id, MAX(currentTimeTs)  \
                    FROM user_ids \
                    GROUP BY user_id \
                   )")
    result = cursor.fetchall()

    return result



def getListOfUsersAndOnesignalID():
    """
    Returns a list of current used ids and oneSingalIds
    """

    print("create a list of active users and oneSignalID")

    activeUsersAndLatestDailySurvey = getActiveUsers()

    user_ids = []
    for row in activeUsersAndLatestDailySurvey:
        #print(row)
        userId = row[1]
        oneSignalPlayerId = row[2]

        if '-' in oneSignalPlayerId: 
            user_ids.append([userId, oneSignalPlayerId])

    return user_ids



def store4PMInspirationalMessageForUserID(userID, oneSignalId, authorName, authorImage, quote, is_sent, randomization_probability):

    db = mysql.connect(
        host = host,
        port = port,
        user = username,
        passwd = password,
        database = dbname
    )

    cursor = db.cursor()
    insert_stmt = (
        "INSERT INTO 4PMNotifications (whenSentTs, whenSentReadableTs, user_id, oneSignalId, date, " 
        "author_image, author_name, quote_text, is_sent, randomization_pron) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    )

    whenSentTs = time.time()
    whenSentReadableTs = datetime.utcfromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
    date_ = datetime.utcfromtimestamp(time.time()).strftime('%Y%m%d')
    

    store_data = (whenSentTs, whenSentReadableTs,userID, oneSignalId, date_, authorImage, authorName, quote, is_sent, randomization_probability)
    cursor.execute(insert_stmt, store_data)
    db.commit()

def getUserState(userID):
    db = mysql.connect(
        host = host,
        port = port,
        user = username,
        passwd = password,
        database = dbname
    )
    cursor = db.cursor()
    
    query = ("SELECT username, userinfo_for_admin FROM users WHERE username=%s")
    cursor.execute(query,(userID,))
    row = cursor.fetchone()
    userinfo_for_admin = json.loads(row[1])
    isActive = userinfo_for_admin['isActive']
    isParent = userinfo_for_admin['isParent']   
    cursor.close()
    return (isActive, isParent)


def send_inspirational_quote_notification():

    # read quotes from CSV
    readQuotesFromCSV()

    # read records from database
    userIDRecords =  getListOfUsersAndOnesignalID()

    #
    for userIDRecord in userIDRecords:

        print("Inserting/sending quote for, " + userIDRecord[0] + ", " + userIDRecord[1])

        
        # select a random quote
        rand_int = randint(0, len(json_array_quotes)-1)
        author_image =  json_array_quotes[rand_int]['image']
        author_name = json_array_quotes[rand_int]['author']
        quote = json_array_quotes[rand_int]['quote']

        
        
        heading = "Quote from " + author_name
        player_id = userIDRecord[1]
        user_id = userIDRecord[0]
        print("user_id: " + user_id)

        (isActive, isParent)= getUserState(user_id )        

        state = "isActive: " + str(isActive) + ", isParent: " + str(isParent)
        print(state)
        
        if isActive and not isParent:
            rand = uniform(0,1)
            if rand < 0.5:
                #INSERT 50/50 probability flip 
                try: 
                    store4PMInspirationalMessageForUserID(userIDRecord[0], userIDRecord[1], author_name, author_image, quote, 1, rand)
                    p1 = SendOneSignalNotification(quote, heading, player_id, 'engagement', author_image)
                    p1.addUserID(user_id)
                    # CHANGE THE TIME ON THE NEXT LINE FOR TESTING
                    p1.sendOneSignalNotificationsWithTZWithID('4:00PM')
                except:
                    store4PMInspirationalMessageForUserID(userIDRecord[0], userIDRecord[1], author_name, author_image, quote, -1, rand)
                    print("Something else went wrong")
            else:
                store4PMInspirationalMessageForUserID(userIDRecord[0], userIDRecord[1], "-", "-", "-", 0, rand)
        


## ---- stand-alone run
#csv_read_quotes()
# COMMENT OUT BELOW LINE BEFORE GOING LIVE
# send_inspirational_quote_notification()

# send_engagement_notifications()

# send inspirational quotes between 12:15PM and 12:30PM.  
current_time = datetime.now()
if current_time.hour==0 and current_time.minute <30 and current_time.minute >=15:
    #csv_read_quotes()
    send_inspirational_quote_notification()
else:
    print("It is not time to send engagement notifications")
    with open("/data/scripts/sendNotifications2/cron_engagment.txt", "a") as myfile:
        myfile.write("It is not time to send engagmeent notifications: " + current_time.strftime("%H:%M:%S") + "\n")
