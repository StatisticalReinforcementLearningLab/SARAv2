
import mysql.connector as mysql
from datetime import datetime
import time



def insert_data_into_mysql():
    """
    Inserting a single data point into the test database.
    """

    print('Inserting data')

    # connect to db
    db = mysql.connect(
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = "password",
        database = "HarvardDev"
    )
    cursor = db.cursor()


    # insert data
    whenIntertedTs = time.time()
    whenInsertedReadableTs = datetime.utcfromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
    payload = "temp data"

    insert_stmt = (
      "INSERT INTO testTable (whenIntertedTs, whenInsertedReadableTs, data) "
      "VALUES (%s, %s, %s)"
    )
    data = (whenIntertedTs, whenInsertedReadableTs, payload)
    cursor.execute(insert_stmt, data)
    db.commit()



def select_data_into_mysql():
    """
    Select all data point into the test database.
    """

    print('Fetching data')

    # connect to db
    db = mysql.connect(
        host = "ec2-54-91-131-166.compute-1.amazonaws.com",
        port = 3308,
        user = "root",
        passwd = "password",
        database = "HarvardDev"
    )
    cursor = db.cursor()

    # fetch data.
    cursor.execute("SELECT * FROM testTable")
    recordsInTestTable = cursor.fetchall()

    # print data.
    for row in recordsInTestTable:
        print(row)

insert_data_into_mysql()
select_data_into_mysql()
