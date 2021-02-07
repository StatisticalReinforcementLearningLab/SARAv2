import json
import mysql.connector as mysql
import pandas as pd
from datetime import datetime
from datetime import timedelta

class Aware:

    def __init__(self,config_name):
        self.config_name = config_name
    

    def getSqlConfigFromJSON(self):
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
        with open(self.config_name) as f:
            mysqlConnectObject = json.load(f)
            
        return mysqlConnectObject

    def getAwareIDs(self):

        mysqlConnectObject = self.getSqlConfigFromJSON()
        db = mysql.connect(
                host = mysqlConnectObject["host"],
                port = mysqlConnectObject["port"],
                user = mysqlConnectObject["user"],
                passwd = mysqlConnectObject["passwd"],
                database = mysqlConnectObject["database"]
        )
        cursor = db.cursor()

        cursor.execute("SELECT distinct username, aware_id from users WHERE aware_id is NOT NULL")      
        names = cursor.fetchall()
        ID_dict = {}
        [ID_dict.update({b:a}) for a,b, in names]
        return ID_dict

    def getAwareIDs2(self):
        """
        Uses distinct ids from screen table.
        """

        mysqlConnectObject = self.getSqlConfigFromJSON()
        db = mysql.connect(
                host = mysqlConnectObject["host"],
                port = mysqlConnectObject["port"],
                user = mysqlConnectObject["user"],
                passwd = mysqlConnectObject["passwd"],
                database = mysqlConnectObject["database"]
        )
        cursor = db.cursor()

        cursor.execute("SELECT distinct device_id from screen")      
        names = cursor.fetchall()
        return names

    def getScreenUsageDataFrame(self,ID,days=7):
        """
        Select screen usage data points into the test database.
        """

        #print('Fetching data')
        
        #get sql connect config
        mysqlConnectObject = self.getSqlConfigFromJSON()

        # connect to db
        db = mysql.connect(
            host = mysqlConnectObject["host"],
            port = mysqlConnectObject["port"],
            user = mysqlConnectObject["user"],
            passwd = mysqlConnectObject["passwd"],
            database = mysqlConnectObject["database"]
        )
        cursor = db.cursor()

        # fetch data.
        cursor.execute("SELECT * FROM screen where device_id = '"+ID+ "' order by timestamp desc;")
        recordsInScreenTable = cursor.fetchall()

        # initialize variables
        dateStringForAppUsageList = []
        timestampForAppUsageList = []
        screenTimeValueList = []
        
        #print('creating data frame')
        for row in recordsInScreenTable:
            
            ts = row[1]/1000 - 7*60*60 #convert to pacific timezone. ToDo: change fixed value.
            timestampForAppUsageList.append(ts)
            
            datetime_ts = datetime.utcfromtimestamp(ts) 
            dateStringForAppUsageList.append(datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p'))
            
            screenTimeValueList.append(row[3])
            
            #print(datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p') + ", " + str(row[3]))
            #print(datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p'))
            
            
        appUsageData = {
            'date': dateStringForAppUsageList,
            #'timestamp': timestampForAppUsageList,
            'screenTime': screenTimeValueList   
        }
        
        #-- convert to pandas dataframe, with time based indexing
        appUsageDataFrame = pd.DataFrame(appUsageData, columns = ['date','screenTime']) 
        #print('using data as index')
        appUsageDataFrame['date'] = pd.to_datetime(appUsageDataFrame['date'], format='%Y-%m-%d %I:%M:%S %p')
        
        start_date = datetime.today()-timedelta(days)
        appUsageDataFrame = appUsageDataFrame[appUsageDataFrame['date']>start_date]
        
        return appUsageDataFrame


    def getLocationDataFrame(self,ID,days=7):
        """
        Select location data points into the test database.
        """

        #print('Fetching data')

        #get sql connect config
        mysqlConnectObject = self.getSqlConfigFromJSON()
        
        # connect to db
        db = mysql.connect(
            host = mysqlConnectObject["host"],
            port = mysqlConnectObject["port"],
            user = mysqlConnectObject["user"],
            passwd = mysqlConnectObject["passwd"],
            database = mysqlConnectObject["database"]
        )
        cursor = db.cursor()

        # fetch data.
        cursor.execute("SELECT * FROM saraaware2.locations where device_id = '"+ID+ "' order by timestamp desc;")
        recordsInGpsTable = cursor.fetchall()

        # initialize variables
        dateStringForAppUsageList = []
        timestampForAppUsageList = []
        locationDataValueList = []
        
        #print('creating data frame')
        for row in recordsInGpsTable:
            #print(row)
            ts = row[1]/1000 - 7*60*60 #convert to pacific timezone. ToDo: change fixed value.
            timestampForAppUsageList.append(ts)
            
            datetime_ts = datetime.utcfromtimestamp(ts) 
            dateStringForAppUsageList.append(datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p'))
            
            locationDataValueList.append(row[3])
            
            #print(datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p') + ", " + str(row[3]))
            #print(datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p'))
            
            
        locationData = {
            'date': dateStringForAppUsageList,
            #'timestamp': timestampForAppUsageList,
            'location_lat': locationDataValueList   
        }
        
        #-- convert to pandas dataframe, with time based indexing
        locationDataFrame = pd.DataFrame(locationData, columns = ['date','location_lat']) 
        #print('using data as index')
        locationDataFrame['date'] = pd.to_datetime(locationDataFrame['date'], format='%Y-%m-%d %I:%M:%S %p')
        
        start_date = datetime.today()-timedelta(days)
        locationDataFrame = locationDataFrame[locationDataFrame['date']>start_date]
        
        return locationDataFrame



    def getStepCountDataFrame(self,ID,days=7):

    
        #get sql connect config
        mysqlConnectObject = self.getSqlConfigFromJSON()

        # connect to db
        db = mysql.connect(
            host = mysqlConnectObject["host"],
            port = mysqlConnectObject["port"],
            user = mysqlConnectObject["user"],
            passwd = mysqlConnectObject["passwd"],
            database = mysqlConnectObject["database"]
        )
        cursor = db.cursor()

        cursor.execute("SELECT * FROM plugin_ios_pedometer where device_id = '"+ID+ "' order by timestamp desc;")
        recordsInStepTable = cursor.fetchall()

        # initialize variables
        dateStringForAppUsageList = []
        timestampForAppUsageList = []
        stepCountDataValueList = []
        
        #print('creating data frame ' + len(recordsInTestTable))
        for row in recordsInStepTable:
            #print(row)
            ts = row[1]/1000 - 7*60*60 #convert to pacific timezone. ToDo: change fixed value.
            timestampForAppUsageList.append(ts)
            
            datetime_ts = datetime.utcfromtimestamp(ts) 
            dateStringForAppUsageList.append(datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p'))
            
            stepCountDataValueList.append(row[5])
            
            #print(datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p') + ", " + str(row[3]))
            #print(datetime_ts.strftime('%Y-%m-%d %I:%M:%S %p'))
            
            
        stepCountData = {
            'date': dateStringForAppUsageList,
            #'timestamp': timestampForAppUsageList,
            'stepCount': stepCountDataValueList   
        }
        
        
        #-- convert to pandas dataframe, with time based indexing
        stepCountDataFrame = pd.DataFrame(stepCountData, columns = ['date','stepCount']) #, parse_dates=['date'], index_col="date")
        #print('using data as index')
        stepCountDataFrame['date'] = pd.to_datetime(stepCountDataFrame['date'], format='%Y-%m-%d %I:%M:%S %p')
        
        start_date = datetime.today()-timedelta(days)
        stepCountDataFrame = stepCountDataFrame[stepCountDataFrame['date']>start_date]    
        
        return stepCountDataFrame


    def no_recent_update(self,ID, threshold_days = 2):
        """
        What does this function do?
        """
        missing = False  
            
        appUsage_max = self.getScreenUsageDataFrame(ID,threshold_days)['date'].max()
        location_max = self.getLocationDataFrame(ID,threshold_days)['date'].max()
        stepCount_max = self.getStepCountDataFrame(ID,threshold_days)['date'].max()
        
        #check if no data at all
        if ( pd.isnull(appUsage_max) or pd.isnull(location_max) or pd.isnull(stepCount_max)):
            missing = True
        
        #check if data missing for threshold_days number of days
        max_gap = pd.Timestamp.now() - min(appUsage_max,location_max,stepCount_max)
        if max_gap>timedelta(days=threshold_days):
            missing = True
            
        return missing

    def last_update_table(self,ID_dict):
        """
        What does this function do?
        """
        
        last_update = []
        for ID in ID_dict.keys():
            username = ID_dict[ID]
            appUsage_max = self.getScreenUsageDataFrame(ID,10000)['date'].max()
            location_max = self.getLocationDataFrame(ID,10000)['date'].max()
            stepCount_max = self.getStepCountDataFrame(ID,10000)['date'].max()
            last = min(appUsage_max,stepCount_max,location_max) #Mash: why is this a min?
            if pd.isnull(last):
                last = 'None'
            last_update.append(last)

        lu_dict = {
            'username': ID_dict.values(),
            'last_update': last_update
        }
        update_df = pd.DataFrame(lu_dict,columns=['username','last_update']).set_index('username').sort_values('last_update')

        return update_df

