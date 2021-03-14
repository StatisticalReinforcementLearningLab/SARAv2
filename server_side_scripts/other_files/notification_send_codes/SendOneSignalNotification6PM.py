import requests
import json
import csv
import codecs
from random import randint
from SendOneSignalNotification import SendOneSignalNotification

def send_reminder_notification(player_id):

    player_id = "526dbc76-5d3b-471d-ac09-82f43e7fb38c"

    heading = "Time to check in on ADAPTS"
    quote_text = "Your survey is now available"

    p1 = SendOneSignalNotification(quote_text, heading, player_id, 'reminder', 'fishjournal.png')
    #p1.sendOneSignalNotifications()

    #p1.sendOneSignalNotifications()
    p1.sendOneSignalNotificationsWithTZ('6:00PM')


# send_engagement_notifications()
import datetime
current_time = datetime.datetime.now()
if current_time.hour==0 and current_time.minute <30 and current_time.minute >=15:
    send_reminder_notification("file_player_id")
else:
    print("It is not time to send reminder notifications")
    with open("/home/ec2-user/SARA_modular/cron_reminder.txt", "a") as myfile:
        myfile.write("It is not time to send reminder notifications: " + current_time.strftime("%H:%M:%S") + "\n")




