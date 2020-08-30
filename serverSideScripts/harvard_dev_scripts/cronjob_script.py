from s3_functions import transferS3Data
from onesignal_functions import OneSignal
from mysql_functions import (getQuestionDataFromHarvardSurvey, getUsernamesFromHarvardSurvey, 
	getPlayerId)


def main():
	"""
	The official script that cronjob runs every 15 minutes.
	"""
	# TODO: figure out how the timing stuff works
	print("Starting the cronjob script....")

	bucketName = 'sara-dev-data-storage'
	surveyDirectory = 'harvard_survey/'
	processedDirectory = 'harvard_survey_processed/'
	transferS3Data(bucketName, surveyDirectory, processedDirectory)

	userNames = getUsernamesFromHarvardSurvey()
	for userName in userNames:

		playerID = getPlayerId(userName)
		if playerID is not None:

			surveyResponses = getQuestionDataFromHarvardSurvey(userName)
			
			# need idempotence --> unique id for notification? so only send once
			# keep record of last time user was alerted, one extra long per user
			msg = OneSignal(playerID, surveyResponses["Q4"], timeToSend="6:00 AM",\
				msgHeading="Harvard test title", notificationImage='fishjournal.png')
			msg.send()

	print("Finished sending notifications to all users who completed surveys.")


if __name__ == '__main__':
	main()