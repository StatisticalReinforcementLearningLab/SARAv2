#!/usr/local/bin/python3
from flask_restful import Resource, reqparse
from flask import jsonify, request
from app.models import UserModel

# from models import UserModel
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    jwt_refresh_token_required,
    get_jwt_identity,
    get_raw_jwt,
)
import sys
import json
from time import strftime

import datetime
from app import app

import mysql.connector as mysql
import configparser

config = configparser.ConfigParser()
config.read("app/config.ini")
host = config.get("DATABASE", "HOST")
username = config.get("DATABASE", "USERNAME")
password = config.get("DATABASE", "PASSWORD")
dbname = config.get("DATABASE", "DB")
port = config.get("DATABASE", "PORT")

parser = reqparse.RequestParser()
parser.add_argument("username", help="This field cannot be blank", required=True)
parser.add_argument("password", help="This field cannot be blank", required=True)


class UserRegistration(Resource):
    def post(self):
        """
        Use post with the following host and json object
        host: HOSTNAME:PORT (e.g.,: http://example.com:5001/registration)
        json object:
        {
            "username": "admin14",
            "password": "admin14"
        }

        Python example:

            import requests

            url = "http://example.com/5001/registration"
            payload = "{\r\n    \"username\": \"admin14\",\r\n    \"password\": \"admin14\"\r\n}"
            headers = {
                'content-type': "application/json",
                'cache-control': "no-cache"
            }
            response = requests.request("POST", url, data=payload, headers=headers)
            
            print(response.text)

        """
        data = parser.parse_args()
        if UserModel.find_by_username(data["username"]):
            return {"message": "User {} already exists".format(data["username"])}
        new_user = UserModel(
            username=data["username"],
            password=UserModel.generate_hash(data["password"]),
            userinfo_for_admin=json.dumps(
                {
                    "isActive": False,
                    "isParent": False,
                    "onDates": [],
                    "numberTimesOn": 0,
                    "numberOnDays": 0,
                }
            ),
        )
        try:
            new_user.save_to_db()
            access_token = create_access_token(identity=data["username"])
            refresh_token = create_refresh_token(identity=data["username"])

            return (
                {
                    "message": "User {} was created".format(data["username"]),
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "access_expires": 900,
                    "refresh_expires": 2592000,
                },
                201,
                {"Access-Control-Allow-Origin": "*"},
            )
        except:
            return {"message": "Something went wrong"}, 500


class UserLogin(Resource):
    def post(self):
        req_data = request.get_json()
        req_headers = request.headers

        timestamp = strftime("[%Y-%b-%d %H:%M]")

        data = parser.parse_args()

        current_user = UserModel.find_by_username(data["username"])
        if not current_user:
            return {"message": "User {} doesn't exist".format(data["username"])}
        if UserModel.verify_hash(data["password"], current_user.password):
            expires24hrs = datetime.timedelta(hours=24)
            expires365days = datetime.timedelta(days=365)
            # token = create_access_token(username, expires_delta=expires)

            access_token = create_access_token(
                identity=data["username"], expires_delta=expires24hrs
            )
            # access_token = create_access_token(identity = data['username'])
            # refresh_token = create_refresh_token(identity = data['username'])
            refresh_token = create_refresh_token(
                identity=data["username"], expires_delta=expires365days
            )

            # user = get_jwt_identity();

            return (
                {
                    "message": "Logged in as {}".format(current_user.username),
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "access_expires": 86400,
                    "refresh_expires": 31536000,
                },
                201,
                {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
                },
            )

        else:
            return {"message": "Wrong credentials"}


class UserLogoutAccess(Resource):
    @jwt_required
    def post(self):
        jti = get_raw_jwt()["jti"]
        try:
            revoked_token = RevokedTokenModel(jti=jti)
            revoked_token.add()
            return {"message": "Access token has been revoked"}
        except:
            return {"message": "Something went wrong"}, 500


class UserLogoutRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()["jti"]
        try:
            revoked_token = RevokedTokenModel(jti=jti)
            revoked_token.add()
            return {"message": "Refresh token has been revoked"}
        except:
            return {"message": "Something went wrong"}, 500


class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)
        return {
            "access_token": access_token,
            "access_expires": 900,
            "user_name": current_user,
        }


# ===========================================================================================


class AllUsers(Resource):
    def get(self):
        return UserModel.return_all()

    def delete(self):
        return UserModel.delete_all()


class SecretResource(Resource):
    @jwt_required
    def get(self):
        return {"answer": 42}


# class UserData(Resource):
#    @jwt_required
#    def get(self):
#        current_user = get_jwt_identity()
#        user = UserModel.find_by_username(current_user)
#        return json.loads(user.userdata)

