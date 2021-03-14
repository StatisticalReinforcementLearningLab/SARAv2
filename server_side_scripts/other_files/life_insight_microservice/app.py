from flask import Flask, request
from datetime import datetime
import boto3
import json

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'


def get_S3_config_from_json(config_file_name):
    """
    Loads full S3 connect object . Format of the JSON object 
    is the following:
    
        {
            "AWS_ACCESS_KEY":"AKIASR52SY45PVC",
            "AWS_SECRET_KEY":"6sbt6OV/Ovv0Ch0x1eW",
            "AWS_REGION_NAME":"us-east-1"
        }  

    """
    with open(config_file_name) as f:
        s3_connect_object = json.load(f)
        
    return s3_connect_object

@app.route('/show_daily_plot', methods = ['GET'])
def show_daily_plot(): 

    # get username
    userid = request.args.get("username")
    if userid is None: 
        return("please include username")

    # get html plot for user and package.
    date = datetime.today().strftime('%Y-%m-%d') # today's date
    key = "altair_plots/" + userid + "_" + date + ".html"
    bucket = 'sara-dev-data-storage'

    # search s3 bucket for today's plot
    s3_connect_object = get_S3_config_from_json("config/aws_config.json")
    client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 
    
    search_response = client.list_objects_v2(
        Bucket=bucket,
        Prefix=key
    )

    if(int(search_response['KeyCount']) > 0): # plot exists
        plot_obj = client.get_object(
            Bucket=bucket,
            Key=key)
        data = plot_obj['Body']
        return(data.read())
    else: 
        # Ask Eura to get a demo plot here.
        return("plot does not exist for the day")



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port = 5100)
