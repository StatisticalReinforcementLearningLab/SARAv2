#
# Created by Mash, Nov 15, 2020
#



class GenericParserInterface:
    def __init__(self):
        pass

    def fetch_raw_data(self, *args):
        """Function to fetch raw data. Returns an array of latest data."""
        pass
    
    def process_raw_data(self, *args):
        """Gets the raw data array and preprocess into another array for storage"""
        pass

    def store_processed_data(self, *args):
        """Gets the preprocessed data array and store into another array for storage"""
        pass

    def post_parsing_cleanup(self, *args):
        """Cleans up any data after parsing finishes"""
        pass


    