# class SetUserData(Resource):
#    @jwt_required
#    def post(self):
#        data = request.get_json()# good at this point
#        str_data = json.dumps(data)
#        current_user = get_jwt_identity()
#        user = UserModel.find_by_username(current_user)
#        success = UserModel.set_user_data(current_user, str_data)
# add case - how ot handle failure
#        return data


class UserInfo(Resource):
    @jwt_required
    def get(self):
        current_user = get_jwt_identity()
        user = UserModel.find_by_username(current_user)
        if not user.userinfo:
            #  return {'userName': ''}, 201, {'Access-Control-Allow-Origin': '*'}
            return {}, 201, {"Access-Control-Allow-Origin": "*"}
        else:
            return json.loads(user.userinfo), 201, {"Access-Control-Allow-Origin": "*"}

    @jwt_required
    def post(self):
        current_user = get_jwt_identity()
        user = UserModel.find_by_username(current_user)
        if not user.userinfo:
            #  return {'userName': ''}, 201, {'Access-Control-Allow-Origin': '*'}
            return {}, 201, {"Access-Control-Allow-Origin": "*"}
        else:
            return json.loads(user.userinfo), 201, {"Access-Control-Allow-Origin": "*"}


class UserInfoForAdmin(Resource):
    @jwt_required
    def get(self):
        current_user = get_jwt_identity()
        user = UserModel.find_by_username(current_user)
        # if not user.userinfo_for_admin:
        #  return {'userName': ''}, 201, {'Access-Control-Allow-Origin': '*'}
        # else:
        return (
            json.loads(user.userinfo_for_admin),
            201,
            {"Access-Control-Allow-Origin": "*"},
        )

    @jwt_required
    def post(self):
        data = request.get_json()  # good at this point
        str_data = json.dumps(data)
        current_user = get_jwt_identity()
        user = UserModel.find_by_username(current_user)
        success = UserModel.set_user_info_for_admin(current_user, str_data)
        # add case - how ot handle failure
        return data, 201, {"Access-Control-Allow-Origin": "*"}


class SetUserInfo(Resource):
    @jwt_required
    def post(self):
        data = request.get_json()  # good at this point
        str_data = json.dumps(data)
        current_user = get_jwt_identity()
        user = UserModel.find_by_username(current_user)
        success = UserModel.set_user_info(current_user, str_data)
        # add case - how ot handle failure
        return data, 201, {"Access-Control-Allow-Origin": "*"}


# class SetUserInfoForAdmin(Resource):
#    @jwt_required
#    def post(self):
#        data = request.get_json()# good at this point
#        str_data = json.dumps(data)
#        current_user = get_jwt_identity()
#        user = UserModel.find_by_username(current_user)
#        success = UserModel.set_user_info_for_admin(current_user, str_data)
##add case - how ot handle failure
#        return data , 201, {'Access-Control-Allow-Origin': '*'}


