from flask import Flask
from flask import request
import mysql.connector as mysql
from datetime import datetime
import time
import json
from flask_cors import CORS
from flask import jsonify

from app import app
CORS(app)

#===========================================================================================

@app.route('/')
def home():
   return "hello world!"



#===========================================================================================

@app.route('/adapts-notification-insert', methods=['POST']) #GET requests will be blocked
def adapts_notification_insert():
    req_data = request.get_json()
    return str(insert_json_into_mysql_noti(json.dumps(req_data)))

##### ----- JSON store in the mysql
def insert_json_into_mysql_noti(json_string):
    db = mysql.connect(
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = "helloworld",
        database = "SARAApp"
    )

    """
    {
        "PARTICIAPANT_ID": "test",
        "Notification_Id": "123456",
        "DATE": "12252019",
        "whenReceivedTs": 11,
        "whenReceivedReadableTs": "12252019",
        "typeOfNotification": "4PM",
        "JSON_dump": "{'test': 'yes'}"
    }
    """

    req_data = request.get_json()
    cursor = db.cursor()
    insert_stmt = (
      "INSERT INTO SARA_Notifications (PARTICIAPANT_ID, DATE, Notification_Id, whenReceivedTs, whenReceivedReadableTs, typeOfNotification, JSON_dump, device_type) "
      "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    )
    data = (req_data["PARTICIAPANT_ID"],req_data["DATE"],req_data["Notification_Id"],req_data["whenReceivedTs"],req_data["whenReceivedReadableTs"],req_data["typeOfNotification"],req_data["JSON_dump"],req_data["device_type"])
    cursor.execute(insert_stmt, data)

    ## to make final output we have to run the 'commit()' method of the database object
    db.commit()

    return cursor.rowcount


#===========================================================================================

@app.route('/adapts-notification-update', methods=['POST']) #GET requests will be blocked
def adapts_notification_update():
    req_data = request.get_json()
    return str(update_json_into_mysql_noti(json.dumps(req_data)))

##### ----- JSON store in the mysql
def update_json_into_mysql_noti(json_string):
    db = mysql.connect(
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = "helloworld",
        database = "SARAApp"
    )
    """
    {
        "PARTICIAPANT_ID": "test",
        "DATE": "12252019",
        "whenReceivedTs": 11,
        "whenReceivedReadableTs": "12252019",
        "whenActedonTs": 11,
        "whenActedonReadableTs": "12252019",
        "typeOfAction": "like",
        "typeOfNotification": "4PM",
        "JSON_dump": "{'test': 'yes'}"
    }
    """

    req_data = request.get_json()
    cursor = db.cursor()
    update_stmt = (
      "UPDATE SARA_Notifications SET whenActedonTs=%s , whenActedonReadableTs=%s , typeOfAction=%s "
      "where (Notification_Id=%s  AND PARTICIAPANT_ID=%s)"
    )
    data = (req_data["whenActedonTs"],req_data["whenActedonReadableTs"],req_data["typeOfAction"],req_data["Notification_Id"],req_data["PARTICIAPANT_ID"])
    cursor.execute(update_stmt, data)

    ## to make final output we have to run the 'commit()' method of the database object
    db.commit()

    return cursor.rowcount



#===========================================================================================
@app.route('/store-onesignal-id', methods=['POST']) #GET requests will be blocked
def store_onesignal_id():
    req_data = request.get_json()
    print(req_data)
    user_id = req_data['user_id']
    oneSignalPlayerId = req_data['oneSignalPlayerId']
    currentTimeTs = req_data['currentTimeTs']
    currentTimeReadableTs = req_data['currentTimeReadableTs']

    msg = '''
           The user_id value is: {}
           The oneSignalPlayerId value is: {}
           The currentTimeTs version is: {}
           The currentTimeReadableTs is: {}'''.format(user_id, oneSignalPlayerId, currentTimeTs, currentTimeReadableTs)

    db = mysql.connect(
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = "helloworld",
        database = "SARAApp"
    )
    cursor = db.cursor()
    insert_stmt = (
      "INSERT INTO user_ids (user_id, oneSignalPlayerId, currentTimeTs, currentTimeReadableTs) "
      "VALUES (%s, %s, %s, %s)"
    )
    data = (user_id, oneSignalPlayerId, currentTimeTs, currentTimeReadableTs)
    #data = (user_id, oneSignalPlayerId, currentTimeReadableTs)
    cursor.execute(insert_stmt, data)

    ## to make final output we have to run the 'commit()' method of the database object
    db.commit()

    response_data = { "result": msg,"sucess": True, "status_code": 200}
    return jsonify(response_data)

#===========================================================================================
@app.route('/store-survey-completed', methods=['POST']) #GET requests will be blocked
def store_survey_completed():
    req_data = request.get_json()
    print(req_data)
    user_id = req_data['user_id']
    dateString = req_data['dataString']
    whenCompletedTs = req_data['whenCompletedTs']
    whenCompletedReadableTs = req_data['whenCompletedReadableTs']

    msg = '''
           The user_id value is: {}
           The dateString value is: {}
           The currentTimeTs version is: {}
           The currentTimeReadableTs is: {}'''.format(user_id, dateString, whenCompletedTs, whenCompletedReadableTs)

    db = mysql.connect(
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = "helloworld",
        database = "SARAApp"
    )
    cursor = db.cursor()
    insert_stmt = (
      "INSERT INTO survey_completed (user_id, dateString, whenCompletedTs, whenCompletedReadableTs) "
      "VALUES (%s, %s, %s, %s)"
    )
    data = (user_id, dateString, whenCompletedTs, whenCompletedReadableTs)
    #data = (user_id, oneSignalPlayerId, currentTimeReadableTs)
    cursor.execute(insert_stmt, data)

    ## to make final output we have to run the 'commit()' method of the database object
    db.commit()

    response_data = { "result": msg,"sucess": True, "status_code": 200}
    return jsonify(response_data)


#===========================================================================================
@app.route('/get-inspirational-quote', methods=['POST']) #GET requests will be blocked
def get_inspirational_quotes():
    req_data = request.get_json()
    # print(req_data)
    user_id = req_data['user_id']

    # data = []
    # sample1 = {"author":"Beyonce", "image":"beyonce.png", "quote_text" : "It's not about perfection. It's about purpose."}
    # sample2  = {"author":"Casey Neistat", "image":"Casey_Neistat.png", "quote_text" : "The most dangerous thing you can do in life is play it safe."}
    # data.append(sample1)
    # data.append(sample2)

    db = mysql.connect(
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = "helloworld",
        database = "SARAApp"
    )

    cursor = db.cursor()
    cursor.execute("SELECT author_image, author_name, quote_text, date FROM 4PMNotifications where user_id='" + user_id +"' order by whenSentTs DESC")
    result = cursor.fetchall()

    data = []
    for quoteRecord in result:
        quote = {"author": quoteRecord[1], "image": quoteRecord[0].split('/')[1], "quote_text" : quoteRecord[2], "date": quoteRecord[3]}
        data.append(quote)

    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response

#===========================================================================================


@app.route('/json-example', methods=['POST']) #GET requests will be blocked
def json_example():
    req_data = request.get_json()
    print(req_data)
    language = req_data['language']
    framework = req_data['framework']
    python_version = req_data['version_info']['python'] #two keys are needed because of the nested object
    example = req_data['examples'][0] #an index is needed because of the array
    boolean_test = req_data['boolean_test']

    return '''
           The language value is: {}
           The framework value is: {}
           The Python version is: {}
           The item at index 0 in the example list is: {}
           The boolean value is: {}'''.format(language, framework, python_version, example, boolean_test)
