import mysql.connector as mysql
import requests
import json
from sara.connectors.connectors import connect_to_database, create_boto_resource 

AUTHORIZATION_ID = "Basic YWRmMDQyMDctNmFiNi00NGJhLWFjZDUtODkzYWJkMmY2ZTdi"
ONE_SIGNAL_APP_ID = "24af4904-c720-4965-a74f-15410764dd72"        

def view_onesignal_notification(notification_id): 
    '''
    returns all of th onesignal data about a given notification. See 'https://documentation.onesignal.com/reference/view-notification'
    for more info on the fields.
    '''
    header = {"Content-Type": "application/json; charset=utf-8",
            "Authorization": AUTHORIZATION_ID}

    payload = {"app_id": ONE_SIGNAL_APP_ID}

    # https://www.w3schools.com/python/ref_requests_response.asp, checkout all the fields
    req = requests.get("https://onesignal.com/api/v1/notifications/{}".format(notification_id), headers=header, params = payload)
    response = json.loads(req.text)
    if req.status_code != 200: 
        print("Something went wrong in retrieving {} data...".format(notification_id))
    response = json.loads(req.text)
    return req.status_code, response

# connect to database
db = connect_to_database("study")
cursor = db.cursor()

# select notifications we haven't observed result for
cursor.execute('SELECT notification_id FROM notifications WHERE notification_id != "NULL";')
untracked_notifications = [row[0] for row in cursor.fetchall()]
print("Untracked notifications: ", untracked_notifications)

# follow up on each notification with onesignal
for notif in untracked_notifications: 
    status, result = view_onesignal_notification(notif)
    print(result, "\n")
    #if status == 200: # got info
        #response = 

