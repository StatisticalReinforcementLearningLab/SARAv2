#!/usr/local/bin/python3
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import pymysql
from flask import has_request_context, request
import configparser

config = configparser.ConfigParser()
config.read('app/config.ini')
port = config.get('DATABASE', 'PORT')
host =  config.get('DATABASE', 'HOST')
username = config.get('DATABASE', 'USERNAME')
password = config.get('DATABASE', 'PASSWORD')
db = config.get('DATABASE', 'DB')

app = Flask(__name__)
CORS(app)

api = Api(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://' + username + ':' + password + '@' + host + ':' + port +  '/' + db
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'some-secret-string'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
app.config['CORS_HEADERS'] = 'Content-Type'

 
jwt = JWTManager(app)

app.config['JWT_BLOCKLIST_ENABLED'] = True
app.config['JWT_BLOCKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
app.config['PROPAGATE_EXCEPTIONS'] = True

#app.run(host="0.0.0.0")

@jwt.token_in_blacklist_loader
def check_if_token_in_blocklist(decrypted_token):
    jti = decrypted_token['jti']
    return models.RevokedTokenModel.is_jti_blocklisted(jti)


db = SQLAlchemy(app)
db.session.rollback()

@app.before_first_request
def create_tables():
    db.create_all()

from app import views, models, resources

api.add_resource(resources.UserRegistration, '/registration')
api.add_resource(resources.UserLogin, '/login')
api.add_resource(resources.UserLogoutAccess, '/logout/access')
api.add_resource(resources.UserLogoutRefresh, '/logout/refresh')
api.add_resource(resources.TokenRefresh, '/token/refresh')
api.add_resource(resources.AllUsers, '/users')
api.add_resource(resources.SecretResource, '/secret')
api.add_resource(resources.UserInfo, '/userinfo')
api.add_resource(resources.UserInfoForAdmin, '/userinfofixed')
api.add_resource(resources.SetUserInfo, '/setuserinfo')
#api.add_resource(resources.UserData, '/userdata')
#api.add_resource(resources.SetUserData, '/setuserdata')
api.add_resource(resources.AdaptsNotificationInsert, '/adapts-notification-insert')
api.add_resource(resources.AdaptsNotificationUpdate, '/adapts-notification-update')
api.add_resource(resources.StoreOnesignalId, '/store-onesignal-id')
api.add_resource(resources.StoreSurveyCompleted, '/store-survey-completed')
api.add_resource(resources.GetInspirationalQuote, '/get-inspirational-quote')
api.add_resource(resources.GetUnlockedIncentives, '/get-unlocked-incentive')
api.add_resource(resources.StoreUnlockedIncentives,'/store-unlocked-incentive')

# Enable HTTPS
import ssl
ctx = ssl.SSLContext(ssl.PROTOCOL_SSLv23)
ctx.load_cert_chain('/app/cert.pem', keyfile = '/app/key.pem', password="helloworld")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', ssl_context=ctx)
    #app.run(debug=True, host='0.0.0.0')
