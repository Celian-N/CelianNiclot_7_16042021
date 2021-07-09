-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: localhost    Database: groupomania
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Comments`
--

DROP TABLE IF EXISTS `Comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Comments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `author_id` int unsigned NOT NULL,
  `publication_id` int unsigned NOT NULL,
  `user_liked` text,
  `text` tinytext,
  `creation_date` datetime NOT NULL,
  `signaled` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `index_author` (`author_id`),
  KEY `fk_comment_publication_id` (`publication_id`),
  FULLTEXT KEY `index_likes` (`user_liked`),
  CONSTRAINT `fk_comment_author_id` FOREIGN KEY (`author_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comment_publication_id` FOREIGN KEY (`publication_id`) REFERENCES `Publications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comments`
--

LOCK TABLES `Comments` WRITE;
/*!40000 ALTER TABLE `Comments` DISABLE KEYS */;
INSERT INTO `Comments` VALUES (1,14,48,'[14]','Voici le premier commentaire 6709','2021-05-07 11:09:44',0),(5,14,48,'[14]','Test de nouveau commentaire updaté','2021-05-07 13:00:56',0),(6,14,47,'[14]','Testcommentaire','2021-05-07 13:01:03',0),(7,14,46,'[14]','TestCommentaire 3','2021-05-07 13:01:11',0),(9,14,56,'[14]','Nous aussi on est très (moyennement) content que tu sois la ','2021-05-07 18:08:57',0),(10,14,53,'[]','Test de commentaire','2021-05-16 23:01:13',0),(11,14,57,'[14]','Super commentaire !!','2021-05-17 09:58:04',0),(12,14,60,'[]','Nouveau commentaire','2021-05-20 11:30:49',0),(13,14,60,'[14]','Nouveau commentaire','2021-05-20 11:33:50',0),(14,14,60,'[14]','Test comment','2021-05-20 11:36:22',0),(15,14,60,'[14]','nouveauffzfzfzfzfzffzfzefzfezfzfz','2021-05-20 11:37:40',0),(16,14,61,'[]','Bonjour voici un nouveau commentaire','2021-05-20 15:12:41',0),(17,14,61,'[]','autogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogrowautogro','2021-05-20 15:24:23',0),(18,14,61,'[]','autogr owauto growautog rowautogr owautogrow ','2021-05-20 15:26:25',0),(19,14,61,'[]','autogrowautogrow autogrow autogrow autogrow autogrow autogrow autogrow autogrow autogrow autogrow autogrow','2021-05-20 15:26:40',0),(20,14,81,'[]','mlkefmlkzfemfzefze','2021-05-21 21:12:54',0),(21,14,85,'[14]','Super !','2021-05-22 15:08:24',0),(22,8,86,'[31]','bonjour voici un commentaire','2021-06-03 13:58:18',0),(23,14,85,'[]','Nouveu commentaire','2021-06-04 11:47:45',0);
/*!40000 ALTER TABLE `Comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Publications`
--

DROP TABLE IF EXISTS `Publications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Publications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `author_id` int unsigned NOT NULL,
  `user_liked` text,
  `image_url` varchar(255) DEFAULT NULL,
  `gif_url` varchar(255) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `text` text,
  `link` text,
  `creation_date` datetime NOT NULL,
  `signaled` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `index_author` (`author_id`),
  CONSTRAINT `fk_author_id` FOREIGN KEY (`author_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Publications`
--

LOCK TABLES `Publications` WRITE;
/*!40000 ALTER TABLE `Publications` DISABLE KEYS */;
INSERT INTO `Publications` VALUES (18,14,'[]','',NULL,NULL,NULL,NULL,'2021-04-25 22:01:02',0),(40,14,'[]','http://localhost:3000/images/Capture_d’écran_2021-04-20_à_12.04.01-1620303993275.png',NULL,NULL,'Bonjour',NULL,'2021-05-06 14:26:33',0),(41,14,'[]','http://localhost:3000/images/Capture_d’écran_2021-05-05_à_16.46.50-1620304304566.png',NULL,NULL,NULL,NULL,'2021-05-06 14:31:45',0),(42,14,'[]',NULL,NULL,NULL,'fezfzfzefezfzfz',NULL,'2021-05-06 18:47:30',0),(43,14,'[]',NULL,NULL,NULL,NULL,NULL,'2021-05-06 18:47:32',0),(44,14,'[]',NULL,NULL,NULL,NULL,NULL,'2021-05-06 18:47:34',0),(45,14,'[]',NULL,NULL,NULL,'fzefefzfeffzfzfzef',NULL,'2021-05-06 18:47:38',0),(46,14,'[]',NULL,NULL,NULL,'fzefzefzefzefzefzefzefzf',NULL,'2021-05-06 18:47:44',0),(47,14,'[]','http://localhost:3000/images/Capture_d’écran_2021-05-05_à_16.46.50-1620320067461.png',NULL,NULL,'kjhkjhkj',NULL,'2021-05-06 18:54:27',0),(48,14,'[]',NULL,'https://media.giphy.com/media/RQSuZfuylVNAY/giphy.gif',NULL,'ffezfzefzeffzefzfzfzfezfz',NULL,'2021-05-06 19:20:00',0),(49,14,'[]',NULL,NULL,'https://www.youtube-nocookie.com/embed/Zwlaey0gu4c','NOUVELL PUBLICATION !',NULL,'2021-05-07 15:27:40',0),(53,14,'[14]','http://localhost:3000/images/publications/Capture_d’écran_2021-05-05_à_16.46.50-1620401045779.png',NULL,NULL,'fzfzfzefez',NULL,'2021-05-07 17:24:06',0),(54,14,'[]','http://localhost:3000/images/publications/Capture_d’écran_2021-04-20_à_12.04.01-1620402816529.png',NULL,NULL,'gyugutuytuytuytuytuy',NULL,'2021-05-07 17:53:37',0),(55,14,'[14]','http://localhost:3000/images/publications/Capture_d’écran_2021-05-05_à_16.46.50-1620403333217.png',NULL,NULL,'fzzfezfzfezf',NULL,'2021-05-07 18:02:13',0),(56,14,'[14]',NULL,'https://media.giphy.com/media/3og0ICmyySyzbmnxqE/giphy.gif',NULL,'Bonjour je suis Lyza et je suis très très très très contente d\'être avec vous !',NULL,'2021-05-07 18:08:31',0),(57,14,'[14]','http://localhost:3000/images/publications/Capture_d’écran_2021-05-05_à_16.46.50-1620488251063.png',NULL,NULL,'BONJOUR TEST',NULL,'2021-05-08 17:37:31',0),(58,14,'[]',NULL,NULL,NULL,'Nouvelle publication',NULL,'2021-05-17 09:57:29',0),(59,14,'[14]',NULL,NULL,'https://www.youtube-nocookie.com/embed/T2HJZ04K3Ko','fezfzefze',NULL,'2021-05-17 09:57:43',0),(60,14,'[14]',NULL,'https://media.giphy.com/media/Pn1gZzAY38kbm/giphy.gif',NULL,'Nouveau text',NULL,'2021-05-17 10:00:07',0),(61,14,'[]',NULL,NULL,NULL,'Nouvelle publication',NULL,'2021-05-20 11:38:00',0),(62,14,'[]',NULL,NULL,NULL,'Test du toast',NULL,'2021-05-21 10:15:12',0),(63,14,'[]',NULL,NULL,NULL,'Test du toast',NULL,'2021-05-21 10:15:51',0),(65,14,'[]',NULL,NULL,NULL,NULL,'https://www.lemonde.fr/planete/article/2021/05/20/covid-19-dans-le-monde-les-vaccins-efficaces-contre-tous-les-variants-assure-l-oms_6080869_3244.html','2021-05-21 12:15:25',0),(77,14,'[]',NULL,NULL,NULL,'Allez voir cette article !','https://www.lemonde.fr/planete/article/2021/05/20/covid-19-dans-le-monde-les-vaccins-efficaces-contre-tous-les-variants-assure-l-oms_6080869_3244.html','2021-05-21 15:12:24',0),(79,14,'[]',NULL,NULL,'https://www.youtube-nocookie.com/embed/GdtQfZG7auo',NULL,NULL,'2021-05-21 21:10:20',0),(80,14,'[]',NULL,'https://media.giphy.com/media/oDLDbBgf0dkis/giphy.gif',NULL,'Nouvelle publication',NULL,'2021-05-21 21:11:01',0),(81,14,'[]',NULL,NULL,NULL,'Allez voir cette article !','https://www.lemonde.fr/afrique/article/2021/05/21/tchad-l-union-africaine-exige-une-transition-democratique-en-dix-huit-mois_6080976_3212.html','2021-05-21 21:11:45',0),(82,14,'[]','http://localhost:3000/images/logo-cood-1621627572400.png',NULL,NULL,NULL,NULL,'2021-05-21 22:06:12',0),(84,14,'[]','http://localhost:3000/images/publications/logo-cood-1621628303395.png',NULL,NULL,NULL,NULL,'2021-05-21 22:18:23',0),(85,14,'[14,31]',NULL,NULL,NULL,'Bonjour !','https://vuejsexamples.com/a-facebook-like-avatar-picture-component-for-vue-js/','2021-05-22 15:08:14',0),(86,8,'[31]',NULL,NULL,NULL,'Test de nouvelle publication avec un autre compte',NULL,'2021-06-03 13:58:09',0),(88,30,'[31,14]',NULL,NULL,NULL,'Super !',NULL,'2021-06-18 18:04:10',0);
/*!40000 ALTER TABLE `Publications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstname` varchar(30) NOT NULL,
  `lastname` varchar(30) NOT NULL,
  `job` varchar(100) DEFAULT NULL,
  `creation_date` datetime NOT NULL,
  `user_pic` varchar(255) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `admin_role` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ind_email` (`email`),
  FULLTEXT KEY `index_name` (`firstname`,`lastname`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'patrick@gmail.com','$2b$10$bsaNfYdHKCI81zeILXbfmOAnKWl9gXl.wPHJ8/UlquvgtCcWr8c0K','Patrick','Hernando','Professeur de langues','2021-04-16 19:07:45','http://localhost:3000/images/profil-pic/Patrick_Hernando-1625215203246.jpg',1,0),(2,'jean@gmail.com','motdepasse','Jean','Maitre','Professeur de maths','2021-04-18 19:19:51','http://localhost:3000/images/profil-pic/Jean_Maitre-1625215203246.jpg',1,0),(4,'marcel.p@gmail.com','motdepasse','Marcel','Patulacci','Agent de la paix','2021-04-18 19:22:05','http://localhost:3000/images/profil-pic/Marcel_Patulacci-1625215203246.jpg',1,0),(5,'cindy@gmail.com','motdepasse','Cindy','Varice','Femme de ménage','2021-04-18 19:22:53','http://localhost:3000/images/profil-pic/Cindy_Varice-1625215203246.jpg',1,0),(6,'philippe@gmail.com','motdepasse','Philippe','Etche','Chef cuisinier','2021-04-18 19:25:37','http://localhost:3000/images/profil-pic/Philippe_Etche-1625215203246.jpg',1,0),(7,'mimi@gmail.com','motdepasse','Mimi','Siku','Indien','2021-04-18 19:26:20','http://localhost:3000/images/profil-pic/Mimi_Siku-1625215203246.jpg',1,0),(8,'eve@gmail.com','$2b$10$88cmVjlCK7a.q0LdAdDDY.uxP9rZWNTgQWF3.x7u6ZJDOB.TmimS.','Eve','Matrotta','Comptable','2021-04-19 18:39:12','http://localhost:3000/images/profil-pic/Eve_Matrotta-1625215203246.jpg',0,0),(9,'fezfze','$2b$10$2z5KrbABl6FDY2WkQnJQx.Hktve6z7swG3AH9l8QZyZecBT2USKye','fzfzefz','fezfzef','fezfzef','2021-04-23 09:43:08',NULL,1,0),(10,'testABCD@gmail.com','$2b$10$9U9Ve6ztAHRTVP5ZFbelCOHguL3jTodfulXSg7wnb59z7myyXCdqC','ABCD','ABCD','ABCD','2021-04-23 09:47:10',NULL,1,0),(11,'testcelian@gmail.com','$2b$10$mPwnYxCypWsz90WTUR6ZU.rVySK8/NSvZv3n8GnYOZpZrthOI6KTu','Célian','nicl','déev','2021-04-23 10:44:11',NULL,1,0),(13,'testcelian2@gmail.com','$2b$10$CZ1ztpqohSotoIyI/OYOMuJxLav.32YqvtutsJqZYzU.VdqvbOUWG','celian','nicl','dev','2021-04-23 10:47:57',NULL,1,0),(14,'admin@gmail.com','$2b$10$idFQ4J6Qn1ThttAswotLd.4QwJYEMxLxGD/B6TdYhxcn./PIrWxAy','Céliannnnn','Niclottttt','Développeur Web','2021-04-25 18:21:01','http://localhost:3000/images/profil-pic/Celiannnnn_Niclottttt-1625591885602.jpg',1,1),(15,'test2@gmail.com','$2b$10$L3DMlWY1YgyhToJDhEczQO3lkCWKW1n3T1ssqLgUsDKvFwtxXdjr6','fzefzfzef','fezfzefzef','fezfzefzezefzf','2021-05-06 15:51:08',NULL,1,0),(17,'fezfzfzefzefz@gmail.com','$2b$10$fWTPgXfXYV0cvgLId/DRCO/yd3cTp.7DNd5MI0dXFkVRf3NOBAoYq','fezfzfzefzef','fezfzfzefzefz','','2021-05-06 15:58:10',NULL,1,0),(18,'fezfzfzefzefz2@gmail.com','$2b$10$wBNUBtGntiXxD.Zmr3iDQei.PtgMhVxTVVgCIds/hxG79MWVbyjru','fezfzfzefzefz','fezfzfzefzefz','','2021-05-06 16:01:02',NULL,1,0),(19,'AZERTYUIOP@gmail.com','$2b$10$efbGcYEklfVL65U8ztYcUeq/RtRH5Vj51zUE6iIKkJ7yo1lszFEuq','AZERTYUIOP','AZERTYUIOP','','2021-05-06 16:06:10',NULL,1,0),(20,'req.body.email@gmail.com','$2b$10$O.FmDjTZCN8p2LiN34ihpeFyer5PI4j7FwFkU0ZiiyYAVdYbLfHTK','req.body.firstname','req.body.lastname','','2021-05-06 16:08:57',NULL,1,0),(21,'fozeiufoizufozefiu@gmail.com','$2b$10$kbWBMdSNckLN39OC59dnzeJg/EARR.rsBZJohEhLmyJcbW0/EwR.i','frezfzefezf','efzfzfzfezfze','','2021-05-06 16:15:13',NULL,1,0),(22,'emma@gmail.com','$2b$10$fvZGYGYxSjzNt855mq2TUO7HoiVvJ5ASRx9T12qyebBPxc3jObjrC','Emma','Julien','Directrice RH','2021-05-06 16:17:24','http://localhost:3000/images/profil-pic/Emma_Julien-1625215203246.jpg',1,0),(23,'edouard@gmail.com','$2b$10$XUlFA4CunOLXui4K9I9g3OBQMQTYEJGmWLx0KrLwXx.imeEYC1NyO','Edouard','Dabali','Informatitien','2021-05-06 16:19:06','http://localhost:3000/images/profil-pic/Edouard_Dabali-1625215203246.jpg',1,0),(24,'fezefzefzefzef@gmail.com','$2b$10$7gCRFzCMqM4308RLh9Ln8eCvQOS8dtiNaT0wej0wV7q1t2aP7U5Gy','fezefzefzefzef','fezefzefzefzef','fezefzefzefzef','2021-05-06 16:25:45',NULL,1,0),(25,'fezefzefzefzef2@gmail.com','$2b$10$uEfhvdMNDzWYS1I4YYySAOhfgeq1t5E/QDH7R.IvGuwu9AXOO3CE.','fezefzefzefzef2','fezefzefzefzef2','fezefzefzefzef2','2021-05-06 16:28:10',NULL,1,0),(26,'jade@gmail.com','$2b$10$mrAlVKyls.mAI9SQ1UmlR.eaR3gdh83HFs/LcbGQBYd8JDnXVGZ0.','Jade','Boulie','Assistante communication','2021-05-06 17:11:36','http://localhost:3000/images/profil-pic/Jade_Boulie-1625215203246.jpg',1,0),(27,'POIUYT678@test.com','$2b$10$tVErG9UyD4/hZ8YB5yg13.032HgMSHGsW6Mg8ewq46Afw2BFJe1MC','POIUYT678','POIUYT678','POIUYT678','2021-05-06 17:12:23',NULL,1,0),(28,'POIUYT6789@test.com','$2b$10$Mmz1.r6dI8pnoF5nAI3vauxPKoLjQIgG.RjWRKjrGBaZl.5cvKwH.','POIUYT6789','POIUYT6789','POIUYT6789','2021-05-06 17:15:38',NULL,1,0),(29,'POIUYT67890@test.com','$2b$10$DtKK9NCQ0NIE1Xl5yC.V7.hSmXmpTDgOqw58VOVU9N3k40T.NySei','POIUYT67890','POIUYT67890','POIUYT67890','2021-05-06 17:16:39',NULL,1,0),(30,'Marcel.pagnol@gmail.com','$2b$10$kIKdgbHT0pv6pgbWfdHEzeo/NHJoY4QuXk542nJVAx138s5vq9LTe','Marcel','Pagnol','Rédacteur','2021-06-04 17:30:35','http://localhost:3000/images/profil-pic/Marcel_Pagnol-1625215203246.jpg',1,0),(31,'jeand@gmail.com','$2b$10$hrH8Bdcifm7P5yzAqc9j4u6holm86gjTLFOJX5LZ92rHer7WJpOiG','Jean','Delaforet','Jardinier','2021-06-06 16:11:39','http://localhost:3000/images/profil-pic/Jean_Delaforet-1625215203246.jpg',1,0),(33,'didier.barjon@gmail.com','$2b$10$KMgyca0jbXDONhIeb10vqe0YNAdW9zStncPpnbgwIGMHzIloR.7kG','Didier','Barjon','Patron','2021-07-06 18:54:49',NULL,1,0);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-09 18:03:54
