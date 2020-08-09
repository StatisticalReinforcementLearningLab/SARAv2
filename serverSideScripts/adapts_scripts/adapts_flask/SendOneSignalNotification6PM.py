import mysql.connector as mysql
import requests
import json
import csv 
import codecs
from random import randint
from SendOneSignalNotification import SendOneSignalNotification
import configparser

config = configparser.ConfigParser()
config.read('/data/html/flask-jwt/config.ini')
host =  config.get('DATABASE', 'HOST')
port =  config.get('DATABASE', 'PORT')
username = config.get('DATABASE', 'USERNAME')
password = config.get('DATABASE', 'PASSWORD')
dbname = config.get('DATABASE', 'DB')


def send_reminder_notification(player_id):

    #player_id = "526dbc76-5d3b-471d-ac09-82f43e7fb38c"
    #player_id = "6d5e6603-c2ac-4171-b6a3-7ad856b6a900"
    
    heading = "Time to check in on ADAPTS"
    quote_text = "Your survey is now available"

    p1 = SendOneSignalNotification(quote_text, heading, player_id, 'reminder', 'fishjournal.png')
    #p1.sendOneSignalNotifications()

    #p1.sendOneSignalNotifications()
    p1.sendOneSignalNotificationsWithTZ_Simple('6:00PM')

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


def send_all_reminder_notifications():
    # read records from database
    userIDRecords =  getListOfUsersAndOnesignalID()
    #
    for userIDRecord in userIDRecords:

        print("Sending notification for, " + userIDRecord[0] + ", " + userIDRecord[1])

         
        #heading = "Quote from " + author_name
        player_id = userIDRecord[1]
        user_id = userIDRecord[0]
        print("user_id: " + user_id)
        
        (isActive, isParent)= getUserState(user_id )        
        if isActive and not isParent:

          try: 
              send_reminder_notification(player_id)
          except:
              print("Something else went wrong")



# send_engagement_notifications()
# send_reminder_notification()

# send_all_reminder_notifications()

import datetime
current_time = datetime.datetime.now()
if current_time.hour==0 and current_time.minute <30 and current_time.minute >=15:
    send_all_reminder_notifications()
else:
    print("It is not time to send reminder notifications")
    with open("/data/scripts/sendNotifications2/cron_reminder.txt", "a") as myfile:
        myfile.write("It is not time to send reminder notifications: " + current_time.strftime("%H:%M:%S") + "\n")




