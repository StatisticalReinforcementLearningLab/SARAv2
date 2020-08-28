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
from getConfig_oneSignal import AUTHORIZATION_ID, ONE_SIGNAL_APP_ID, IMAGE_LOCATION

def createOneSignalMessage(response):
    response = response.strip()
    if response == "yes":
        payload_text = "sample therapeutic notification for yes"

    elif response == "no":
        payload_text = "sample therapeutic notification for no"


    return payload_text

def sendOneSignalNotifications(player_id, payload_text):
    time = "6:00 AM"
    notification_type = "Harvard test"
    heading = "Harvard test title"
    notification_text = "Harvard notification text"
    notification_image = 'fishjournal.png'

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
        #"delivery_time_of_day": time,
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

# Testing
if __name__ == '__main__':
    #Use api to get status
    response = 'no'
    player_id = ['a1a238ba-8304-44da-ae4e-76d68df60e4d']

    payload_text = createOneSignalMessage('response_time', response)
    sendOneSignalNotifications(player_id, payload_text)
    #sendOneSignalNotifications()