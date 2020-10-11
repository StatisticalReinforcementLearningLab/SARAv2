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

#
AUTHORIZATION_ID = "Basic ZjRkZDlmYjYtMTBmOC00MDRlLWExNzEtN2IzMjEzMThiMjYz"
ONE_SIGNAL_APP_ID = "f9c4370d-cbcb-4e6f-ab1f-25d1c41b8f3a"
IMAGE_LOCATION = "https://aws-website-sara-ubicomp-h28yp.s3.amazonaws.com/sarapp/"


def sendOneSignalNotifications():

    notification_type = "Harvard test"
    heading = "Harvard test title"
    notification_text = "Harvard notification text"
    notification_image = 'fishjournal.png'
    
    header = {"Content-Type": "application/json; charset=utf-8",
        "Authorization": AUTHORIZATION_ID}

    payload = {"app_id": ONE_SIGNAL_APP_ID,
        "included_segments": ["Active Users", "Inactive Users"],
        "headings": {"en": heading},
        "contents": {"en": notification_text}, 
        "large_icon": IMAGE_LOCATION + notification_image,
        "ios_attachments": {"id": IMAGE_LOCATION + notification_image},
        "android_visibility": 0,
        "android_accent_color": "FF0000FF",
        "data": {"user": "test", "type": "4PM"},
        "ios_badgeCount": 1,
        "collapse_id": "", 
        "ttl" : 259200,
        "priority": 10,
        "buttons": [{"id": "iLike", "text": "Like"}, {"id": "iNope", "text": "Nope"}]}
           

    # https://www.w3schools.com/python/ref_requests_response.asp, checkout all the fields
    req = requests.post("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))       
    print(req.status_code, req.reason, req.text)
    print(req)

#--- uncomment the following line to send notification to everyone. If you want to send notification
# to a specific user, then slack Mash.
# sendOneSignalNotifications()