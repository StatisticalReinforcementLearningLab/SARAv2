-- MySQL dump 10.13  Distrib 8.0.23, for Linux (x86_64)
--
-- Host: ec2-18-234-198-173.compute-1.amazonaws.com    Database: study
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `filled`
--

DROP TABLE IF EXISTS `filled`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `filled` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(45) NOT NULL,
  `survey_name` varchar(45) NOT NULL,
  `survey_completion_time` varchar(20) DEFAULT NULL,
  `json_answer` mediumtext,
  `when_inserted` varchar(50) DEFAULT NULL,
  `response_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=818 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `filled`
--

LOCK TABLES `filled` WRITE;
/*!40000 ALTER TABLE `filled` DISABLE KEYS */;
INSERT INTO `filled` VALUES (815,'chloe_aya','evening_survey','1596847041301','{\"surveyStartTimeUTC\": 1596847025535, \"onclickTimeForDifferentQuestions\": {\"Q1\": {\"ts\": 1596847028239, \"readable_ts\": \"August 7th 2020, 2:37:08 pm -10:00\"}, \"Q2\": {\"ts\": 1596847030633, \"readable_ts\": \"August 7th 2020, 2:37:10 pm -10:00\"}, \"Q3\": {\"ts\": 1596847034090, \"readable_ts\": \"August 7th 2020, 2:37:14 pm -10:00\"}, \"Q4\": {\"ts\": 1596847035690, \"readable_ts\": \"August 7th 2020, 2:37:15 pm -10:00\"}}, \"Q1\": \"0\", \"Q2\": \" Often\", \"Q3\": \" >= 9 hours\", \"Q4\": \" yes\", \"ts\": \"August 7th 2020, 2:37:21 pm -10:00\", \"devicInfo\": [\"tablet\", \"desktop\"]}','2021-02-15 19:10:51','e9b69ba7-e72f-4417-9f97-88b3226dc3a7'),(816,'chloe_aya','evening_survey','1596847041301','{\"surveyStartTimeUTC\": 1596847025535, \"onclickTimeForDifferentQuestions\": {\"Q1\": {\"ts\": 1596847028239, \"readable_ts\": \"August 7th 2020, 2:37:08 pm -10:00\"}, \"Q2\": {\"ts\": 1596847030633, \"readable_ts\": \"August 7th 2020, 2:37:10 pm -10:00\"}, \"Q3\": {\"ts\": 1596847034090, \"readable_ts\": \"August 7th 2020, 2:37:14 pm -10:00\"}, \"Q4\": {\"ts\": 1596847035690, \"readable_ts\": \"August 7th 2020, 2:37:15 pm -10:00\"}}, \"Q1\": \"0\", \"Q2\": \" Often\", \"Q3\": \" >= 9 hours\", \"Q4\": \" yes\", \"ts\": \"August 7th 2020, 2:37:21 pm -10:00\", \"devicInfo\": [\"tablet\", \"desktop\"]}','2021-02-15 19:13:55','297330d0-2c36-493d-bbe1-f43869458906'),(817,'chloe_aya','evening_survey','1596847041301','{\"surveyStartTimeUTC\": 1596847025535, \"onclickTimeForDifferentQuestions\": {\"Q1\": {\"ts\": 1596847028239, \"readable_ts\": \"August 7th 2020, 2:37:08 pm -10:00\"}, \"Q2\": {\"ts\": 1596847030633, \"readable_ts\": \"August 7th 2020, 2:37:10 pm -10:00\"}, \"Q3\": {\"ts\": 1596847034090, \"readable_ts\": \"August 7th 2020, 2:37:14 pm -10:00\"}, \"Q4\": {\"ts\": 1596847035690, \"readable_ts\": \"August 7th 2020, 2:37:15 pm -10:00\"}}, \"Q1\": \"0\", \"Q2\": \" Often\", \"Q3\": \" >= 9 hours\", \"Q4\": \" yes\", \"ts\": \"August 7th 2020, 2:37:21 pm -10:00\", \"devicInfo\": [\"tablet\", \"desktop\"]}','2021-02-15 19:16:47','ccd3fb32-709b-4e10-9f72-0557cb079712');
/*!40000 ALTER TABLE `filled` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-15 14:22:08
