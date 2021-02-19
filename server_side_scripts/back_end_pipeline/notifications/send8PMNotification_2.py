
import mysql.connector as mysql
import pdb
from prettytable import PrettyTable
from datetime import datetime
import os
import time
from SendOneSignalNotification import SendOneSignalNotification
import zlib
import json
from dateutil import parser


HOST = "reslnadaptsdb01.research.chop.edu"
PORT = 3306
USERNAME = "flask"
PASSWORD = "#Chop2716"
DATABASE = "adapts"





def getActiveUsers():
    print("Reading active users and onesignalIds from database")
    db = mysql.connect(
        host=HOST,
        port=PORT,
        user=USERNAME,
        passwd=PASSWORD,
        database=DATABASE
    )

    cursor = db.cursor()
    cursor.execute("SELECT user_id, oneSignalPlayerId, whenCompletedTs as whenSurveyCompletedTs, \
        whenCompletedReadableTs  as whenSurveyCompletedRedableTs, currentTimeTs as lastAppOpenedTs, \
        currentTimeReadableTs  as lastAppOpenedReadableTs \
                    FROM   \
                    \
                        (  \
                        SELECT * FROM survey_completed WHERE (user_id,whenCompletedTs) IN  \
                            ( SELECT user_id, MAX(whenCompletedTs) \
                            FROM survey_completed  \
                            GROUP BY user_id \
                            ) \
                        ) AS A  \
                    \
                    inner join \
                    \
                        (  \
                        SELECT * FROM user_ids WHERE (user_id,currentTimeTs) IN  \
                            ( SELECT user_id, MAX(currentTimeTs) \
                            FROM user_ids \
                            GROUP BY user_id \
                            ) \
                        ) AS B \
                    \
                        Using (user_id) \
                    where hour(timediff(now(),from_unixtime( whenCompletedTs/1000))) >= 12 \
                    ")
    result = cursor.fetchall()

    return result

def writeLineInSend8PMNotification(lineToWrite):
    print("Log in a text file")
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    if os.path.isfile("/data/scripts/sendNotifications2/send8PMNotification.py"):
        with open("/data/scripts/sendNotifications2/append8PMNotificationHistory.txt", "a") as myfile:
            myfile.write(current_time + "," + lineToWrite + "\n")


def sendNotificationNow(userId, player_id):
    heading = "Another reminder from ADAPTS"
    quote_text = "A few more hours left to complete the survey"
    print("Sent to player_id: " + player_id)
    try: 
        p1 = SendOneSignalNotification(quote_text, heading, player_id, 'reminder_8PM', 'second-icon.png')
        p1.addUserID(userId)
        p1.sendOneSignalNotifications_Simple()
    except:
        writeLineInSend8PMNotification("Something else went wrong")
    

    
def storeInDatabase(store_data):

    db = mysql.connect(
        host=HOST,
        port=PORT,
        user=USERNAME,
        passwd=PASSWORD,
        database=DATABASE
    )

    cursor = db.cursor()
    insert_stmt = (
      "INSERT INTO 8PMNotificationTable ("
      "user_id, lastSurveyCompletedTsUserTZ, currentTimeTsUserTZ, lastSurveyCompletedUTC, currentTimeTsUTC, is9PMNotificationSent)"
      "VALUES (%s, %s, %s, %s, %s, %s)"
    )
    cursor.execute(insert_stmt, store_data)
    db.commit()


def getUserState(userID):
    db = mysql.connect(
        host=HOST,
        port=PORT,
        user=USERNAME,
        passwd=PASSWORD,
        database=DATABASE
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

def day_light_saving_adjustment(timezone, ts):

    lowest_day_light_saving = parser.parse("Fri, 31 Oct 2020 11:59:59 pm -0400")
    # datetime.datetime(2011, 11, 11, 3, 18, 9, tzinfo=tzoffset(None, -14400))

    lowest_day_light_saving_unixtime = time.mktime(lowest_day_light_saving.timetuple())
    if ts < lowest_day_light_saving_unixtime:
        timezone = timezone - 1

    return timezone

def send8PMNotification():
    
    t = PrettyTable(['userId', 'Last Self-report (TZ)', 'Current time (TZ)', 'Last Self-report (UTC)', 'Current time (UTC)', "Sent 9PM"])
    activeUsersAndLatestDailySurvey = getActiveUsers()

    # write log
    writeLineInSend8PMNotification("Try")

    for row in activeUsersAndLatestDailySurvey:

        print(row)
        userId = row[0]
        (isActive, isParent)= getUserState(userId )      
        
        if isActive:        
          player_id = row[1]
  
          #get timezone info
          readableTs = row[3]
          readableTsSplited = readableTs.split(" ")
  
          #
          if len(readableTsSplited) < 6:
              continue
  
          #
          timezone = int(readableTsSplited[-1].split(":")[0])
          #print(readableTs + ", " + str(timezone))
  
          #
          ts = float(row[2])/1000
          lastSelfReportReadableTsUTC = datetime.utcfromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S') 
          currentTimeReadableTsUTC = datetime.utcfromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
  
  
          # get current time in user's timezone
          timezone = day_light_saving_adjustment(timezone, ts) #readableTs contains data from user's time.

          currentTimeUnixTsUTC = time.time()
          diffInHours = (currentTimeUnixTsUTC - ts)/3600
          readableTsTZ = datetime.utcfromtimestamp(currentTimeUnixTsUTC + timezone*3600).strftime('%Y-%m-%d %H:%M:%S')
          currentHourInUsersTimeZone = datetime.utcfromtimestamp(currentTimeUnixTsUTC + timezone*3600) 
  
          
          NOTIFICATION_NOT_SENT = 0
          NOTIFICATION_SENT = 1
  
          # print([userId, readableTs, readableTsTZ, lastSelfReportReadableTsUTC, currentTimeReadableTsUTC])
          if (currentHourInUsersTimeZone.hour == 20) and (currentHourInUsersTimeZone.minute < 50): # between 8 and 8:30
              if diffInHours < 3: 
                  # t.add_row([userId, readableTs, readableTsTZ, lastSelfReportReadableTsUTC, currentTimeReadableTsUTC, NOTIFICATION_NOT_SENT])
                  dataToStore = [userId, readableTs, readableTsTZ, lastSelfReportReadableTsUTC, currentTimeReadableTsUTC, NOTIFICATION_NOT_SENT] 
              else:
                  # t.add_row([userId, readableTs, readableTsTZ, lastSelfReportReadableTsUTC, currentTimeReadableTsUTC, NOTIFICATION_SENT])
                  dataToStore = [userId, readableTs, readableTsTZ, lastSelfReportReadableTsUTC, currentTimeReadableTsUTC, NOTIFICATION_SENT] 
                  sendNotificationNow(userId, player_id)
              print(dataToStore)
              storeInDatabase(dataToStore)
              writeLineInSend8PMNotification(str(dataToStore).replace("[","").replace("]",""))


send8PMNotification()