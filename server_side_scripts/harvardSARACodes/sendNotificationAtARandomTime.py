import requests
import json
import random
from random import uniform

#
AUTHORIZATION_ID = "Basic ZjRkZDlmYjYtMTBmOC00MDRlLWExNzEtN2IzMjEzMThiMjYz"
ONE_SIGNAL_APP_ID = "f9c4370d-cbcb-4e6f-ab1f-25d1c41b8f3a"
IMAGE_LOCATION = "https://aws-website-sara-ubicomp-h28yp.s3.amazonaws.com/sarapp/"


def sendOneSignalNotifications(heading, notification_image, notification_text, notification_type, player_id, time_string):
    
    header = {"Content-Type": "application/json; charset=utf-8",
        "Authorization": AUTHORIZATION_ID}

    payload = {"app_id": ONE_SIGNAL_APP_ID,
        "include_player_ids": [player_id],
        "headings": {"en": heading},
        "contents": {"en": notification_text}, 
        "large_icon": IMAGE_LOCATION + notification_image,
        "ios_attachments": {"id": IMAGE_LOCATION + notification_image},
        "android_visibility": 0,
        "android_accent_color": "FF0000FF",
        "data": {"user": "test", "time_to_notify": time_string},
        "ios_badgeCount": 1,
        "collapse_id": notification_type, 
        "ttl" : 259200,
        "priority": 10,
        "delayed_option": "timezone", #activates timezone adjustment
        "delivery_time_of_day": time_string,
        "buttons": [{"id": "iLike", "text": "Like"}, {"id": "iNope", "text": "Nope"}]}
           
    req = requests.post("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))       
    print(req.status_code, req.reason, req.text)
    print(req)


def sendNotification():
    
    notification_type = "Harvard test"
    heading = "Harvard test title"
    notification_text = "Harvard notification text"
    notification_image = 'fishjournal.png'
    player_id = 'a1a238ba-8304-44da-ae4e-76d68df60e4d'
    
    # 'random.randint' includes the endpoint
    time_to_notify = str(random.randint(9,23)).zfill(2) + ":" + str(random.randint(0,59)).zfill(2)
    print(time_to_notify)


    rand = uniform(0,1)
    if rand < 0.9:
        #
        sendOneSignalNotifications(heading, notification_image, notification_text, notification_type, player_id, time_to_notify)
        # pass
    



sendNotification()