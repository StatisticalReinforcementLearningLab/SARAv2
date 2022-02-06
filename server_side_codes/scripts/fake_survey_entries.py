import json 
import time
import mysql.connector


class FakeEveningSurvey: 
    def __init__(self, user_id):
        self.survey = {
            "surveyStartTimeUTC":"",
            "onclickTimeForDifferentQuestions":"" ,
            "stress_question":"", # How stressed are you today? 
            "concentration_question":"", # This past week, did you concentrate easily? 
            "good_day_question":"", # Do you think you'll have a good day tomorrow? 
            "mood_question":"", # Rate your mood for today
            "cats_or_dogs_question": "",
            "ts": "", # Formatted
            "deviceInfo":""
        }

        self.survey_name = "evening_survey" 
        self.user_id = user_id
        self.survey_completion_time = time.time()

    
    def fill_survey_answers(self, stress_level, concentration_yes_or_no, good_day_tomorrow, mood_rating, cats_or_dogs):
        '''
        Inserts survey answers with checking
        '''
        # Q1
        if stress_level > 4 or stress_level < 0 or isinstance(stress_level, int) == False: 
            print("Incorrect stress level type")
            return None

        # Q2 
        concentration_options = ['Rarely/Never', 'Occasionally', 'Often', 'Almost Always/Always']
        if concentration_yes_or_no not in concentration_options: 
            print("Incorrect stress level.")
            return None

        # Q3
        if good_day_tomorrow != "yes" and good_day_tomorrow != "no": 
            print("Please make good day tomorrow a yes or no answer")
            return None

        # Q4
        if mood_rating > 4 or mood_rating < 0: 
            print("Incorrect mood rating")
            return None

        # Q5
        if cats_or_dogs != "cats" and cats_or_dogs != "dogs": 
            print("Please enter cats or dogs")
            return None

        self.survey['stress_question'] = stress_level 
        self.survey['concentration_question'] = concentration_yes_or_no
        self.survey['good_day_question'] = good_day_tomorrow
        self.survey['mood_question'] = mood_rating
        self.survey['cats_or_dogs_question'] = cats_or_dogs

    def insert_into_database(self, db, cursor): 
        json_answer = json.dumps(self.survey)
        statement = "INSERT INTO filled (user_id, survey_name, survey_completion_time, json_answer) VALUES (%s, %s, %s, %s)"
        values = (self.user_id, self.survey_name, self.survey_completion_time, json_answer)
        cursor.execute(statement, values)
        db.commit()


# Connect to database
db =  mysql.connector.connect(
    host = "ec2-54-165-102-180.compute-1.amazonaws.com",
    port = "3308",
    user = "root",
    passwd = "helloworld",
    database = "study"
)
cursor = db.cursor()


eura_survey = FakeEveningSurvey("eurashin")
eura_survey.fill_survey_answers(4, "Rarely/Never", "yes", 0, "cats")
eura_survey.insert_into_database(db, cursor)

sarah_survey = FakeEveningSurvey("sarah")
sarah_survey.fill_survey_answers(4, "Often", "yes", 4, "dogs")
sarah_survey.insert_into_database(db, cursor)

