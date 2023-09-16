from abc import ABC, abstractmethod, abstractproperty

class State(ABC):
    """
    This is an abstract class that
    every state extends 
    """
    @abstractproperty
    def participant_state(self):
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
        return "participant_state"

    @abstractproperty
    def message_buckets(self):
        """
        The messages can either be 
        - string
        - a predefined bucket
        - a csv file location

        example 
        """
        return "message_buckets"

    @abstractmethod
    def determine_state_true_or_false(self):
        # returns true if state is active
        # else false
        pass