# ===========================================================================================
# endpoints related to notifications
##### ----- JSON store in the mysql
def insert_json_into_mysql_noti(json_string):
    db = mysql.connect(
        host=host, port=port, user=username, passwd=password, database=dbname
    )

    """
    {
        "PARTICIAPANT_ID": "test",
        "Notification_Id": "123456",
        "DATE": "12252019",
        "whenReceivedTs": 11,
        "whenReceivedReadableTs": "12252019",
        "typeOfNotification": "4PM",
        "JSON_dump": "{'test': 'yes'}",
        "device_type": "iPhone"
    }
    """

    req_data = request.get_json()
    cursor = db.cursor()
    insert_stmt = (
        "INSERT INTO SARA_Notifications (PARTICIAPANT_ID, DATE, Notification_Id, whenReceivedTs, whenReceivedReadableTs, typeOfNotification, JSON_dump, device_type) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    )
    data = (
        req_data["PARTICIAPANT_ID"],
        req_data["DATE"],
        req_data["Notification_Id"],
        req_data["whenReceivedTs"],
        req_data["whenReceivedReadableTs"],
        req_data["typeOfNotification"],
        req_data["JSON_dump"],
        req_data["device_type"],
    )
    cursor.execute(insert_stmt, data)

    ## to make final output we have to run the 'commit()' method of the database object
    db.commit()

    return cursor.rowcount


class AdaptsNotificationInsert(Resource):
    def post(self):
        req_data = request.get_json()
        return str(insert_json_into_mysql_noti(json.dumps(req_data)))


# ===========================================================================================

##### ----- JSON store in the mysql
def update_json_into_mysql_noti(json_string):
    db = mysql.connect(
        host=host, port=port, user=username, passwd=password, database=dbname
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
    data = (
        req_data["whenActedonTs"],
        req_data["whenActedonReadableTs"],
        req_data["typeOfAction"],
        req_data["Notification_Id"],
        req_data["PARTICIAPANT_ID"],
    )
    cursor.execute(update_stmt, data)

    ## to make final output we have to run the 'commit()' method of the database object
    db.commit()

    return cursor.rowcount


class AdaptsNotificationUpdate(Resource):
    def post(self):
        req_data = request.get_json()
        return str(update_json_into_mysql_noti(json.dumps(req_data)))


# ===========================================================================================


class StoreOnesignalId(Resource):
    def post(self):
        req_data = request.get_json()
        print(req_data)
        user_id = req_data["user_id"]
        oneSignalPlayerId = req_data["oneSignalPlayerId"]
        currentTimeTs = req_data["currentTimeTs"]
        currentTimeReadableTs = req_data["currentTimeReadableTs"]
        print("ENTERING STATEMENTS")

        msg = """
             The user_id value is: {}
             The oneSignalPlayerId value is: {}
             The currentTimeTs version is: {}
             The currentTimeReadableTs is: {}""".format(
            user_id, oneSignalPlayerId, currentTimeTs, currentTimeReadableTs
        )

        db = mysql.connect(
            host=host, port=port, user=username, passwd=password, database=dbname
        )
        cursor = db.cursor()
        insert_stmt = (
            "INSERT INTO user_ids (user_id, oneSignalPlayerId, currentTimeTs, currentTimeReadableTs) "
            "VALUES (%s, %s, %s, %s)"
        )
        data = (user_id, oneSignalPlayerId, currentTimeTs, currentTimeReadableTs)
        # data = (user_id, oneSignalPlayerId, currentTimeReadableTs)
        cursor.execute(insert_stmt, data)

        ## to make final output we have to run the 'commit()' method of the database object
        db.commit()

        response_data = {"result": msg, "sucess": True, "status_code": 200}
        return jsonify(response_data)


# ===========================================================================================


class StoreSurveyCompleted(Resource):
    def post(self):
        req_data = request.get_json()
        print(req_data)
        user_id = req_data["user_id"]
        dateString = req_data["dataString"]
        whenCompletedTs = req_data["whenCompletedTs"]
        whenCompletedReadableTs = req_data["whenCompletedReadableTs"]

        msg = """
             The user_id value is: {}
             The dateString value is: {}
             The currentTimeTs version is: {}
             The currentTimeReadableTs is: {}""".format(
            user_id, dateString, whenCompletedTs, whenCompletedReadableTs
        )

        db = mysql.connect(
            host=host, port=port, user=username, passwd=password, database=dbname
        )
        cursor = db.cursor()
        insert_stmt = (
            "INSERT INTO survey_completed (user_id, dateString, whenCompletedTs, whenCompletedReadableTs) "
            "VALUES (%s, %s, %s, %s)"
        )
        data = (user_id, dateString, whenCompletedTs, whenCompletedReadableTs)
        # data = (user_id, oneSignalPlayerId, currentTimeReadableTs)
        cursor.execute(insert_stmt, data)

        ## to make final output we have to run the 'commit()' method of the database object
        db.commit()

        response_data = {"result": msg, "sucess": True, "status_code": 200}
        return jsonify(response_data)


# ===========================================================================================


class GetInspirationalQuote(Resource):
    def post(self):
        req_data = request.get_json()
        # print(req_data)
        user_id = req_data["user_id"]

        # data = []
        # sample1 = {"author":"Beyonce", "image":"beyonce.png", "quote_text" : "It's not about perfection. It's about purpose."}
        # sample2  = {"author":"Casey Neistat", "image":"Casey_Neistat.png", "quote_text" : "The most dangerous thing you can do in life is play it safe."}
        # data.append(sample1)
        # data.append(sample2)

        db = mysql.connect(
            host=host, port=port, user=username, passwd=password, database=dbname
        )

        cursor = db.cursor()
        cursor.execute(
            "SELECT author_image, author_name, quote_text, date FROM 4PMNotifications where user_id='"
            + user_id
            + "' and is_sent = 1 order by whenSentTs DESC"
        )
        result = cursor.fetchall()

        data = []
        for quoteRecord in result:
            quote = {
                "author": quoteRecord[1],
                "image": quoteRecord[0].split("/")[1],
                "quote_text": quoteRecord[2],
                "date": quoteRecord[3],
            }
            data.append(quote)

        response = app.response_class(
            response=json.dumps(data), status=200, mimetype="application/json"
        )
        return response


# ===========================================================================================
class GetUnlockedIncentives(Resource):
    def post(self):
        req_data = request.get_json()
        # print(req_data)
        user_id = req_data["user_id"]
        incentive_type = req_data["incentive_type"]
        # data = []
        # sample1 = {"author":"Beyonce", "image":"beyonce.png", "quote_text" : "It's not about perfection. It's about purpose."}
        # sample2  = {"author":"Casey Neistat", "image":"Casey_Neistat.png", "quote_text" : "The most dangerous thing you can do in life is play it safe."}
        # data.append(sample1)
        # data.append(sample2)
        db = mysql.connect(
            host=host, port=port, user=username, passwd=password, database=dbname
        )

        cursor = db.cursor()
        # cursor.execute("SELECT user_id, incentiveString FROM SARAApp.UnlockedIncentive where user_id='" + user_id +"' and incentiveType = '" + incentive_type +"' order by whenInserted DESC limit 1")
        cursor.execute(
            "SELECT user_id, incentiveString FROM UnlockedIncentive where user_id='"
            + user_id
            + "' and incentiveType = '"
            + incentive_type
            + "' order by whenInserted DESC;"
        )
        # cursor.execute("SELECT author_image, author_name, quote_text, date FROM UnlockedIncentive where user_id='" + user_id +"' order by whenSentTs DESC")
        result = cursor.fetchall()
        # data = json.loads(result[0][1])
        allMemeData = {}
        duplicateTracker = {}
        duplicateTrackerForMemesFileNames = {}  # for filenames
        lastUpdatedUnixTs = 0
        lastUpdatedReadableTs = ""
        for memeRecord in result:
            unlockedMemeData = json.loads(memeRecord[1])
            if unlockedMemeData["last_updated"] > lastUpdatedUnixTs:
                lastUpdatedUnixTs = unlockedMemeData["last_updated"]
                lastUpdatedReadableTs = unlockedMemeData["last_updated_readable_ts"]
            if incentive_type == "meme":
                memeRecordInCurrentMemeReord = unlockedMemeData["unlocked_memes"]
            if incentive_type == "alt_msg":
                memeRecordInCurrentMemeReord = unlockedMemeData["unlocked_alt_msgs"]
            for singleMemeUnlockRecord in memeRecordInCurrentMemeReord:
                duplicateTrackerRecord = (
                    singleMemeUnlockRecord[u"unlock_date"]
                    + ","
                    + singleMemeUnlockRecord[u"filename"]
                )
                if duplicateTrackerRecord in duplicateTracker:
                    pass
                else:
                    if (
                        singleMemeUnlockRecord[u"filename"]
                        in duplicateTrackerForMemesFileNames
                    ):
                        pass
                    else:
                        duplicateTrackerForMemesFileNames[
                            singleMemeUnlockRecord[u"filename"]
                        ] = 0
                        allMemeData[
                            singleMemeUnlockRecord[u"unlock_date"]
                        ] = singleMemeUnlockRecord
                    duplicateTracker[duplicateTrackerRecord] = 0
        allMemeDataList = []
        for memeDataKey in sorted(allMemeData, reverse=True):
            allMemeDataList.append(allMemeData[memeDataKey])
        returnRecord = []
        if incentive_type == "meme":
            returnRecord = {
                "last_updated": lastUpdatedUnixTs,
                "last_updated_readable_ts": lastUpdatedReadableTs,
                "unlocked_memes": allMemeDataList,
            }
        if incentive_type == "alt_msg":
            returnRecord = {
                "last_updated": lastUpdatedUnixTs,
                "last_updated_readable_ts": lastUpdatedReadableTs,
                "unlocked_alt_msgs": allMemeDataList,
            }
        response = app.response_class(
            response=json.dumps(returnRecord), status=200, mimetype="application/json"
        )
        return response


# ===========================================================================================
class StoreUnlockedIncentives(Resource):
    def post(self):
        req_data = request.get_json()
        print(req_data)
        user_id = req_data["user_id"]
        incentiveString = req_data["incentiveString"]
        whenInsertedTs = req_data["whenInserted"]
        whenInsertedReadableTs = req_data["whenInsertedReadableTs"]
        incentiveType = req_data["incentiveType"]

        msg = """
             The user_id value is: {}
             The incentiveString value is: {}
             The whenInsertedTs version is: {}
             The whenInsertedReadableTs is: {}
             The incentiveType is: {}""".format(
            user_id,
            incentiveString,
            whenInsertedTs,
            whenInsertedReadableTs,
            incentiveType,
        )

        db = mysql.connect(
            host=host, port=port, user=username, passwd=password, database=dbname
        )
        cursor = db.cursor()
        insert_stmt = (
            "INSERT INTO UnlockedIncentive (user_id, incentiveString, whenInserted, whenInsertedReadableTs, incentiveType) "
            "VALUES (%s, %s, %s, %s, %s)"
        )
        data = (
            user_id,
            incentiveString,
            whenInsertedTs,
            whenInsertedReadableTs,
            incentiveType,
        )
        # data = (user_id, oneSignalPlayerId, currentTimeReadableTs)
        cursor.execute(insert_stmt, data)

        ## to make final output we have to run the 'commit()' method of the database object
        db.commit()

        response_data = {"result": msg, "sucess": True, "status_code": 200}
        return jsonify(response_data)
