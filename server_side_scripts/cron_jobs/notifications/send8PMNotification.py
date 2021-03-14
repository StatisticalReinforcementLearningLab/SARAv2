
import mysql.connector as mysql
import pdb
from prettytable import PrettyTable
from datetime import datetime
import os
import time
from SendOneSignalNotification import SendOneSignalNotification
import zlib

def getActiveUsers():
    print("Reading active users and onesignalIds from database")
    db = mysql.connect(
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = "helloworld",
        database = "SARAApp"
    )

    cursor = db.cursor()

    # selects user ids 
    # user ids gets refreshed everytime participant goes to the front page of the app.
    # we get the latest from the user_ids table (right side of join)
    # From survey completed, we get the latest time for survey completed (left side of join)
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
                    \
                    ")
    result = cursor.fetchall()

    return result

def writeLineInSend8PMNotification(lineToWrite):
    print("Log in a text file")
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    if os.path.isfile("/home/ec2-user/SARA_modular/send8PMNotification.py"):
        with open("/home/ec2-user/SARA_modular/append8PMNotificationHistory.txt", "a") as myfile:
            myfile.write(current_time + "," + lineToWrite + "\n")


def sendNotificationNow(player_id):
    heading = "Another reminder from ADAPTS"
    quote_text = "A few more hours left to complete the survey"
    print("Sent to player_id: " + player_id)
    try: 
        p1 = SendOneSignalNotification(quote_text, heading, player_id, 'reminder_9PM', 'second-icon.png')
        p1.sendOneSignalNotifications()
    except:
        writeLineInSend8PMNotification("Something else went wrong")
    

    
def storeInDatabase(store_data):

    db = mysql.connect(
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = "helloworld",
        database = "SARAApp"
    )

    cursor = db.cursor()
    insert_stmt = (
      "INSERT INTO 8PMNotificationTable ("
      "user_id, lastSurveyCompletedTsUserTZ, currentTimeTsUserTZ, lastSurveyCompletedUTC, currentTimeTsUTC, is9PMNotificationSent)"
      "VALUES (%s, %s, %s, %s, %s, %s)"
    )
    cursor.execute(insert_stmt, store_data)
    db.commit()

def day_light_saving_adjustment(timezone, ts):

    lowest_day_light_saving = datetime.strptime("2020-10-31 11:59:59 pm -0400", "%Y-%m-%d %I:%M:%S %p %z")
    # print("ts in string: " + datetime.utcfromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S'))

    # so, user's time is below lowest_day_light_saving. So, we go with -4 instead of -5
    # print("lowest_day_light_saving " + str(lowest_day_light_saving.timestamp()))
    ts = ts/1000
    if ts < lowest_day_light_saving.timestamp():
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
        player_id = row[1]

        # get timezone info, using "October 31st 2020, 9:36:42 pm -04:00"
        readableTs = row[3]
        readableTsSplited = readableTs.split(" ")

        #
        if len(readableTsSplited) < 6:
            continue

        # 
        # gets the -04 from "October 31st 2020, 9:36:42 pm -04:00"  
        # 
        timezone = int(readableTsSplited[-1].split(":")[0])
        #print(readableTs + ", " + str(timezone))

        # when self-report was completed in unix time. Python returns time in GMT.
        # note the unixtime in the phone is milliseconds from 1970 01 01 in users timezone (not GMT)
        # Here, when we ask for ts to date string, python thinks it is ts and GMT.
        # So, if we do the math, then python will think survey is completed GMT time 6:31pm if it is completed in 6:30pm pst.
        ts = float(row[2])/1000
        lastSelfReportReadableTsUTC = datetime.utcfromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S') 

        # current time in UTC
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
        if (currentHourInUsersTimeZone.hour == 21) and (currentHourInUsersTimeZone.minute < 30): # between 9 and 9:30
            if diffInHours < 3: 
                # t.add_row([userId, readableTs, readableTsTZ, lastSelfReportReadableTsUTC, currentTimeReadableTsUTC, NOTIFICATION_NOT_SENT])
                dataToStore = [userId, readableTs, readableTsTZ, lastSelfReportReadableTsUTC, currentTimeReadableTsUTC, NOTIFICATION_NOT_SENT] 
            else:
                # t.add_row([userId, readableTs, readableTsTZ, lastSelfReportReadableTsUTC, currentTimeReadableTsUTC, NOTIFICATION_SENT])
                dataToStore = [userId, readableTs, readableTsTZ, lastSelfReportReadableTsUTC, currentTimeReadableTsUTC, NOTIFICATION_SENT] 
                # sendNotificationNow(player_id)
            print(dataToStore)
            storeInDatabase(dataToStore)
            writeLineInSend8PMNotification(str(dataToStore).replace("[","").replace("]",""))


        
# print(day_light_saving_adjustment(-4, 2*3600 + 1604194600639/1000)) # October 31st 2020, 9:36:40 pm -04:00
# print(day_light_saving_adjustment(-5, 1604448857061/1000))


send8PMNotification()

"""
from datetime import datetime
print(datetime.utcnow())
print(datetime.utcnow().timestamp())

import time
from datetime import datetime
ts = int("1589667533")

# if you encounter a "year is out of range" error the timestamp
# may be in milliseconds, try `ts /= 1000` in that case
print(datetime.utcfromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S'))
print(datetime.utcfromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S'))

print((time.time() - 1589667533)/3600)
"""