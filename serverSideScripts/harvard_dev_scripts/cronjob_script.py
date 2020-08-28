from s3_functions import transfer_s3_data
from onesignal_functions import createOneSignalMessage, sendOneSignalNotifications
from mysql_functions import get_question_data, get_usernames, get_player_id


def main():
	"""
	The official script that cronjob periodically runs.
	"""
	print("Starting the cronjob script....")
	# transfer the data from the s3 bucket to the mysql database
	bucketName = 'sara-dev-data-storage'
	surveyDirectory = 'harvard_survey/'
	processedDirectory = 'harvard_survey_processed/'
	transfer_s3_data(bucketName, surveyDirectory, processedDirectory)
	# get all of the usernames in the batch of data
	userNames = get_usernames()
	for userName in userNames:
		# for each username, get the corresponding player_id
		playerID = get_player_id(userName)
		if playerID is not None:
			# also get the survey data
			surveyResponses = get_question_data(userName)
			# create a OneSignal message
			msg = createOneSignalMessage(surveyResponses["Q4"])
			# send the OneSignal message
			sendOneSignalNotifications([playerID], msg)

	print("Finished sending notifications to all users who completed surveys.")


if __name__ == '__main__':
	main()