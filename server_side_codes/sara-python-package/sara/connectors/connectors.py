import boto3
import json
import mysql.connector as mysql
import pkg_resources

def get_S3_config_from_json():
    """
    Loads full S3 connect object . Format of the JSON object 
    is the following:
        {
            "AWS_ACCESS_KEY":"AKIASR52SY45PVC",
            "AWS_SECRET_KEY":"6sbt6OV/Ovv0Ch0x1eW",
            "AWS_REGION_NAME":"us-east-1"
        }  
    """
    aws_config_file = pkg_resources.resource_filename('sara', 'config/aws_config.json')
    with open(aws_config_file) as f:
        s3_connect_object = json.load(f)
        
    return s3_connect_object

def create_boto_client():
    """
    Returns a boto3 client created using the credentials above.
    """
    s3_connect_object = get_S3_config_from_json()
    return boto3.client("s3", region_name = s3_connect_object["AWS_REGION_NAME"],
                            aws_access_key_id= s3_connect_object["AWS_ACCESS_KEY"],
                            aws_secret_access_key= s3_connect_object["AWS_SECRET_KEY"])

def connect_to_database(database):
    """
    Connects to sql database. Returns a db object.
    """

    sql_config_file = pkg_resources.resource_filename('sara', 'config/mysql_config.json')
    with open(sql_config_file) as f:
        mysql_connect_object = json.load(f)
        
    return mysql.connect(
        host = mysql_connect_object["DB_HOST"],
        port = mysql_connect_object["DB_PORT"],
        user = mysql_connect_object["DB_USER"],
        passwd = mysql_connect_object["DB_PASSWORD"],
        database = database
    )
    
def create_boto_resource():
    """
    Returns a boto3 resource created using the credentials above.
    """
    s3_connect_object = get_S3_config_from_json()
    return boto3.resource("s3", region_name = s3_connect_object["AWS_REGION_NAME"],
                            aws_access_key_id= s3_connect_object["AWS_ACCESS_KEY"],
                            aws_secret_access_key= s3_connect_object["AWS_SECRET_KEY"])
