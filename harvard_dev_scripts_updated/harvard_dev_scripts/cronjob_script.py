from s3_functions import transferS3Data
from onesignal_functions import OneSignal
from mysql_functions import (getQuestionDataFromHarvardSurvey, getUsernamesFromHarvardSurvey, 
	getPlayerId)


def main():
	"""
	The official script that cronjob runs every 15 minutes.
	"""
	print("Starting the cronjob script....")

	bucketName = 'sara-dev-data-storage'
	surveyDirectory = 'harvard_survey/'
	processedDirectory = 'harvard_survey_processed/'
	transferS3Data(bucketName, surveyDirectory, processedDirectory)

	userNames = getUsernamesFromHarvardSurvey()
	for userName in userNames:

		playerID = getPlayerId(userName)
		
		if playerID is not None:

			surveyResponses, responseUUID, surveyCompletionTime = getQuestionDataFromHarvardSurvey(userName)
			
			# passing external_id ensures idempotence
			msg = OneSignal(playerID, userName, surveyResponses["Q4"], timeToSend="6:00 AM",\
				msgHeading="Harvard test title", notificationImage='fishjournal.png',\
				externalID=responseUUID, surveyCompletionTime = surveyCompletionTime)
			msg.send()

	print("Finished sending notifications to all users who completed surveys.")


if __name__ == '__main__':
	main()