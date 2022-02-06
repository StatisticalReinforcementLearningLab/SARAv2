#####################################################
#
# S3 stored CSV to message/notification buckets
#
#####################################################
import json
import boto3
import pandas as pd

# Notifications
def s3_csv_to_notification_list(filename):
    '''
    input: takes in the filename of a csv on the S3 under sara-template-data-storage/notification_options
    output: returns a list of notiifications, where each notification is a dictionary of {heading, body, image}
    '''
    with open('aws_config.json') as f:
            s3_connect_object = json.load(f)
    s3 = boto3.resource("s3", region_name = s3_connect_object["AWS_REGION_NAME"],
                                aws_access_key_id= s3_connect_object["AWS_ACCESS_KEY"],
                                aws_secret_access_key= s3_connect_object["AWS_SECRET_KEY"])
    content = s3.Object("sara-template-data-storage", "notification_options/" + filename).get()['Body']
    csv_df = pd.read_csv(content)

    notifications = []
    for index, row in csv_df.iterrows(): 
        notification = {}
        notification['heading'] = row['heading']
        notification['body'] = row['body']
        notification['image'] = row['image']
        notifications.append(notification)

    return notifications


######################################################
#
# Message buckets
#
######################################################

message_bucket_1 = {
    "description": "Attribute failure to controllable causes",
    "messages": {"message_1": "Sample message #1 from pool 1"},
}

message_bucket_2 = {
    "description": "Reinforcement or prize for self-monitoring",
    "messages": {
        "message_1": "Sample message #1 from pool 2",
        "message_2": "Sample message #2 from pool 2",
    },
}

message_bucket_3 = {
    "description": "Catch all message bucket",
    "messages": {
        "message_1": "Sample message #1 from catch all pool",
        "message_2": "Sample message #2 from catch all pool",
    },
}

######################################################
#
# States
#
######################################################

# sleep survey adherence
SLEEP_SURVEY_COUNT_RECENT_NO_OF_DAYS = 3
SLEEP_SURVEY_COUNT_RECENT_THRESHOLD = 0.66
SLEEP_SURVEY_COUNT_RECENT_LOW = 0
SLEEP_SURVEY_COUNT_RECENT_HIGH = 1

SLEEP_SURVEY_COUNT_OVERALL_NO_OF_DAYS = 14
SLEEP_SURVEY_COUNT_OVERALL_THRESHOLD = 0.5
SLEEP_SURVEY_COUNT_OVERALL_LOW = 2
SLEEP_SURVEY_COUNT_OVERALL_HIGH = 3

# sleep survey success
SLEEP_MONITORING_SUFFICIENT_SLEEP_HOURS = 7

SLEEP_MONITORING_RECENT_SUFFICEINT_SLEEP_NO_OF_DAYS = 3
SLEEP_MONITORING_RECENT_SUFFICEINT_SLEEP_THRESHOLD = 0.667
SLEEP_MONITORING_RECENT_SUFFICEINT_SLEEP_LOW = 4
SLEEP_MONITORING_RECENT_SUFFICEINT_SLEEP_HIGH = 5

SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_NO_OF_DAYS = 14
SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_THRESHOLD = 0.5
SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_LOW = 6
SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_HIGH = 7


# currently only the ANDs within an activation condition is supported
# Separate activation conditins are OR'ed
# You can create a specific message, or use an entire message pool
# ToDo: Add template string support.
states = []

state_1 = {
    "name": "state_1",
    "description": "Survey count is low. Overall sleep duration is also bad. Recent sufficient sleep is bad or no recent recent survey",
    "activation_conditions": [
        [
            SLEEP_SURVEY_COUNT_RECENT_LOW,
            SLEEP_SURVEY_COUNT_OVERALL_LOW,
            SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_LOW,
        ],
        [
            SLEEP_SURVEY_COUNT_RECENT_LOW,
            SLEEP_SURVEY_COUNT_OVERALL_LOW,
            SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_LOW,
            SLEEP_MONITORING_RECENT_SUFFICEINT_SLEEP_LOW,
        ],
    ],
    "messages": [
        "Message #1 giving support to participant ask to sel-report",
        "Message #2 supporting that sleep monitoring can improve their health",
        message_bucket_1["messages"]["message_1"],
        message_bucket_2,
    ],
    "notifications": [
        {
            "text": "Notification #1 State 1",
            "image": "image.png"
        }
    ] 
}
state_1['notifications'] = s3_csv_to_notification_list('state1.csv') 
states.append(state_1)

state_2 = {
    "name": "state_2",
    "description": "Survey count is low. Overall sleep duration is good. Recent sufficient sleep is bad or no recent recent survey",
    "activation_conditions": [
        [
            SLEEP_SURVEY_COUNT_RECENT_LOW,
            SLEEP_SURVEY_COUNT_OVERALL_LOW,
            SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_HIGH,
        ],
        [
            SLEEP_SURVEY_COUNT_RECENT_LOW,
            SLEEP_SURVEY_COUNT_OVERALL_LOW,
            SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_HIGH,
            SLEEP_MONITORING_RECENT_SUFFICEINT_SLEEP_LOW,
        ],
    ],
    "messages": [
        "Message #1 giving support to participant ask to sel-report",
        "Message #2 supporting that sleep monitoring can improve their health",
        message_bucket_1["messages"]["message_1"],
        message_bucket_2,
    ],
    "notifications": [
        "Notification #1  State 2"
    ]
}
state_2['notifications'] = s3_csv_to_notification_list('state2.csv') 
states.append(state_2)

# activate this state if not state is satisfied.
default_state = {
    "name": "default_state",
    "description": "Catch all state if no survey condition is satisfied",
    "activation_conditions": [
    ],
    "messages": [
        "Default state message #1",
        "Default state message #2",
        message_bucket_3
    ],
    "notifications": [
        "Catch all notification"
    ]
}
default_state['notifications'] = s3_csv_to_notification_list('default_state.csv') 
# Don't add default state to states. If states variable is empty then add default state manually.
# states.append(default_state)

print(default_state)
