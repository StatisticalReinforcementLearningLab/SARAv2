import json
import mysql.connector as mysql
from datetime import date

ID_dict = {
    '36c38a8d-c6d7-48a7-88a5-5f9796b540b6':'mash_aya',
    '7134c8fb-07e9-4075-b3a9-8a0443f9d7a7':'someone',
    '28b8526c-3666-4baf-9a71-6896e836961e':'phillip_sara',
    '38ce91a4-0cb5-43bf-9e35-60da0202662a':'eura_aya',
    'f106b7a4-3bc6-4ff7-9152-07e58edbbc23':'sarah_sara',
    'dc9a9420-bb22-40a3-8285-6e73594e88b8':'chloe_aya',
    'b39a842a-9a42-4ef0-aa3f-8a9c2ff6c018':'samurphy11',
    '03cb49f6-d9ff-4338-94b8-b16d37831dbc': 'frank_aya'}

def update_aware_id(user_id, aware_id):
    mysql_config_file = "./config/saraSqlConfig.json"
    
    with open(mysql_config_file) as f:
        mysql_connect_object = json.load(f)
    
    db = mysql.connect(
        host = mysql_connect_object["host"],
        port = mysql_connect_object["port"],
        user = mysql_connect_object["user"],
        passwd = mysql_connect_object["passwd"],
        database = mysql_connect_object["database"]
    )
    
    cursor = db.cursor()
    update_statement = "UPDATE users SET aware_id = '" + aware_id + "' WHERE username = '" + user_id + "';"
    
    cursor.execute(update_statement)
    db.commit()
    db.close()

for id in ID_dict:
    aware_id = id
    user_id = ID_dict[aware_id]
    update_aware_id(user_id, aware_id)
    print("Updating: " + user_id + ", " + aware_id)