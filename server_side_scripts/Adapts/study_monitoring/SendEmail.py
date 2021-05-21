import boto3
from botocore.exceptions import ClientError
import json
import pdb
import time
import datetime
def parse_money_history(money_tracking_data):
        on_dates = money_tracking_data["userinfo_for_admin"]["onDates"]
        total_money_history = money_tracking_data["trackingInfo"]["totalMoneyForDay"]


        first_day = [date_ for date_ in total_money_history[0].keys()][0]
        last_day = [date_ for date_ in total_money_history[-1].keys()][0]

        total_money_history_dict = {}
        for money_record in total_money_history:
            date_string = [date_ for date_ in money_record.keys()][0]
            money_on_date = money_record[date_string]
            total_money_history_dict[date_string] = money_on_date
        total_money_history = total_money_history_dict

        #decrement date from last to first date
        current_day = last_day
        NUMBER_OF_DAYS_TO_LOOK = 7
        number_of_days_looked = 0
        while first_day != last_day:
            current_date_obj = datetime.datetime.strptime(current_day, '%Y%m%d')
            
            #previous_date_obj = current_date_obj - datetime.timedelta(days=1)
            #previous_day = previous_date_obj.strftime('%Y-%m-%d')

            two_day_ago_date_obj = current_date_obj - datetime.timedelta(days=2)
            two_day_ago = two_day_ago_date_obj.strftime('%Y%m%d')

            if (current_day in total_money_history)and (two_day_ago in total_money_history):
                if (total_money_history[current_day] - total_money_history[two_day_ago]) >= 3:
                    return (-1, f"Wrong money amount between {current_day} and {two_day_ago}")
            
            previous_date_obj = current_date_obj - datetime.timedelta(days=1)
            previous_day = previous_date_obj.strftime('%Y%m%d')
            current_day = previous_day
            # print(current_day)

            number_of_days_looked = number_of_days_looked + 1
            if number_of_days_looked == NUMBER_OF_DAYS_TO_LOOK:
                break
            

        return (0, f"Money correctly allocated from {current_day} to {last_day} (last of money record)")


filename = "./demo_money_history.json"
with open(filename) as json_file:
    data = json.load(json_file)
    print(parse_money_history(data))



def send_email(): 

    # Replace sender@example.com with your "From" address.
    # This address must be verified with Amazon SES.
    SENDER = "Mashfiqui Rabbi <mashfiqui.r.s@gmail.com>"

    # Replace recipient@example.com with a "To" address. If your account 
    # is still in the sandbox, this address must be verified.
    RECIPIENT = "mashfiqui.rabbi@gmail.com"

    # Specify a configuration set. If you do not want to use a configuration
    # set, comment the following variable, and the 
    # ConfigurationSetName=CONFIGURATION_SET argument below.
    # CONFIGURATION_SET = "ConfigSet"

    # If necessary, replace us-west-2 with the AWS Region you're using for Amazon SES.
    AWS_REGION = "us-east-1"

    # The subject line for the email.
    SUBJECT = "Study Monitoring update"

    # The email body for recipients with non-HTML email clients.
    BODY_TEXT = ("Amazon SES Test (Python)\r\n"
                "This email was sent with Amazon SES using the "
                "AWS SDK for Python (Boto)."
                )
                
    # The HTML body of the email.
    BODY_HTML = """<html>
    <head></head>
    <body>
    <h1>Amazon SES Test (SDK for Python)</h1>
    <p>This email was sent with
        <a href='https://aws.amazon.com/ses/'>Amazon SES</a> using the
        <a href='https://aws.amazon.com/sdk-for-python/'>
        AWS SDK for Python (Boto)</a>.</p>
    </body>
    </html>
                """            

    # The character encoding for the email.
    CHARSET = "UTF-8"

    # Create a new SES resource and specify a region.
    client = boto3.client('ses',region_name=AWS_REGION)

    # Try to send the email.
    try:
        #Provide the contents of the email.
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    RECIPIENT,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': BODY_HTML,
                    },
                    'Text': {
                        'Charset': CHARSET,
                        'Data': BODY_TEXT,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': SUBJECT,
                },
            },
            Source=SENDER #,
            # If you are not using a configuration set, comment or delete the
            # following line
            # ConfigurationSetName=CONFIGURATION_SET,
        )
    # Display an error if something goes wrong.	
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])


