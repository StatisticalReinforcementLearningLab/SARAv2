import requests
import json
import csv
import codecs
from random import randint
import zlib
import configparser


class SendOneSignalNotification:

    AUTHORIZATION_ID = ""
    ONE_SIGNAL_APP_ID = ""
    IMAGE_LOCATION = "https://s3.amazonaws.com/sara-public/notification_images/"

    def __init__(
        self,
        notification_text,
        heading,
        player_id,
        notification_type,
        notification_image,
    ):
        self.notification_image = notification_image
        self.notification_text = notification_text
        self.player_id = player_id
        self.heading = heading
        self.notification_type = notification_type
        self.user_id = "test"
        self.get_onesignal_config("./config.ini")

    def get_onesignal_config(self, config_file_path):
        # def get_key(config_file_path, section_id, key_id):
        self.AUTHORIZATION_ID = self.get_key(
            config_file_path, "ONE_SIGNAL_CONFIG", "AUTHORIZATION_ID"
        )
        self.ONE_SIGNAL_APP_ID = self.get_key(
            config_file_path, "ONE_SIGNAL_CONFIG", "ONE_SIGNAL_APP_ID"
        )

    def get_key(self, config_file_path, section_id, key_id):
        config = configparser.ConfigParser()
        config.read(config_file_path)

        if section_id not in config:
            raise ValueError("Section id " + section_id + " doesn't exist.")
        elif key_id not in config[section_id]:
            raise ValueError("Key id " + key_id + " doesn't exist.")
        else:
            return config[section_id][key_id]

    def addUserID(self, user_id):
        self.user_id = user_id

    # This is for test. Sends notification at 4PM.
    # No timezone correction is made.
    # sends to one specific player id.
    def sendOneSignalNotifications(self):

        header = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": self.AUTHORIZATION_ID,
        }

        payload = {
            "app_id": self.ONE_SIGNAL_APP_ID,
            "include_player_ids": [self.player_id],
            "headings": {"en": self.heading},
            "contents": {"en": self.notification_text},
            # "large_icon": self.IMAGE_LOCATION + self.notification_image,
            "big_picture": self.IMAGE_LOCATION + self.notification_image,
            "chrome_web_image": self.IMAGE_LOCATION + self.notification_image,
            "ios_attachments": {"id": self.IMAGE_LOCATION + self.notification_image},
            "android_visibility": 0,
            "android_accent_color": "FF0000FF",
            "data": {"user": "test", "type": "4PM"},
            "ios_badgeCount": 1,
            "collapse_id": self.notification_type,
            "ttl": 259200,
            "priority": 10,
            "buttons": [
                {"id": "iLike", "text": "Like"},
                {"id": "iNope", "text": "Nope"},
            ],
        }

        # "data": {"image": "author_image", "message": "quote_text", "author": "author_name", "type": notification_type, "url": update_url},
        # "buttons": [{"id": "iLike", "text": "Like"}, {"id": "iNope", "text": "Nope"}],
        # "delayed_option": "timezone",
        # "delivery_time_of_day": "6:00PM",

        # https://www.w3schools.com/python/ref_requests_response.asp, checkout all the fields
        req = requests.post(
            "https://onesignal.com/api/v1/notifications",
            headers=header,
            data=json.dumps(payload),
        )
        response = json.loads(req.text)
        print(req.status_code, req.reason, req.text)
        return req.status_code, response

    # This is for production.
    # A timezone correction is made.
    # Sends to everyone subscribed.
    # In the final version, for specific player ids, there will be a different randomization.
    def sendOneSignalNotificationsWithTZ(self, time_string):
        # print "demo notification"
        header = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": self.AUTHORIZATION_ID,
        }

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

        payload = {
            "app_id": self.ONE_SIGNAL_APP_ID,
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
            "ttl": 259200,
            "priority": 10,
            "delayed_option": "timezone",  # activates timezone adjustment
            "delivery_time_of_day": time_string,  # will be sent to the "time_string" time, on the specific timezone.
            "buttons": [
                {"id": "iLike", "text": "Like"},
                {"id": "iNope", "text": "Nope"},
            ],
        }

        # https://www.w3schools.com/python/ref_requests_response.asp, checkout all the fields
        req = requests.post(
            "https://onesignal.com/api/v1/notifications",
            headers=header,
            data=json.dumps(payload),
        )
        response = json.loads(req.text)
        print(req.status_code, req.reason, req.text)
        return req.status_code, response

    # This is for production.
    # A timezone correction is made.
    # Sends to everyone subscribed.
    # In the final version, for specific player ids, there will be a different randomization.
    def sendOneSignalNotificationsWithTZWithID(self, time_string):
        # print "demo notification"
        header = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": self.AUTHORIZATION_ID,
        }

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

        payload = {
            "app_id": self.ONE_SIGNAL_APP_ID,
            "include_player_ids": [self.player_id],
            "headings": {"en": self.heading},
            "contents": {"en": self.notification_text},
            # "large_icon": self.IMAGE_LOCATION + self.notification_image,
            "ios_attachments": {"id": self.IMAGE_LOCATION + self.notification_image},
            "android_visibility": 0,
            "android_accent_color": "FF0000FF",
            "data": {"user": self.user_id, "type": time_string},
            "ios_badgeCount": 1,
            "collapse_id": self.notification_type,
            "ttl": 259200,
            "priority": 10,
            "delayed_option": "timezone",  # activates timezone adjustment
            "delivery_time_of_day": time_string,  # will be sent to the "time_string" time, on the specific timezone.
            "buttons": [
                {"id": "iLike", "text": "Like"},
                {"id": "iNope", "text": "Nope"},
            ],
        }

        # https://www.w3schools.com/python/ref_requests_response.asp, checkout all the fields
        req = requests.post(
            "https://onesignal.com/api/v1/notifications",
            headers=header,
            data=json.dumps(payload),
        )
        response = json.loads(req.text)
        print(req.status_code, req.reason, req.text)
        return req.status_code, response

    # This is for production.
    # A timezone correction is made.
    # Sends to everyone subscribed.
    # In the final version, for specific player ids, there will be a different randomization.
    def sendOneSignalNotificationsWithTZ(self, time_string):
        # print "demo notification"
        header = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": self.AUTHORIZATION_ID,
        }

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

        payload = {
            "app_id": self.ONE_SIGNAL_APP_ID,
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
            "ttl": 259200,
            "priority": 10,
            "delayed_option": "timezone",  # activates timezone adjustment
            "delivery_time_of_day": time_string,  # will be sent to the "time_string" time, on the specific timezone.
            "buttons": [
                {"id": "iLike", "text": "Like"},
                {"id": "iNope", "text": "Nope"},
            ],
        }

        # https://www.w3schools.com/python/ref_requests_response.asp, checkout all the fields
        req = requests.post(
            "https://onesignal.com/api/v1/notifications",
            headers=header,
            data=json.dumps(payload),
        )
        response = json.loads(req.text)
        print(req.status_code, req.reason, req.text)
        return req.status_code, response

    # This is for production.
    # A timezone correction is made.
    # Sends to everyone subscribed.
    # In the final version, for specific player ids, there will be a different randomization.
    def sendOneSignalNotificationsWithoutID(self):
        # print "demo notification"
        header = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": self.AUTHORIZATION_ID,
        }

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

        payload = {
            "app_id": self.ONE_SIGNAL_APP_ID,
            "contents": {
                "en": "We showed that we are united and that we young people are unstoppable."
            },
            "included_segments": ["Active Users", "Inactive Users"],
            "data": {"user": "test"},
            "ttl": 259200,
            "priority": 10,
            "buttons": [
                {"id": "iLike", "text": "Like"},
                {"id": "iNope", "text": "Nope"},
            ],
        }

        # https://www.w3schools.com/python/ref_requests_response.asp, checkout all the fields
        req = requests.post(
            "https://onesignal.com/api/v1/notifications",
            headers=header,
            data=json.dumps(payload),
        )
        response = json.loads(req.text)
        # print(req.status_code, req.reason, req.text)
        return req.status_code, response

    def test_onesignal_connection(self):
        status_code, response = self.sendOneSignalNotificationsWithoutID()
        assert status_code == 200, str(response)

"""
quote_text = "We showed that we are united and that we young people are unstoppable."
author = "Greta Thunberg"
# "1b25a9e4-e1f4-4c5c-83e9-ef74fc2e369f"
# player_id = "1b25a9e4-e1f4-4c5c-83e9-ef74fc2e369f" # mash_android
# player_id = "78dbc48a-735a-4a5f-9490-0f6b1024e169"
player_id = "34b8d11d-ff86-4feb-bbe7-ff5fe11c964f"
p1 = SendOneSignalNotification(quote_text, "Quote from " + author, player_id, 'demo','engagement_images/greta_thunberg.png')
p1.sendOneSignalNotifications() 
"""

if __name__ == "__main__":
    p1 = SendOneSignalNotification(
        "We showed that we are united and that we young people are unstoppable.",
        "Quote from test ",
        None,
        "demo",
        "engagement_images/greta_thunberg.png",
    )
    p1.test_onesignal_connection()
    pass
