from s3_functions import transfer_s3_data
from onesignal_functions import OneSignal
from mysql_functions import get_question_data, get_usernames, get_player_id


def main():
	"""
	The official script that cronjob runs every 15 minutes.
	"""
	# TODO: figure out how the timing stuff works
	print("Starting the cronjob script....")

	bucketName = 'sara-dev-data-storage'
	surveyDirectory = 'harvard_survey/'
	processedDirectory = 'harvard_survey_processed/'
	transfer_s3_data(bucketName, surveyDirectory, processedDirectory)

	userNames = get_usernames()
	for userName in userNames:

		playerID = get_player_id(userName)
		if playerID is not None:
			surveyResponses = get_question_data(userName)
			
			msg = OneSignal(playerID, surveyResponses["Q4"], timeToSend="6:00 AM",\
				msgHeading="Harvard test title", notificationImage='fishjournal.png')
			msg.send()

	print("Finished sending notifications to all users who completed surveys.")


if __name__ == '__main__':
	main()