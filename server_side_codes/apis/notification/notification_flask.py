import argparse
import mysql.connector as mysql
import os
import json
import time
from datetime import datetime
from flask import Flask,request
from SendOneSignalNotification import SendOneSignalNotification


#log in database
def load_database_config(dbname):
    """
    Loads the database location.
    The mysql_config.json is in the curent directory
    where the python script is.
    """
    config_location = 'mysql_config.json'
    if os.path.isfile(config_location):
        pass
    else:
        config_location = '/home/ec2-user/SARATemplate/sara-python-package/sara/config/' + config_location


    with open(config_location) as f:
        mysql_connect_object = json.load(f)

    return mysql.connect(
        host = mysql_connect_object["DB_HOST"],
        port = mysql_connect_object["DB_PORT"],
        user = mysql_connect_object["DB_USER"],
        passwd = mysql_connect_object["DB_PASSWORD"],
        database = dbname
    )

def storeMessage(userID, oneSignalId, notification_id, authorName, authorImage, quote, timestring = None):
    """
    Stores the info for specific user, what notfication was send.
    """
    db = load_database_config("study")
    cursor = db.cursor()
    insert_stmt = (
        "INSERT INTO notifications (whenSentTs, whenSentReadableTs, user_id, oneSignalId, date, "
        "author_image, author_name, quote_text, notification_id) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    )
    
    date_ = datetime.utcfromtimestamp(time.time()).strftime('%Y%m%d')
    if timestring is None: 
        whenSentTs = time.time()
        whenSentReadableTs = datetime.utcfromtimestamp(whenSentTs).strftime('%Y-%m-%d %H:%M:%S')
    else: 
        whenSentReadableTs = datetime.utcfromtimestamp(time.time()).strftime('%Y-%m-%d') + " " + timestring
        whenSentTs = datetime.strptime(whenSentReadableTs, "%Y-%m-%d %H:%M").timestamp()

    store_data = (whenSentTs, whenSentReadableTs,userID, oneSignalId, date_, authorImage, authorName, quote, notification_id)
    cursor.execute(insert_stmt, store_data)
    db.commit()

app = Flask(__name__)

@app.route('/',methods=['GET'])
def hello_world():
  return 'Hello from Flask!'


@app.route('/post_test',methods=['POST'])
def hello_post():

    if request.form.get('user')==None:
        return 'no user!'

    user = request.form['user']
    return "The name is: " + str(user)

@app.route('/schedule_message',methods=['POST'])
def ScheduleMessage():

    #check for all field data
    if request.form.get('user_id')==None:
        return 'No User ID provided'
    if request.form.get('player_id')==None:
        return 'No Player ID provided'
    if request.form.get('heading')==None:
        return 'No message heading provided'
    if request.form.get('body')==None:
        return 'No message body provided'
    if request.form.get('image')==None:
        return 'No image name provided'
    if request.form.get('db_update')==None:
        return 'db_update (y/n) not provided'
    if request.form.get('time') == None: 
        return 'No time provided.'

    user_id = request.form['user_id']
    player_id = request.form['player_id']
    heading = request.form['heading']
    body = request.form['body']
    image = request.form['image']
    db_update = request.form['db_update']
    timestring = request.form['time']

    p1 = SendOneSignalNotification(body,heading,player_id,'engagement',image)
    p1.addUserID(user_id)
    status, response = p1.sendOneSignalNotificationsWithTZWithID(timestring)
    notification_id = response['id']
    print(status)
    if db_update == 'y' and status == 200:
        print("Recording notification in DB")
        storeMessage(user_id,player_id, notification_id, heading,image,body, timestring = timestring)

    if status == 200:  
        return 'Message scheduled with ID {}'.format(response['id'])
    else: 
        return "Something went wrong with scheduling your message."

@app.route('/send_message',methods=['POST'])
def SendSingleMessage():

    #check for all field data
    if request.form.get('user_id')==None:
        return 'No User ID provided'
    if request.form.get('player_id')==None:
        return 'No Player ID provided'
    if request.form.get('heading')==None:
        return 'No message heading provided'
    if request.form.get('body')==None:
        return 'No message body provided'
    if request.form.get('image')==None:
        return 'No image name provided'
    if request.form.get('db_update')==None:
        return 'db_update (y/n) not provided'

    user_id = request.form['user_id']
    player_id = request.form['player_id']
    heading = request.form['heading']
    body = request.form['body']
    image = request.form['image']
    db_update = request.form['db_update']

    p1 = SendOneSignalNotification(body,heading,player_id,'engagement',image)
    p1.addUserID(user_id)
    status, response = p1.sendOneSignalNotifications()
    notification_id = response['id']
    print(status)
    if db_update == 'y' and status == 200:
        print("Recording notification in DB")
        storeMessage(user_id,player_id, notification_id, heading,image,body)

    if status == 200:  
        return 'Message scheduled with ID {}'.format(response['id'])
    else: 
        return "Something went wrong with sending your message."

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=6000)
