from . import config
import mysql.connector as mysql
import dateutil.parser
import json
import pytz
from datetime import datetime, timedelta


def connect_to_database(mysql_config_file, db_name):
    """
    Connects to sql database. Returns a db object.
    """

    with open(mysql_config_file) as f:
        mysql_connect_object = json.load(f)

    db = mysql.connect(
        host=mysql_connect_object["DB_HOST"],
        port=mysql_connect_object["DB_PORT"],
        user=mysql_connect_object["DB_USER"],
        passwd=mysql_connect_object["DB_PASSWORD"],
        database=db_name,  # "HarvardDev"
    )

    return db


def get_sleep_data_for_last_14_days(user_id):
    # currently sending mock data for debug
    db = connect_to_database("./libs/mysql_config.json", "study")
    formatted_sleep_survey_array = get_sleep_survey(db, user_id)
    # print(formatted_sleep_survey_array)
    return formatted_sleep_survey_array


def format_single_survey(sleep_survey_in_json):
    """
    Output sleep survey in the following format.
    {"report_date": "20210724", "start": "11:00", "end": "09:00"}
    """
    formatted_sleep_data = {}
    formatted_sleep_data["start"] = sleep_survey_in_json["Q2_modified"].split()[0]
    formatted_sleep_data["end"] = sleep_survey_in_json["Q3_modified"].split()[0]

    ts = sleep_survey_in_json["ts"].split(",")[
        0
    ]  # .replace(":","") # in "September 5th 2021, 9:33:45 am -07:00" format
    datetime_object = dateutil.parser.parse(ts)
    formatted_sleep_data["report_date"] = datetime_object.strftime("%Y%m%d")

    return formatted_sleep_data


def get_sleep_survey(db, username="mash", num_days=14):
    cursor = db.cursor()
    sql_command = "SELECT when_inserted, json_answer FROM study.filled "
    sql_command = (
        sql_command
        + 'where user_id="'
        + username
        + "\" and survey_name = 'sleep_survey' and when_inserted > NOW() - INTERVAL "
        + str(num_days)
        + " DAY "
    )
    sql_command = sql_command + " order by survey_completion_time;"

    cursor.execute(sql_command)
    returned_data = cursor.fetchall()

    formatted_sleep_survey_array = []
    for row in returned_data:
        date = row[0]
        row_json = json.loads(row[1])
        formatted_sleep_survey_array.append(format_single_survey(row_json))

    return formatted_sleep_survey_array


def get_sleep_survey_adherence_states(sleep_data, states):
    """
    Takes sleep data in raw format, which may include missing data for days when no surveys are reported.
    Returns recent and overall sleep status as seen in the config.py file.

        Input:
            "Sleep data:" is a list of values in the following format. The report data is when
                          the sleep data is reported. Start is the start time of sleep.
                sleep_data = [
                    {"report_date": "20210724", "start": "11:00", "end": "09:00"},
                    {"report_date": "20210731", "start": "2:30", "end": "09:00"},
                    {"report_date": "20210801", "start": "1:30", "end": "11:00"}
                ]
        Return:
            states: a combination of
                config.SLEEP_SURVEY_COUNT_RECENT_LOW
                config.SLEEP_SURVEY_COUNT_RECENT_HIGH
                config.SLEEP_SURVEY_COUNT_OVERALL_LOW
                config.SLEEP_SURVEY_COUNT_OVERALL_HIGH
    """

    sleep_data_with_date_key = {}
    for index in range(len(sleep_data)):
        sleep_data_with_date_key[sleep_data[index]["report_date"]] = sleep_data[index]

    # recent survey adherence
    count = 0
    for days_to_subtract in range(config.SLEEP_SURVEY_COUNT_RECENT_NO_OF_DAYS):
        d = datetime.now(pytz.timezone("US/Hawaii")) - timedelta(days=days_to_subtract)
        date_str = d.strftime("%Y%m%d")
        if date_str in sleep_data_with_date_key:
            count = count + 1

    if (
        count / config.SLEEP_SURVEY_COUNT_RECENT_NO_OF_DAYS
        < config.SLEEP_SURVEY_COUNT_RECENT_THRESHOLD
    ):
        states.append({ 
            "micro_state_id": config.SLEEP_SURVEY_COUNT_RECENT_LOW,
            "message": f"{count} out of surveys completed in {config.SLEEP_SURVEY_COUNT_RECENT_NO_OF_DAYS} days (recently low)."
        })
    else:
        states.append({ 
            "micro_state_id": config.SLEEP_SURVEY_COUNT_RECENT_HIGH,
            "message": f"{count} out of surveys completed in {config.SLEEP_SURVEY_COUNT_RECENT_NO_OF_DAYS} days (recently high)."
        })

    # overall survey adherence
    count = 0
    for days_to_subtract in range(config.SLEEP_SURVEY_COUNT_OVERALL_NO_OF_DAYS):
        d = datetime.now(pytz.timezone("US/Hawaii")) - timedelta(days=days_to_subtract)
        date_str = d.strftime("%Y%m%d")
        if date_str in sleep_data_with_date_key:
            count = count + 1

    if (
        count / config.SLEEP_SURVEY_COUNT_OVERALL_NO_OF_DAYS
        < config.SLEEP_SURVEY_COUNT_OVERALL_THRESHOLD
    ):
        states.append({ 
            "micro_state_id": config.SLEEP_SURVEY_COUNT_OVERALL_LOW,
            "message": f"{count} out of surveys completed in {config.SLEEP_SURVEY_COUNT_OVERALL_NO_OF_DAYS} days (overall low)."
        })
    else:
        states.append({ 
            "micro_state_id": config.SLEEP_SURVEY_COUNT_OVERALL_HIGH,
            "message": f"{count} out of surveys completed in {config.SLEEP_SURVEY_COUNT_OVERALL_NO_OF_DAYS} days (overall high)."
        })

    return states


