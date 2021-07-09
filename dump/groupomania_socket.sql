-- MySQL dump 10.13  Distrib 8.0.23, for macos10.15 (x86_64)
--
-- Host: localhost    Database: groupomania_socket
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
-- Table structure for table `Messages`
--

DROP TABLE IF EXISTS `Messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Messages` (
  `message` text NOT NULL,
  `user_id` text NOT NULL,
  `session_id` varchar(40) NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Messages`
--

LOCK TABLES `Messages` WRITE;
/*!40000 ALTER TABLE `Messages` DISABLE KEYS */;
INSERT INTO `Messages` VALUES ('reterretertter','O5Sa9FXsZht1R1uPAAAr','fezfzz',0),('noononon','0qa859jGyogdn-AnAAAj','gregergeg',0),('fzpoizfe','KiYQ9C0QYr2Vdi6PAAAS','ok',0),('fzopeifp^z','KiYQ9C0QYr2Vdi6PAAAS','ok',0),('fzeopofze','KiYQ9C0QYr2Vdi6PAAAS','ok',0),('zjjoioiufz','zqw_4VM1fQGkx8fjAAHm','bonjour',0),('fzefozpipoifze','cfI25vyiRnEwVX6bAAHo','ok',0),('fezfzef','14','30-14',1),('fzef','14','30-14',1),('gfe','14','30-14',1),('fezfz','14','30-14',1),('fezfzef','14','30-14',1),('fzezfe','14','30-14',1),('Bonjour','14','30-14',1),('ffzfzefz\n','30','30-14',1),('Comment ça va ?','14','30-14',1),('bonjour','30','30-11',0),('Bonjour\n','30','30-14',1),('fefzfzfeffzfzfezf','30','30-14',1),('fzefzefzefzfz','30','30-14',1),('fezfzefzfzefzfzef','30','30-14',1),('erggegergegr','30','30-14',1),('Bonjour','30','30-14',1),('Salut !','30','30-14',1),('Bonjour','30','30-14',1),('Salut !','30','30-14',1),('Bonjour','30','30-14',1),('Salut !','30','30-14',1),('ffezfzf','30','30-14',1),('fozekjfo zeiufoziu rozeiu ofozek jfozei ufoziur ozeiuofo zekjfoz eiufo ziur ozeiu ofo zekjfozeiufo ziurozeiuofozekjfozeiufo ziurozeiuofozekjfo zeiufoziu rozeiuo fozekjfo zeiufo ziur ozeiuo','14','30-14',1),('Nouveau message','30','30-14',1),('Salut !','30','30-14',1),('Bonjour','30','30-14',1),('rep','30','30-14',1),('Salut !','14','30-14',1),('Nouveau emssage','30','30-14',1),('Salut','30','30-14',1),('Salut','14','30-14',1),('Salut','14','30-14',1),('Bonjour','30','30-14',1),('Bonjour','14','30-14',1),('!!','14','30-14',1),('lkjlk','14','30-14',1),('tretert','30','30-14',1),('tertertetr','30','30-14',1),('Bonjour','30','30-14',1),('bonjour','30','30-14',1),('rezrzerzr','30','30-14',1),('trterert','30','30-14',1),('fezfzefzf','30','30-14',1),('fezfzefze','30','30-14',1),('fzfezfzefz','30','30-14',1),('Slaut !','30','30-14',1),('fzzfzefzf','30','30-14',1),('fzfzefzf','30','30-14',1),('llililokjo','30','30-14',1),('fzefzfef','30','30-14',1),('fezfzefzf','14','30-14',1),('fezfzfz','30','30-14',1),('fezfzfzfz','30','30-14',1),('fezfzef','30','30-14',1),('fezfzfzfzef','30','30-14',1),('ok','30','30-14',1),('Bonjour','30','30-14',1),('salut','14','30-14',1),('salut','30','30-14',1),('fezfzefzf','14','30-14',1),('fezfzfzf','14','30-14',1),('Bonjour','30','30-14',1),('Salut','30','30-14',1),('Salut','14','30-14',1),('SAlut','14','30-14',1),('salut','14','30-14',1),('gp zojpoe gzigpz oigzp eoi gp zojpoe gzigpz oigzp eoi gp zojpoe gzigpz oigzp eoi gp zojpoe gzigpz oigzp eoi gp zojpoe gzigpz oigzp eoi gp zojpoe gzigpz oigzp eoigp zojpoe gzigpz oigzp eoi','14','30-14',1),('gp zojpoe gzigpz oigzp eoi gp zojpoe gzigpz oigzp eoi gp zojpoe gzigpz oigzp eoi gp zojpoe gzigpz oigzp eoi gp zojpoe gzigpz oigzp eoi gp zojpoe gzigpz oigzp eoigp zojpoe gzigpz oigzp eoi','30','30-14',1),('fezfzefz','14','30-14',1);
/*!40000 ALTER TABLE `Messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sessions`
--

DROP TABLE IF EXISTS `Sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sessions` (
  `session_id` varchar(30) NOT NULL,
  `user_id_1` int NOT NULL,
  `user_id_2` int NOT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sessions`
--

LOCK TABLES `Sessions` WRITE;
/*!40000 ALTER TABLE `Sessions` DISABLE KEYS */;
INSERT INTO `Sessions` VALUES ('14-1',14,1),('14-11',14,11),('14-2',14,2),('14-22',14,22),('14-23',14,23),('14-26',14,26),('14-4',14,4),('14-6',14,6),('14-7',14,7),('14-8',14,8),('30-11',30,11),('30-14',30,14);
/*!40000 ALTER TABLE `Sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `name` text,
  `user_id` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('okok','3eOY69dqHm8zcATsAAAL'),('kjk','jR8z2dopakx8iujYAAAN'),('ffzefzefzf','GbTBscdiuaQes4ZQAAAf'),('gregergeg','0qa859jGyogdn-AnAAAj'),('fezfzz','O5Sa9FXsZht1R1uPAAAr'),('zgzrzgr','4ys3MODSPQhQSOQLAABG'),('ok','KiYQ9C0QYr2Vdi6PAAAS'),('bonjour','Iad31RRJAJna5_fzAAHI');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-09 18:16:07
