#
# HTTP Post, REST api and Python tutorial
# ---- HTTP POST vs GET: https://www.w3schools.com/tags/ref_httpmethods.asp 
# ---- REST Api tutorial: https://www.w3schools.in/restful-web-services/intro/ 
# ---- The Python requests library: https://requests.readthedocs.io/en/master/user/quickstart/
# 
#
# OneSignal REST api for sending push notifications
# ---- https://documentation.onesignal.com/reference/create-notification
#

import requests
import json
import pandas as pd
from getConfig_oneSignal import AUTHORIZATION_ID, ONE_SIGNAL_APP_ID


IMAGE_LOCATION = "https://aws-website-sara-ubicomp-h28yp.s3.amazonaws.com/sarapp/"


def sendOneSignalNotifications(self, player_id, response_time, response):
	time = "6:00 AM"
    notification_type = "Harvard test"
    heading = "Harvard test title"
    notification_text = "Harvard notification text"
    notification_image = 'fishjournal.png'

    if response == "yes":
    	payload_text = "sample therapeutic notification for yes"

    elif response == "no":
    	payload_text = "sample therapeutic notification for no"
    #Just change payload text
    #If user response is yes, then send yes message

    header = {"Content-Type": "application/json; charset=utf-8",
        "Authorization": AUTHORIZATION_ID}

    payload = {"app_id": ONE_SIGNAL_APP_ID,
    	"include_player_ids": player_id,
        "headings": {"en": heading},
        "contents": {"en": payload_text}, 
        "large_icon": IMAGE_LOCATION + notification_image,
        "ios_attachments": {"id": IMAGE_LOCATION + notification_image},
        "android_visibility": 0,
        "android_accent_color": "FF0000FF",
        "data": {"user": "test", "type": "4PM"},
        "ios_badgeCount": 1,
        "collapse_id": "", 
        "delivery_time_of_day": time,
        "ttl" : 259200,
        "priority": 10,
        "buttons": [{"id": "iLike", "text": "Like"}, {"id": "iNope", "text": "Nope"}]}

     #else:
     #If the date is not yesterday, then don't send message
     	#Return "Response not given"
           

    # https://www.w3schools.com/python/ref_requests_response.asp, checkout all the fields
    req = requests.post("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))       
    print(req.status_code, req.reason, req.text)
    #If 200, then successful
    print(req)

#Use api to get status
#--- uncomment the following line to send notification to everyone. If you want to send notification
# to a specific user, then slack Mash.
player_id = 'mash_aya'
response = 'yes'
sendOneSignalNotifications(player_id, "", response)
sendOneSignalNotifications()