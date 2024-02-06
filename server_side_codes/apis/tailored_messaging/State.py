import json

class State:
    def __init__(self) -> None:

        """
        Define participants as an array. 
            example:
            {
                "day_of_survey": "December 4th 2022, 6:01:19 pm -05:00",
                "weekday_or_weekend": "Weekend",
                "location_Q1": "Home (indoors)",
                "social_company_Q2": "Mom/Dad",
                "fatigue_Q4": 4,
                "nausea_Q5": 0,
                "pos_mood_Q6": 1,
                "neg_mood_Q7": 3,
                "adherence_motivation_Q9": 3,
                "cg_aya_agreement_Q10": "No"
            }
        """
        self.survey_state = None
        
        """
        This will be a list of dicts. 
        Each dict will have the following elements.
        [
            {
                message_bucket_id: "xx_xxxxx_xxx"   # This the csv file name
                prob_to_select: 0.5                 # If the message buckets do not sum to one, we will renormalize
                messages: [
                    "message 1",
                    "message 2",
                    "message 3",
                ]
            },
            {
                message_bucket_id: "yy_yyyyy_yyy"   # This the csv file name
                prob_to_select: 0.5                 # If the message buckets do not sum to one, we will renormalize
                messages: [
                    "message 1",
                    "message 2",
                ]
            },
        ]
        """
        self.message_buckets = []
        
        # In "python" functions are varibles,
        # assign the check for this function here.
        self.func_ptr_to_determine_state_condition = None

        self.state_condition = False

    def set_func_ptr_to_state(self, func_ptr):
        self.func_ptr_to_determine_state_condition = func_ptr

    def add_message_bucket(self, message_bucket, probability, bucket_name):
        message_bucket_dict = {}
        message_bucket_dict['message_bucket_id'] = bucket_name
        message_bucket_dict['prob_to_select'] = probability
        message_bucket_dict['messages'] = message_bucket
        self.message_buckets.append(message_bucket_dict)

    def set_survey_results(self, survey_state):
        self.survey_state = survey_state

    def determine_state_condition(self):
        self.state_condition = self.func_ptr_to_determine_state_condition(self.survey_state)
        return self.state_condition

    def print_state(self):
        state = {}
        state["state_condition"] = self.state_condition
        state["survey_state"] = self.survey_state
        state["message_buckets"] = self.message_buckets
        state["state_condition_function"] = str(self.func_ptr_to_determine_state_condition)
        print(json.dumps(state, indent=4))


        








    