def conv_table_hour_label_to_ylabels():
    """
    Helper function to return the current mapping of hour labels and corresponding y labels in the graph.
    We call this function to keep a consistent copy of the hour label mapping to y axis label in the graph.

    returns:
        hour_label: hour labels in am and pm
        y_labels: mapping in the y axis label for the chart
    """

    # note our conversion starategy is the following:
    # copied from previous function. Make it a variable.
    hour_labels = ["8p", "9p", "10p", "11p", "12a", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p"]
    y_labels    = [   0,    1,     2,     3,     4,    5,    6,    7,    8,    9,   10,   11,   12,   13,   14,    15,    16,    17,   18]

    return hour_labels, y_labels


def convert_sleep_labels_to_ylabels(type, label):
    """
    Converts a sleep start/end hour label "XX:XX" into y axis label, that we can plot.

    Input:
        "type":        is either "start" or "end". Start represents the sleep start time, end represents the sleep end time
        "label":       is hour and minute, and in the format of "XX:XX"
        "hour_labels": hour part of the mapping form time string to y values in the chart
        "y_labels":    y part of the mapping form time string to y values in the chart

    return:
        (y_label_sleep_end, hour_label)
        y_label_sleep_end: y axis label for input "label"
        hour_label: hour part in the input "label" which also is in input "hour_labels"
    """
    hour_labels, y_labels = conv_table_hour_label_to_ylabels()

    # note start is between 9:00PM to 8:00AM
    # note end is between 03:00AM to 2:00PM

    if type == "start":
        time_parts = label.split(":")
        hour_part = int(time_parts[0])
        minute_part = float(time_parts[1])

        if hour_part in [9, 10, 11]:
            hour_label = str(hour_part) + "p"
        else:  # is between 12A to 8AM
            hour_label = str(hour_part) + "a"

        y_label_sleep_start = y_labels[hour_labels.index(hour_label)]
        y_label_sleep_start = y_label_sleep_start + minute_part / 60.0
        return (y_label_sleep_start, hour_label)

    if type == "end":
        time_parts = label.split(":")
        hour_part = int(time_parts[0])
        minute_part = float(time_parts[1])

        if hour_part in [12, 1, 2]:
            hour_label = str(hour_part) + "p"
        else:  # is between 3A to 11AM
            hour_label = str(hour_part) + "a"

        y_label_sleep_end = y_labels[hour_labels.index(hour_label)]
        y_label_sleep_end = y_label_sleep_end + minute_part / 60.0
        return (y_label_sleep_end, hour_label)


def get_sleep_survey_monitoring_states(sleep_data, states):
    """
    Takes sleep data in raw format, which may include missing data for days when no surveys are reported.
    Returns recent and overall sleep status as seen in the config.py file.

        Input:
            "Sleep data:" is a list of values in the following format. The report data is when
                          the sleep data is reported. Start is the start time of sleep.
                sleep_data = [
                    {"report_date": "20210724", "start": "11:00", "end": "09:00"},
                    {"report_date": "20210731", "start": "2:30", "end": "09:00"},
                    {"report_date": "20210801", "start": "1:30", "end": "11:00"}
                ]
        Return:
            states: a combination of
                config.SLEEP_MONITORING_RECENT_SUFFICEINT_SLEEP_LOW
                config.SLEEP_MONITORING_RECENT_SUFFICEINT_SLEEP_HIGH
                config.SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_LOW
                config.SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_HIGH
    """

    sleep_data_with_date_key = {}
    for index in range(len(sleep_data)):
        sleep_data_with_date_key[sleep_data[index]["report_date"]] = sleep_data[index]

    # recent sleep monitoring
    count = 0
    total_sleep_surveys = 0
    for days_to_subtract in range(
        config.SLEEP_MONITORING_RECENT_SUFFICEINT_SLEEP_NO_OF_DAYS
    ):
        d = datetime.now(pytz.timezone("US/Hawaii")) - timedelta(days=days_to_subtract)
        date_str = d.strftime("%Y%m%d")

        if date_str in sleep_data_with_date_key:
            total_sleep_surveys = total_sleep_surveys + 1

            sleep_datum = sleep_data_with_date_key[date_str]
            start_time_processed = convert_sleep_labels_to_ylabels(
                "start", sleep_datum["start"]
            )
            end_time_processed = convert_sleep_labels_to_ylabels(
                "end", sleep_datum["end"]
            )

            total_sleep_hours = end_time_processed[0] - start_time_processed[0]
            if total_sleep_hours > config.SLEEP_MONITORING_SUFFICIENT_SLEEP_HOURS:
                count = count + 1

    if total_sleep_surveys == 0:
        pass
    elif (
        count / total_sleep_surveys
        < config.SLEEP_MONITORING_RECENT_SUFFICEINT_SLEEP_THRESHOLD
    ):
        # count/config.SLEEP_MONITORING_RECENT_SUFFICEINT_SLEEP_NO_OF_DAYS < config.SLEEP_MONITORING_RECENT_SUFFICEINT_SLEEP_THRESHOLD:
        states.append({ 
            "micro_state_id": config.SLEEP_MONITORING_RECENT_SUFFICEINT_SLEEP_LOW,
            "message": f"8 hours of sleep in {count} out of {total_sleep_surveys} days (recent low)."
        })
    else:
        states.append({ 
            "micro_state_id": config.SLEEP_MONITORING_RECENT_SUFFICEINT_SLEEP_HIGH,
            "message": f"8 hours of sleep in {count} out of {total_sleep_surveys} days (recent high)."
        })

    # overall survey adherence
    count = 0
    total_sleep_surveys = 0
    for days_to_subtract in range(
        config.SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_NO_OF_DAYS
    ):
        d = datetime.now(pytz.timezone("US/Hawaii")) - timedelta(days=days_to_subtract)
        date_str = d.strftime("%Y%m%d")

        if date_str in sleep_data_with_date_key:
            total_sleep_surveys = total_sleep_surveys + 1

            sleep_datum = sleep_data_with_date_key[date_str]
            start_time_processed = convert_sleep_labels_to_ylabels(
                "start", sleep_datum["start"]
            )
            end_time_processed = convert_sleep_labels_to_ylabels(
                "end", sleep_datum["end"]
            )

            total_sleep_hours = end_time_processed[0] - start_time_processed[0]
            if total_sleep_hours > config.SLEEP_MONITORING_SUFFICIENT_SLEEP_HOURS:
                count = count + 1

    if (
        count / config.SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_NO_OF_DAYS
        < config.SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_THRESHOLD
    ):
        states.append({ 
            "micro_state_id": config.SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_LOW,
            "message": f"8 hours of sleep in {count} out of {config.SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_NO_OF_DAYS} days (overall low)."
        })
    else:
        states.append({ 
            "micro_state_id": config.SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_HIGH,
            "message": f"8 hours of sleep in {count} out of {config.SLEEP_MONITORING_OVERALL_SUFFICEINT_SLEEP_NO_OF_DAYS} days (overall high)."
        })

    return states


def get_messages_for_states(micro_states):
    """
    This function micro takes the states on adherence low/high, sufficient sleep low/high,
    for lately and overall. Then get the corresponding states from the 
    config file. Reads all the messages in that states.
    
    This function returns the entire state, all messages, randomizations,
    and what message was picked as a big object. 

    If no state is found then default state is returned.
    """

    current_state = config.default_state
    micro_states.sort() # sorting for comparison
    
    for macro_state in config.states:
        for macro_state_i in macro_state["activation_conditions"]:
            macro_state_i.sort() # sorting for comparison
    
            if macro_state == micro_states:
                current_state = macro_state
                break
    
    all_messages = []
    for messsage in current_state["messages"]:
        if isinstance(messsage, str):
            all_messages.append(messsage)
        else: # it is a message pool, which is a dictionary. 
            all_messages.extend(messsage["messages"].values())





    #
    # print(current_state["name"])
    # print(all_messages)
    return current_state["name"], all_messages


def hello_world():
    print("Hello world")

def get_sleep_monitoring_state_and_messages(user_id, today_sleep_data = None):
    # user_id = "mash"
    sleep_data = get_sleep_data_for_last_14_days(user_id)
    
    if today_sleep_data != None:
        sleep_data.append(today_sleep_data)
    # print(sleep_data)

    micro_states = []
    micro_states = get_sleep_survey_adherence_states(sleep_data, micro_states)
    micro_states = get_sleep_survey_monitoring_states(sleep_data, micro_states)
    # print(micro_states)

    interpretable_stats_string = ""
    micro_states_ids = []
    for micro_state in micro_states:
        interpretable_stats_string = interpretable_stats_string + micro_state["message"] + "\n"
        micro_states_ids.append(micro_state["micro_state_id"])
    #print(interpretable_stats_string)

    current_state, support_messages = get_messages_for_states(micro_states_ids)

    sleep_mesage_object = {}
    sleep_mesage_object["state_description"] = interpretable_stats_string
    sleep_mesage_object["smaller_states"] = micro_states
    sleep_mesage_object["state"] = current_state
    sleep_mesage_object["support_messages"] = support_messages

    return sleep_mesage_object
