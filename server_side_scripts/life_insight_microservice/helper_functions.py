import json
def get_sql_config_from_json(config_file_name):
    """
    Loads full mysql connect object from database returns the value as a JSON object. Format of the JSON object 
    is the following:
    
        {
            "host": "hostname.com",
            "port": 99999,
            "user": "root",
            "passwd": "passworkd",
            "database": "database_or_schema_name"
        }  
    """
    with open(config_file_name) as f:
        mysql_connect_object = json.load(f)
        
    return mysql_connect_object

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
