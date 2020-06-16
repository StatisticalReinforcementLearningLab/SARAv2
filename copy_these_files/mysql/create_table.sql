CREATE TABLE `user_ids` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(45) DEFAULT NULL,
  `oneSignalPlayerId` varchar(45) DEFAULT NULL,
  `currentTimeReadableTs` varchar(45) DEFAULT NULL,
  `currentTimeTs` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `survey_completed` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(45) DEFAULT NULL,
  `dateString` varchar(45) DEFAULT NULL,
  `whenCompletedTs` bigint DEFAULT NULL,
  `whenCompletedReadableTs` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=221 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




CREATE TABLE `SARA_Notifications` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `PARTICIAPANT_ID` text,
  `Notification_ID` text,
  `DATE` text,
  `whenReceivedTs` bigint DEFAULT NULL,
  `whenReceivedReadableTs` text,
  `whenActedonTs` bigint DEFAULT NULL,
  `whenActedonReadableTs` text,
  `typeOfAction` text,
  `typeOfNotification` text,
  `JSON_dump` text,
  `device_type` text,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=390 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `4PMNotifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `whenSentTs` bigint DEFAULT NULL,
  `whenSentReadableTs` varchar(45) DEFAULT NULL,
  `oneSignalId` varchar(45) DEFAULT NULL,
  `user_id` varchar(45) DEFAULT NULL,
  `date` varchar(45) DEFAULT NULL,
  `author_image` varchar(45) DEFAULT NULL,
  `author_name` varchar(45) DEFAULT NULL,
  `quote_text` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=406 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




CREATE TABLE `8PMNotificationTable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(45) DEFAULT NULL,
  `lastSurveyCompletedTsUserTZ` varchar(45) DEFAULT NULL,
  `currentTimeTsUserTZ` varchar(45) DEFAULT NULL,
  `lastSurveyCompletedUTC` varchar(45) DEFAULT NULL,
  `currentTimeTsUTC` varchar(45) DEFAULT NULL,
  `is9PMNotificationSent` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=247 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




CREATE TABLE `UnlockedIncentive` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(45) DEFAULT NULL,
  `incentiveString` text,
  `whenInserted` varchar(45) DEFAULT NULL,
  `whenInsertedReadableTs` text,
  `incentiveType` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




