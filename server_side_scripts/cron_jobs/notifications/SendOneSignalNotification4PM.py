import mysql.connector as mysql
import pdb
from prettytable import PrettyTable
import os.path
import time
from SendOneSignalNotification import SendOneSignalNotification
import zlib
import codecs
import csv
from random import randint
from datetime import datetime

json_array_quotes = []

def readQuotesFromCSV():
    print("reading csv file with quotes")

    quote_location = 'inspirationalquotes_final_adapts.csv'
    if os.path.isfile(quote_location):
        pass
    else:
        quote_location = '/home/ec2-user/SARA_modular/SARA_H/' + quote_location


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
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = "helloworld",
        database = "SARAApp"
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
        # print(row)
        userId = row[1]
        oneSignalPlayerId = row[2]

        if '-' in oneSignalPlayerId: 
            user_ids.append([userId, oneSignalPlayerId])

    return user_ids


def store4PMInspirationalMessageForUserID(userID, oneSignalId, authorName, authorImage, quote):

    db = mysql.connect(
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = "helloworld",
        database = "SARAApp"
    )

    cursor = db.cursor()
    insert_stmt = (
        "INSERT INTO 4PMNotifications (whenSentTs, whenSentReadableTs, user_id, oneSignalId, date, " 
        "author_image, author_name, quote_text) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    )

    whenSentTs = time.time()
    whenSentReadableTs = datetime.utcfromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
    date_ = datetime.utcfromtimestamp(time.time()).strftime('%Y%m%d')
    

    store_data = (whenSentTs, whenSentReadableTs,userID, oneSignalId, date_, authorImage, authorName, quote)
    cursor.execute(insert_stmt, store_data)
    db.commit()


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

        store4PMInspirationalMessageForUserID(userIDRecord[0], userIDRecord[1], author_name, author_image, quote)
        
        heading = "Quote from " + author_name
        player_id = userIDRecord[1]
        user_id = userIDRecord[0]

        try: 
            p1 = SendOneSignalNotification(quote, heading, player_id, 'engagement', author_image)
            p1.addUserID(user_id)
            p1.sendOneSignalNotificationsWithTZWithID('4:00PM')
        except:
            print("Something else went wrong")



## ---- stand-alone run
#csv_read_quotes()
# send_inspirational_quote_notification()

# send_engagement_notifications()

# send inspirational quotes between 12:15PM and 12:30PM.  
current_time = datetime.now()
if current_time.hour==0 and current_time.minute <30 and current_time.minute >=15:
    #csv_read_quotes()
    send_inspirational_quote_notification()
else:
    print("It is not time to send engagement notifications")
    with open("/home/ec2-user/SARA_modular/cron_engagment.txt", "a") as myfile:
        myfile.write("It is not time to send engagmeent notifications: " + current_time.strftime("%H:%M:%S") + "\n")




