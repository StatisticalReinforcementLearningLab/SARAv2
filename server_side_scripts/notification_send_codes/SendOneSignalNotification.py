import requests
import json
import csv
import codecs
from random import randint
import zlib

class SendOneSignalNotification:

    #
    # Dev
    # AUTHORIZATION_ID = "Basic ZjRkZDlmYjYtMTBmOC00MDRlLWExNzEtN2IzMjEzMThiMjYz"
    # ONE_SIGNAL_APP_ID = "f9c4370d-cbcb-4e6f-ab1f-25d1c41b8f3a"        

    # Chop production
    AUTHORIZATION_ID = "Basic MjBjMGQ0MzgtMDU5MS00OTJkLTgyMTItM2EwMjZlYTdjNzM4"
    ONE_SIGNAL_APP_ID = "de3580a2-4aae-42c4-87cf-2c319c2df0c3"

    IMAGE_LOCATION = "https://aws-website-sara-ubicomp-h28yp.s3.amazonaws.com/sarapp/"

    def __init__(self, notification_text, heading, player_id, notification_type, notification_image):
        self.notification_image = notification_image
        self.notification_text = notification_text
        self.player_id = player_id
        self.heading = heading
        self.notification_type = notification_type
        self.user_id = 'test'

    def addUserID(self, user_id):
        self.user_id = user_id

    # This is for test. Sends notification at 4PM. 
    # No timezone correction is made.
    # sends to one specific player id.
    def sendOneSignalNotifications(self):
        #print "demo notification"
        header = {"Content-Type": "application/json; charset=utf-8",
                "Authorization": self.AUTHORIZATION_ID}

        payload = {"app_id": self.ONE_SIGNAL_APP_ID,
                "include_player_ids": [self.player_id],
                "headings": {"en": self.heading},
                "contents": {"en": self.notification_text}, 
                "large_icon": self.IMAGE_LOCATION + self.notification_image,
                "ios_attachments": {"id": self.IMAGE_LOCATION + self.notification_image},
                "android_visibility": 0,
                "android_accent_color": "FF0000FF",
                "data": {"user": "test", "type": "4PM"},
                "ios_badgeCount": 1,
                "collapse_id": self.notification_type, 
                "ttl" : 259200,
                "priority": 10,
                "buttons": [{"id": "iLike", "text": "Like"}, {"id": "iNope", "text": "Nope"}]}

               #"data": {"image": "author_image", "message": "quote_text", "author": "author_name", "type": notification_type, "url": update_url},
               #"buttons": [{"id": "iLike", "text": "Like"}, {"id": "iNope", "text": "Nope"}],
               #"delayed_option": "timezone",
               #"delivery_time_of_day": "6:00PM",
               

        # https://www.w3schools.com/python/ref_requests_response.asp, checkout all the fields
        req = requests.post("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))           
        print(req.status_code, req.reason, req.text)
        print(req)


    # This is for production.
    # A timezone correction is made.
    # Sends to everyone subscribed.
    # In the final version, for specific player ids, there will be a different randomization.
    def sendOneSignalNotificationsWithTZ(self,time_string):
        #print "demo notification"
        header = {"Content-Type": "application/json; charset=utf-8",
                "Authorization": self.AUTHORIZATION_ID}

        """
        payload = {"app_id": self.ONE_SIGNAL_APP_ID,
                "include_player_ids": [self.player_id],
                "headings": {"en": self.heading},
                "contents": {"en": self.notification_text}, 
                "large_icon": self.IMAGE_LOCATION + self.notification_image,
                "android_visibility": 0,
                "android_accent_color": "FF0000FF",
                "delayed_option": "timezone",
                "delivery_time_of_day": time_string,
                "buttons": [{"id": "iLike", "text": "Like"}, {"id": "iNope", "text": "Nope"}]}
        """

        payload = {"app_id": self.ONE_SIGNAL_APP_ID,
                "headings": {"en": self.heading},
                "contents": {"en": self.notification_text}, 
                "large_icon": self.IMAGE_LOCATION + self.notification_image,
                "ios_attachments": {"id": self.IMAGE_LOCATION + self.notification_image},
                "android_visibility": 0,
                "android_accent_color": "FF0000FF",
                "included_segments": ["Active Users", "Inactive Users"],
                "data": {"user": "test", "type": time_string},
                "ios_badgeCount": 1,
                "collapse_id": self.notification_type, 
                "ttl" : 259200,
                "priority": 10,
                "delayed_option": "timezone", #activates timezone adjustment
                "delivery_time_of_day": time_string, # will be sent to the "time_string" time, on the specific timezone. 
                "buttons": [{"id": "iLike", "text": "Like"}, {"id": "iNope", "text": "Nope"}]}

        # https://www.w3schools.com/python/ref_requests_response.asp, checkout all the fields
        req = requests.post("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))           
        print(req.status_code, req.reason, req.text)
        print(req)

    # This is for production.
    # A timezone correction is made.
    # Sends to everyone subscribed.
    # In the final version, for specific player ids, there will be a different randomization.
    def sendOneSignalNotificationsWithTZWithID(self,time_string):
        #print "demo notification"
        header = {"Content-Type": "application/json; charset=utf-8",
                "Authorization": self.AUTHORIZATION_ID}

        """
        payload = {"app_id": self.ONE_SIGNAL_APP_ID,
                "include_player_ids": [self.player_id],
                "headings": {"en": self.heading},
                "contents": {"en": self.notification_text}, 
                "large_icon": self.IMAGE_LOCATION + self.notification_image,
                "android_visibility": 0,
                "android_accent_color": "FF0000FF",
                "delayed_option": "timezone",
                "delivery_time_of_day": time_string,
                "buttons": [{"id": "iLike", "text": "Like"}, {"id": "iNope", "text": "Nope"}]}
        """

        payload = {"app_id": self.ONE_SIGNAL_APP_ID,
                "include_player_ids": [self.player_id],
                "headings": {"en": self.heading},
                "contents": {"en": self.notification_text}, 
                "large_icon": self.IMAGE_LOCATION + self.notification_image,
                "ios_attachments": {"id": self.IMAGE_LOCATION + self.notification_image},
                "android_visibility": 0,
                "android_accent_color": "FF0000FF",
                "data": {"user": self.user_id, "type": time_string},
                "ios_badgeCount": 1,
                "collapse_id": self.notification_type, 
                "ttl" : 259200,
                "priority": 10,
                "delayed_option": "timezone", #activates timezone adjustment
                "delivery_time_of_day": time_string, # will be sent to the "time_string" time, on the specific timezone. 
                "buttons": [{"id": "iLike", "text": "Like"}, {"id": "iNope", "text": "Nope"}]}

        # https://www.w3schools.com/python/ref_requests_response.asp, checkout all the fields
        req = requests.post("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))           
        print(req.status_code, req.reason, req.text)
        print(req)



'''
quote_text = "We showed that we are united and that we young people are unstoppable."
author = "Greta Thunberg"
player_id = "526dbc76-5d3b-471d-ac09-82f43e7fb38c"
p1 = SendOneSignalNotification(quote_text, "Quote from " + author, player_id, 'demo','engagement_images/greta_thunberg.png')
p1.sendOneSignalNotifications()
'''
