from flask import Flask, request
import mysql.connector as mysql
import datetime
import boto3
import json

from helper_functions import get_sql_config_from_json, get_S3_config_from_json

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

# POST form: 
# * username
# * date (optional)
@app.route('/list_available_plots', methods = ['POST'])
def show_plots():
    # get form elements
    try: # username 
        userid = request.form["username"]
    except KeyError:
        return("please include username")
    try: # date 
        date = request.form['date']
        try: # validate date in correct format
            datetime.datetime.strptime(date, '%Y-%m-%d')
        except ValueError:
            return("Incorrect data format, should be YYYY-MM-DD")
    except KeyError:
        date = datetime.date.today().strftime("%Y-%m-%d") # today's date (SHOULD THIS BE YESTERDAY'S DATE?)

    # list from database
    mysql_connect_object = get_sql_config_from_json('config/saraSqlConfig.json')
    db = mysql.connect(
        host = mysql_connect_object["host"],
        port = mysql_connect_object["port"],
        user = mysql_connect_object["user"],
        passwd = mysql_connect_object["passwd"],
        database = mysql_connect_object["database"]
    )
    cursor = db.cursor()
    cursor.execute("select time_created, type, num_data_points, s3_key from insights where DATE(time_created) = %s AND uid = %s", (date, userid))
    columns = [col[0] for col in cursor.description]
    rows = [dict(zip(columns, row)) for row in cursor.fetchall()]

    result = {'data':rows, 'username':userid, 'date':date}
    return(result)

# gets the plot via s3 key
# POST: 
# * s3_key
@app.route('/get_plot', methods = ['POST'])
def get_plot():
    try: 
        s3_key = request.form['s3-key']
    except KeyError: 
        return("s3-key required")
        
    # search s3 bucket for today's plot
    bucket = 'sara-dev-data-storage'
    s3_connect_object = get_S3_config_from_json("config/aws_config.json")
    client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 

    try: 
        plot_obj = client.get_object(Bucket = bucket, Key = s3_key)
    except: 
        return("An error occured when retrieving a graph from S3. Please contact research administrators.")
    
    data = plot_obj['Body']
    return(data.read())


# Gets the latest plot for a user, or a plot at a date if specified
# username
# plot-type
# date (optional)
@app.route('/get_daily_plot', methods = ['POST'])
def show_daily_plot(): 
    # get form elements
    try: # username 
        userid = request.form["username"]
    except KeyError:
        return("please include username")
    try: #plot type
        plot_type = request.form["plot-type"]
    except KeyError: 
        return("please include plot-type")
    try: # date 
        date = request.form['date']
        try: # validate date in correct format
            datetime.datetime.strptime(date, '%Y-%m-%d')
        except ValueError:
            return("Incorrect data format, should be YYYY-MM-DD")
    except KeyError:
        date = datetime.date.today().strftime("%Y-%m-%d") # today's date (SHOULD THIS BE YESTERDAY'S DATE?)
  
    # search database for this graph 
    mysql_connect_object = get_sql_config_from_json('config/saraSqlConfig.json')
    db = mysql.connect(
        host = mysql_connect_object["host"],
        port = mysql_connect_object["port"],
        user = mysql_connect_object["user"],
        passwd = mysql_connect_object["passwd"],
        database = mysql_connect_object["database"]
    )
    cursor = db.cursor()
    cursor.execute("select s3_key from insights where DATE(time_created) = %s AND uid = %s AND type=%s", (date, userid, plot_type))
    keys = cursor.fetchall()

    if(len(keys) == 0): # no results
        # Ask Eura to get a demo plot here.
        return("no plots exist for the specified fields")
    else: 
        s3_key = keys[0][0]
        
        # search s3 bucket for today's plot
        bucket = 'sara-dev-data-storage'
        s3_connect_object = get_S3_config_from_json("config/aws_config.json")
        client = boto3.client("s3", region_name = s3_connect_object['AWS_REGION_NAME'], aws_access_key_id=s3_connect_object['AWS_ACCESS_KEY'], aws_secret_access_key=s3_connect_object['AWS_SECRET_KEY']) 

        try: 
            plot_obj = client.get_object(Bucket = bucket, Key = s3_key)
        except: 
            return("An error occured when retrieving a graph from S3. Please contact research administrators.")
        
        data = plot_obj['Body']
        return(data.read())



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port = 5100)
