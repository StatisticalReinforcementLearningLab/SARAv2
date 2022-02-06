import sys
from sara.parsers.SurveyParser import SurveyParser

# read command line arguments
arglist = sys.argv
if len(arglist) != 5: # must have bucket name, survey_directory, processed_directory, survey name
    print("CORRECT USAGE: SurveyParser.py <S3 bucket name> <S3 preprocessed survey directory> <S3 postprocessed survey directory> <survey name>")
    print("Please correct your syntax and try again.")
else: 
    bucket_name = arglist[1]
    pre_directory = arglist[2]
    post_directory = arglist[3]
    survey_name = arglist[4]

    # initialize parser
    survey_parser = SurveyParser("study", survey_name) # Default database is study

    #fetch survey data
    raw_survey_data_list = survey_parser.fetch_raw_data({"bucket_name": bucket_name, "directory": pre_directory})

    # process survey data
    processed_survey_data_list = survey_parser.process_raw_data(raw_survey_data_list)

    # process survey data
    survey_parser.store_processed_data(processed_survey_data_list)

    survey_parser.post_parsing_cleanup({"bucket_name": bucket_name, "source_s3_directory": pre_directory, "destination_s3_directory": post_directory})
