#
# Created by Mash, Nov 15, 2020
#



class SurveyParserInterface:
    def __init__(self):
        pass

    def fetch_raw_data(self, data_location):
        """Function to fetch raw data. Returns an array of latest survey data."""
        pass
    
    def process_raw_data(self, raw_survey_array):
        """Gets the raw data array and preprocess into another array for storage"""
        pass

    def store_processed_data(self, processed_survey_array):
        """Gets the preprocessed data array and store into another array for storage"""
        pass

    def post_parsing_cleanup(self, arg):
        """Cleans up any data after parsing finishes"""
        pass


