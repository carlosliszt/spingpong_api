CREATE DATABASE  IF NOT EXISTS `spingpong` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `spingpong`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: spingpong
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `atletas`
--

DROP TABLE IF EXISTS `atletas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atletas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_nascimento` date DEFAULT NULL,
  `sexo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `rating_atual` decimal(10,2) NOT NULL DEFAULT '250.00',
  `ranking_posicao` int unsigned DEFAULT NULL,
  `partidas_jogadas` int unsigned NOT NULL DEFAULT '0',
  `vitorias` int unsigned NOT NULL DEFAULT '0',
  `derrotas` int unsigned NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_atletas_email` (`email`),
  KEY `idx_atletas_ranking` (`ranking_posicao`),
  KEY `idx_atletas_rating` (`rating_atual`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atletas`
--

LOCK TABLES `atletas` WRITE;
/*!40000 ALTER TABLE `atletas` DISABLE KEYS */;
INSERT INTO `atletas` VALUES (1,'Tiago Sakagute',NULL,NULL,NULL,NULL,1,1202.00,NULL,0,0,0,'2026-04-26 14:24:53','2026-04-26 14:24:53'),(2,'Carlos Ventini',NULL,NULL,NULL,NULL,1,326.00,NULL,6,4,2,'2026-04-26 14:24:53','2026-04-28 15:23:29'),(3,'Sidnei',NULL,NULL,NULL,NULL,1,326.00,NULL,6,4,2,'2026-04-26 14:24:53','2026-04-28 15:23:19'),(4,'Flávia',NULL,NULL,NULL,NULL,1,303.00,NULL,6,2,4,'2026-04-26 14:24:53','2026-04-28 15:24:30'),(5,'Laís',NULL,NULL,NULL,NULL,1,208.00,NULL,6,1,5,'2026-04-26 14:24:53','2026-04-28 15:25:25'),(6,'Luiz Kuwahara',NULL,NULL,NULL,NULL,1,513.00,NULL,0,0,0,'2026-04-26 14:24:53','2026-04-26 14:24:53'),(7,'Penido',NULL,NULL,NULL,NULL,1,785.00,NULL,8,7,1,'2026-04-26 14:24:53','2026-04-28 19:09:45'),(8,'Carlos Nakamura',NULL,NULL,NULL,NULL,1,218.00,NULL,6,1,5,'2026-04-26 14:24:53','2026-04-28 15:24:16'),(9,'Érika Nakamura',NULL,NULL,NULL,NULL,1,294.00,NULL,8,4,4,'2026-04-26 14:24:53','2026-04-28 19:10:23'),(10,'Mark Livax',NULL,NULL,NULL,NULL,1,256.00,NULL,8,3,5,'2026-04-26 14:24:53','2026-04-28 19:10:23'),(11,'Mateus Dias',NULL,NULL,NULL,NULL,1,384.00,NULL,9,7,2,'2026-04-26 14:24:53','2026-04-28 19:11:39'),(12,'Heitor Diniz',NULL,NULL,NULL,NULL,1,709.00,NULL,8,7,1,'2026-04-26 14:24:53','2026-04-28 19:10:01'),(13,'Guilherme Nunes',NULL,NULL,NULL,NULL,1,290.00,NULL,7,4,3,'2026-04-26 14:24:53','2026-04-28 15:33:13'),(14,'Monica',NULL,NULL,NULL,NULL,1,1907.00,NULL,6,5,1,'2026-04-26 14:24:53','2026-04-28 15:23:25'),(15,'Daniel Pioli',NULL,NULL,NULL,NULL,1,162.00,NULL,6,0,6,'2026-04-26 14:24:53','2026-04-28 15:25:36'),(16,'Samuel Fernández',NULL,NULL,NULL,NULL,1,184.00,NULL,6,0,6,'2026-04-26 14:24:53','2026-04-28 15:25:42'),(17,'Thiago Vichi',NULL,NULL,NULL,NULL,1,216.00,NULL,5,1,4,'2026-04-26 14:24:53','2026-04-28 13:11:42'),(18,'Miguel Pollesi',NULL,NULL,NULL,NULL,1,200.00,NULL,7,1,6,'2026-04-26 14:24:53','2026-04-28 15:33:57'),(19,'Allan',NULL,NULL,NULL,NULL,1,1744.00,NULL,9,9,0,'2026-04-26 14:24:53','2026-04-28 19:11:33'),(20,'Ivone',NULL,NULL,NULL,NULL,1,214.00,NULL,6,1,5,'2026-04-26 14:24:53','2026-04-28 15:25:13'),(21,'PH',NULL,NULL,NULL,NULL,1,330.00,NULL,7,4,3,'2026-04-26 14:24:53','2026-04-28 15:33:18'),(22,'Alex',NULL,NULL,NULL,NULL,1,300.00,NULL,7,4,3,'2026-04-26 14:24:53','2026-04-28 19:10:18'),(23,'Carlos Moliterno',NULL,NULL,NULL,NULL,1,322.00,NULL,6,4,2,'2026-04-26 14:24:53','2026-04-28 15:23:06'),(24,'Denny',NULL,NULL,NULL,NULL,1,984.00,NULL,6,5,1,'2026-04-26 14:24:53','2026-04-28 15:23:35'),(25,'Arthur De Mano',NULL,NULL,NULL,NULL,1,398.00,NULL,6,4,2,'2026-04-26 14:24:53','2026-04-28 15:22:54'),(26,'Ricardo De Mano',NULL,NULL,NULL,NULL,1,256.00,NULL,6,2,4,'2026-04-26 14:24:53','2026-04-28 15:24:21'),(27,'André Cavalcante',NULL,NULL,NULL,NULL,1,280.00,NULL,6,3,3,'2026-04-26 14:24:53','2026-04-28 15:24:34'),(28,'João gabriel',NULL,NULL,NULL,NULL,1,262.00,NULL,6,3,3,'2026-04-26 14:24:53','2026-04-28 15:24:10'),(29,'Arthur Neder',NULL,NULL,NULL,NULL,1,226.00,NULL,6,2,4,'2026-04-26 14:24:53','2026-04-28 15:24:58'),(30,'Heitor pires',NULL,NULL,NULL,NULL,1,194.00,0,6,1,5,'2026-04-26 14:24:53','2026-04-28 15:25:48'),(31,'Lincoln',NULL,NULL,NULL,NULL,1,609.00,NULL,6,4,2,'2026-04-26 14:24:53','2026-04-28 15:23:13'),(32,'Gui Gomes',NULL,NULL,NULL,NULL,1,343.00,NULL,6,5,1,'2026-04-26 14:24:53','2026-04-28 15:23:01'),(33,'Eduardo Tigre',NULL,NULL,NULL,NULL,1,258.00,NULL,8,3,5,'2026-04-26 14:24:53','2026-04-28 19:10:42'),(34,'Nicolas Yudi',NULL,NULL,NULL,NULL,1,200.00,NULL,7,1,6,'2026-04-26 14:24:53','2026-04-28 15:34:03'),(35,'Eric Uematsu',NULL,NULL,NULL,NULL,1,272.00,NULL,7,3,4,'2026-04-26 14:24:53','2026-04-28 15:33:30'),(36,'kayky komatsu',NULL,NULL,NULL,NULL,1,168.00,NULL,6,0,6,'2026-04-26 14:24:53','2026-04-28 15:25:59'),(37,'Renan Megazord',NULL,NULL,NULL,NULL,1,694.00,NULL,9,8,1,'2026-04-26 14:24:53','2026-04-28 19:11:33'),(38,'Junior Moura',NULL,NULL,NULL,NULL,1,240.00,NULL,7,2,5,'2026-04-26 14:24:53','2026-04-28 15:33:42'),(39,'Marcelo Ferreira',NULL,NULL,NULL,NULL,1,270.00,NULL,6,3,3,'2026-04-26 14:24:53','2026-04-28 15:24:45'),(40,'Marcelinho filho',NULL,NULL,NULL,NULL,1,344.00,NULL,9,6,3,'2026-04-26 14:24:53','2026-04-28 19:11:39'),(41,'Lucas Yu Sen',NULL,NULL,NULL,NULL,1,210.00,NULL,6,1,5,'2026-04-26 14:24:53','2026-04-28 15:25:07'),(42,'Pedro Fortes',NULL,NULL,NULL,NULL,1,347.00,NULL,7,5,2,'2026-04-26 14:24:53','2026-04-28 15:32:41'),(43,'Rafael Peres',NULL,NULL,NULL,NULL,1,364.00,NULL,7,5,2,'2026-04-26 14:24:53','2026-04-28 15:32:56'),(44,'Felipe Dutra',NULL,NULL,NULL,NULL,1,282.00,NULL,7,3,4,'2026-04-26 14:24:53','2026-04-28 15:33:23'),(45,'Rafael Nishi',NULL,NULL,NULL,NULL,1,224.00,NULL,7,2,5,'2026-04-26 14:24:53','2026-04-28 15:33:49'),(46,'Nelson',NULL,NULL,NULL,NULL,1,1069.00,NULL,7,6,1,'2026-04-26 14:24:53','2026-04-28 15:32:47'),(47,'Hugo Hideki',NULL,NULL,NULL,NULL,1,1022.00,NULL,7,5,2,'2026-04-26 14:24:53','2026-04-28 15:32:52'),(48,'Enzo Perreti',NULL,NULL,NULL,NULL,1,216.00,NULL,8,2,6,'2026-04-26 14:24:53','2026-04-28 19:10:42'),(49,'Ricardo Vieria',NULL,NULL,NULL,NULL,1,252.00,NULL,6,2,4,'2026-04-26 14:24:53','2026-04-28 15:24:04'),(50,'Ricardo Filho',NULL,NULL,NULL,NULL,1,292.00,NULL,8,4,4,'2026-04-26 14:24:53','2026-04-28 19:10:10');
/*!40000 ALTER TABLE `atletas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competicoes`
--

DROP TABLE IF EXISTS `competicoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competicoes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PLANEJADA',
  `local` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` bigint unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_competicoes_tipo` (`tipo`),
  KEY `idx_competicoes_status` (`status`),
  KEY `fk_comp_created_by` (`created_by`),
  CONSTRAINT `fk_comp_created_by` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `chk_comp_periodo` CHECK (((`data_fim` is null) or (`data_fim` >= `data_inicio`))),
  CONSTRAINT `chk_comp_status` CHECK ((`status` in (_utf8mb4'PLANEJADA',_utf8mb4'EM_ANDAMENTO',_utf8mb4'FINALIZADA',_utf8mb4'CANCELADA'))),
  CONSTRAINT `chk_comp_tipo` CHECK ((`tipo` in (_utf8mb4'SPING_OPEN',_utf8mb4'SPING_FOODS')))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competicoes`
--

LOCK TABLES `competicoes` WRITE;
/*!40000 ALTER TABLE `competicoes` DISABLE KEYS */;
INSERT INTO `competicoes` VALUES (5,'I Etapa - Sping Open ABRIL','SPING_OPEN','2026-04-25','2026-04-25','FINALIZADA','CT - Clube Sping Pong',1,'2026-04-28 12:39:59','2026-04-28 19:15:39');
/*!40000 ALTER TABLE `competicoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historico_rating_ranking`
--

DROP TABLE IF EXISTS `historico_rating_ranking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historico_rating_ranking` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `atleta_id` bigint unsigned NOT NULL,
  `jogo_id` bigint unsigned DEFAULT NULL,
  `rating_anterior` decimal(10,2) NOT NULL,
  `rating_novo` decimal(10,2) NOT NULL,
  `ranking_anterior` int unsigned DEFAULT NULL,
  `ranking_novo` int unsigned DEFAULT NULL,
  `motivo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alterado_por` bigint unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_hist_rr_atleta` (`atleta_id`),
  KEY `idx_hist_rr_jogo` (`jogo_id`),
  KEY `idx_hist_rr_data` (`created_at`),
  KEY `fk_hist_rr_admin` (`alterado_por`),
  CONSTRAINT `fk_hist_rr_admin` FOREIGN KEY (`alterado_por`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `fk_hist_rr_atleta` FOREIGN KEY (`atleta_id`) REFERENCES `atletas` (`id`),
  CONSTRAINT `fk_hist_rr_jogo` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=327 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historico_rating_ranking`
--

LOCK TABLES `historico_rating_ranking` WRITE;
/*!40000 ALTER TABLE `historico_rating_ranking` DISABLE KEYS */;
INSERT INTO `historico_rating_ranking` VALUES (1,19,5,1724.00,1726.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1474 | esperado=1',1,'2026-04-28 12:51:37'),(2,41,5,250.00,250.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1474 | esperado=1',1,'2026-04-28 12:51:37'),(3,19,1,1726.00,1728.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1476 | esperado=1',1,'2026-04-28 12:52:12'),(4,35,1,250.00,250.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1476 | esperado=1',1,'2026-04-28 12:52:12'),(5,21,2,306.00,322.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=56 | esperado=1',1,'2026-04-28 12:52:45'),(6,33,2,250.00,238.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=56 | esperado=1',1,'2026-04-28 12:52:45'),(7,41,3,250.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 12:53:15'),(8,2,3,250.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 12:53:15'),(9,19,6,1728.00,1730.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1458 | esperado=1',1,'2026-04-28 12:54:07'),(10,2,6,270.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1458 | esperado=1',1,'2026-04-28 12:54:07'),(11,19,7,1730.00,1732.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1492 | esperado=1',1,'2026-04-28 12:55:10'),(12,33,7,238.00,238.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1492 | esperado=1',1,'2026-04-28 12:55:10'),(13,19,4,1732.00,1734.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1410 | esperado=1',1,'2026-04-28 12:55:20'),(14,21,4,322.00,322.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1410 | esperado=1',1,'2026-04-28 12:55:20'),(15,21,8,322.00,338.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=88 | esperado=1',1,'2026-04-28 12:55:41'),(16,41,8,234.00,222.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=88 | esperado=1',1,'2026-04-28 12:55:41'),(17,21,9,338.00,316.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=68 | esperado=0',1,'2026-04-28 12:56:22'),(18,2,9,270.00,298.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=68 | esperado=0',1,'2026-04-28 12:56:22'),(19,21,10,316.00,332.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=66 | esperado=1',1,'2026-04-28 12:57:17'),(20,35,10,250.00,238.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=66 | esperado=1',1,'2026-04-28 12:57:17'),(21,41,11,222.00,244.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=16 | esperado=0',1,'2026-04-28 12:58:59'),(22,33,11,238.00,220.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=16 | esperado=0',1,'2026-04-28 12:58:59'),(23,41,12,244.00,226.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=6 | esperado=0',1,'2026-04-28 12:59:25'),(24,35,12,238.00,260.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=6 | esperado=0',1,'2026-04-28 12:59:25'),(25,2,13,298.00,314.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=78 | esperado=1',1,'2026-04-28 12:59:40'),(26,33,13,220.00,208.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=78 | esperado=1',1,'2026-04-28 12:59:40'),(27,2,14,314.00,330.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=54 | esperado=1',1,'2026-04-28 13:00:10'),(28,35,14,260.00,248.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=54 | esperado=1',1,'2026-04-28 13:00:10'),(29,33,15,208.00,194.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=40 | esperado=1',1,'2026-04-28 13:00:54'),(30,35,15,248.00,266.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=40 | esperado=1',1,'2026-04-28 13:00:54'),(31,32,16,281.00,299.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=31 | esperado=1',1,'2026-04-28 13:03:07'),(32,15,16,250.00,236.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=31 | esperado=1',1,'2026-04-28 13:03:07'),(33,43,17,250.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 13:03:54'),(34,29,17,250.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 13:03:54'),(35,17,18,250.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 13:04:30'),(36,28,18,250.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 13:04:30'),(37,32,19,299.00,317.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=29 | esperado=1',1,'2026-04-28 13:05:49'),(38,43,19,270.00,256.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=29 | esperado=1',1,'2026-04-28 13:05:49'),(39,32,20,317.00,333.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=83 | esperado=1',1,'2026-04-28 13:06:12'),(40,17,20,234.00,222.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=83 | esperado=1',1,'2026-04-28 13:06:12'),(41,32,21,333.00,349.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=63 | esperado=1',1,'2026-04-28 13:07:15'),(42,28,21,270.00,258.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=63 | esperado=1',1,'2026-04-28 13:07:15'),(43,32,22,349.00,363.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=115 | esperado=1',1,'2026-04-28 13:08:40'),(44,29,22,234.00,224.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=115 | esperado=1',1,'2026-04-28 13:08:40'),(45,43,23,256.00,274.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=34 | esperado=1',1,'2026-04-28 13:09:09'),(46,17,23,222.00,208.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=34 | esperado=1',1,'2026-04-28 13:09:09'),(47,43,24,274.00,294.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=16 | esperado=1',1,'2026-04-28 13:09:45'),(48,28,24,258.00,242.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=16 | esperado=1',1,'2026-04-28 13:09:45'),(49,43,25,294.00,310.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=58 | esperado=1',1,'2026-04-28 13:10:00'),(50,15,25,236.00,224.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=58 | esperado=1',1,'2026-04-28 13:10:00'),(51,17,26,208.00,192.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=16 | esperado=1',1,'2026-04-28 13:11:28'),(52,29,26,224.00,244.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=16 | esperado=1',1,'2026-04-28 13:11:28'),(53,17,27,192.00,216.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=32 | esperado=0',1,'2026-04-28 13:11:42'),(54,15,27,224.00,204.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=32 | esperado=0',1,'2026-04-28 13:11:42'),(55,28,28,242.00,264.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=2 | esperado=0',1,'2026-04-28 13:12:00'),(56,29,28,244.00,226.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=2 | esperado=0',1,'2026-04-28 13:12:00'),(57,28,29,264.00,280.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=60 | esperado=1',1,'2026-04-28 13:12:24'),(58,15,29,204.00,192.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=60 | esperado=1',1,'2026-04-28 13:12:24'),(59,29,30,226.00,244.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=34 | esperado=1',1,'2026-04-28 13:12:43'),(60,15,30,192.00,178.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=34 | esperado=1',1,'2026-04-28 13:12:43'),(61,12,31,631.00,639.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=381 | esperado=1',1,'2026-04-28 13:14:04'),(62,20,31,250.00,246.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=381 | esperado=1',1,'2026-04-28 13:14:04'),(63,31,32,591.00,599.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=341 | esperado=1',1,'2026-04-28 13:14:25'),(64,26,32,250.00,246.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=341 | esperado=1',1,'2026-04-28 13:14:25'),(65,40,33,250.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 13:14:40'),(66,34,33,250.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 13:14:40'),(67,12,34,639.00,657.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=40 | esperado=1',1,'2026-04-28 13:15:09'),(68,31,34,599.00,585.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=40 | esperado=1',1,'2026-04-28 13:15:09'),(69,12,35,657.00,665.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=387 | esperado=1',1,'2026-04-28 13:15:39'),(70,40,35,270.00,266.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=387 | esperado=1',1,'2026-04-28 13:15:39'),(71,12,36,665.00,671.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=431 | esperado=1',1,'2026-04-28 13:15:54'),(72,34,36,234.00,232.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=431 | esperado=1',1,'2026-04-28 13:15:54'),(73,12,37,671.00,677.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=425 | esperado=1',1,'2026-04-28 13:16:14'),(74,26,37,246.00,244.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=425 | esperado=1',1,'2026-04-28 13:16:14'),(75,31,38,585.00,593.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=319 | esperado=1',1,'2026-04-28 13:16:35'),(76,40,38,266.00,262.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=319 | esperado=1',1,'2026-04-28 13:16:35'),(77,31,39,593.00,601.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=361 | esperado=1',1,'2026-04-28 13:16:53'),(78,34,39,232.00,228.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=361 | esperado=1',1,'2026-04-28 13:16:53'),(79,31,40,601.00,609.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=355 | esperado=1',1,'2026-04-28 13:17:08'),(80,20,40,246.00,242.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=355 | esperado=1',1,'2026-04-28 13:17:08'),(81,40,41,262.00,282.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=18 | esperado=1',1,'2026-04-28 13:17:41'),(82,26,41,244.00,228.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=18 | esperado=1',1,'2026-04-28 13:17:41'),(83,40,42,282.00,300.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=40 | esperado=1',1,'2026-04-28 13:18:12'),(84,20,42,242.00,228.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=40 | esperado=1',1,'2026-04-28 13:18:12'),(85,34,43,228.00,212.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 13:18:37'),(86,26,43,228.00,248.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 13:18:37'),(87,34,44,212.00,196.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=16 | esperado=1',1,'2026-04-28 13:18:57'),(88,20,44,228.00,248.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=16 | esperado=1',1,'2026-04-28 13:18:57'),(89,26,45,248.00,268.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 13:19:21'),(90,20,45,248.00,232.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 13:19:21'),(91,24,46,1016.00,1018.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=766 | esperado=1',1,'2026-04-28 13:49:00'),(92,9,46,250.00,250.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=766 | esperado=1',1,'2026-04-28 13:49:00'),(93,25,47,344.00,360.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=94 | esperado=1',1,'2026-04-28 13:49:45'),(94,48,47,250.00,238.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=94 | esperado=1',1,'2026-04-28 13:49:45'),(95,49,48,250.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 13:50:25'),(96,22,48,250.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 13:50:25'),(97,24,49,1018.00,1022.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=658 | esperado=1',1,'2026-04-28 13:51:15'),(98,25,49,360.00,360.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=658 | esperado=1',1,'2026-04-28 13:51:15'),(99,24,50,1022.00,1024.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=788 | esperado=1',1,'2026-04-28 13:53:40'),(100,49,50,234.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=788 | esperado=1',1,'2026-04-28 13:53:40'),(101,24,51,1024.00,1026.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=754 | esperado=1',1,'2026-04-28 13:53:52'),(102,22,51,270.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=754 | esperado=1',1,'2026-04-28 13:53:52'),(103,24,52,1026.00,1028.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=788 | esperado=1',1,'2026-04-28 13:54:14'),(104,48,52,238.00,238.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=788 | esperado=1',1,'2026-04-28 13:54:14'),(105,25,53,360.00,374.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=126 | esperado=1',1,'2026-04-28 13:54:54'),(106,49,53,234.00,224.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=126 | esperado=1',1,'2026-04-28 13:54:54'),(107,25,54,374.00,388.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=104 | esperado=1',1,'2026-04-28 13:55:14'),(108,22,54,270.00,260.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=104 | esperado=1',1,'2026-04-28 13:55:14'),(109,25,55,388.00,402.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=138 | esperado=1',1,'2026-04-28 13:55:35'),(110,9,55,250.00,240.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=138 | esperado=1',1,'2026-04-28 13:55:35'),(111,49,56,224.00,246.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=14 | esperado=0',1,'2026-04-28 13:56:12'),(112,48,56,238.00,220.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=14 | esperado=0',1,'2026-04-28 13:56:12'),(113,49,57,246.00,266.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=6 | esperado=1',1,'2026-04-28 13:58:41'),(114,9,57,240.00,224.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=6 | esperado=1',1,'2026-04-28 13:58:41'),(115,22,58,260.00,278.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=40 | esperado=1',1,'2026-04-28 13:59:15'),(116,48,58,220.00,206.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=40 | esperado=1',1,'2026-04-28 13:59:15'),(117,22,59,278.00,294.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=54 | esperado=1',1,'2026-04-28 13:59:50'),(118,9,59,224.00,212.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=54 | esperado=1',1,'2026-04-28 13:59:50'),(119,48,60,206.00,190.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=6 | esperado=1',1,'2026-04-28 14:00:37'),(120,9,60,212.00,232.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=6 | esperado=1',1,'2026-04-28 14:00:37'),(121,14,61,1941.00,1943.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1691 | esperado=1',1,'2026-04-28 14:01:03'),(122,8,61,250.00,250.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1691 | esperado=1',1,'2026-04-28 14:01:03'),(123,45,62,250.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 14:01:17'),(124,30,62,250.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 14:01:17'),(125,27,63,250.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 14:01:33'),(126,23,63,250.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 14:01:33'),(127,14,64,1943.00,1945.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1673 | esperado=1',1,'2026-04-28 14:02:03'),(128,45,64,270.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1673 | esperado=1',1,'2026-04-28 14:02:03'),(129,14,65,1945.00,1947.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1711 | esperado=1',1,'2026-04-28 14:02:23'),(130,27,65,234.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1711 | esperado=1',1,'2026-04-28 14:02:23'),(131,14,66,1947.00,1949.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1677 | esperado=1',1,'2026-04-28 14:02:47'),(132,23,66,270.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1677 | esperado=1',1,'2026-04-28 14:02:47'),(133,14,67,1949.00,1951.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1715 | esperado=1',1,'2026-04-28 14:03:07'),(134,30,67,234.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1715 | esperado=1',1,'2026-04-28 14:03:07'),(135,45,68,270.00,250.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=36 | esperado=0',1,'2026-04-28 14:03:26'),(136,27,68,234.00,258.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=36 | esperado=0',1,'2026-04-28 14:03:26'),(137,45,69,250.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=20 | esperado=1',1,'2026-04-28 14:03:55'),(138,23,69,270.00,290.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=20 | esperado=1',1,'2026-04-28 14:03:55'),(139,45,70,234.00,218.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=16 | esperado=1',1,'2026-04-28 14:04:19'),(140,8,70,250.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=16 | esperado=1',1,'2026-04-28 14:04:19'),(141,27,71,258.00,278.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=24 | esperado=1',1,'2026-04-28 14:04:40'),(142,30,71,234.00,218.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=24 | esperado=1',1,'2026-04-28 14:04:40'),(143,27,72,278.00,298.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=8 | esperado=1',1,'2026-04-28 14:05:07'),(144,8,72,270.00,254.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=8 | esperado=1',1,'2026-04-28 14:05:07'),(145,23,73,290.00,306.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=72 | esperado=1',1,'2026-04-28 14:05:30'),(146,30,73,218.00,206.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=72 | esperado=1',1,'2026-04-28 14:05:30'),(147,23,74,306.00,322.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=52 | esperado=1',1,'2026-04-28 14:05:52'),(148,8,74,254.00,242.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=52 | esperado=1',1,'2026-04-28 14:05:52'),(149,30,75,206.00,230.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=36 | esperado=0',1,'2026-04-28 14:06:19'),(150,8,75,242.00,222.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=36 | esperado=0',1,'2026-04-28 14:06:19'),(151,46,76,1039.00,1041.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=789 | esperado=1',1,'2026-04-28 14:20:48'),(152,44,76,250.00,250.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=789 | esperado=1',1,'2026-04-28 14:20:48'),(153,47,77,1000.00,1002.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=750 | esperado=1',1,'2026-04-28 14:21:05'),(154,38,77,250.00,250.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=750 | esperado=1',1,'2026-04-28 14:21:05'),(155,11,78,250.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 14:21:23'),(156,16,78,250.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 14:21:23'),(157,46,79,1041.00,1059.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=39 | esperado=1',1,'2026-04-28 14:22:00'),(158,47,79,1002.00,988.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=39 | esperado=1',1,'2026-04-28 14:22:00'),(159,46,80,1059.00,1061.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=789 | esperado=1',1,'2026-04-28 14:22:16'),(160,11,80,270.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=789 | esperado=1',1,'2026-04-28 14:22:16'),(161,46,81,1061.00,1063.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=827 | esperado=1',1,'2026-04-28 14:22:31'),(162,16,81,234.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=827 | esperado=1',1,'2026-04-28 14:22:31'),(163,46,82,1063.00,1065.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=813 | esperado=1',1,'2026-04-28 14:22:58'),(164,38,82,250.00,250.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=813 | esperado=1',1,'2026-04-28 14:22:58'),(165,47,83,988.00,992.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=718 | esperado=1',1,'2026-04-28 14:23:51'),(166,11,83,270.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=718 | esperado=1',1,'2026-04-28 14:23:51'),(167,47,84,992.00,994.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=758 | esperado=1',1,'2026-04-28 14:24:57'),(168,16,84,234.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=758 | esperado=1',1,'2026-04-28 14:24:57'),(169,47,85,994.00,998.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=744 | esperado=1',1,'2026-04-28 14:25:44'),(170,44,85,250.00,250.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=744 | esperado=1',1,'2026-04-28 14:25:44'),(171,11,86,270.00,290.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=20 | esperado=1',1,'2026-04-28 14:26:06'),(172,38,86,250.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=20 | esperado=1',1,'2026-04-28 14:26:06'),(173,11,87,290.00,308.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=40 | esperado=1',1,'2026-04-28 14:26:36'),(174,44,87,250.00,236.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=40 | esperado=1',1,'2026-04-28 14:26:36'),(175,16,88,234.00,218.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 14:28:26'),(176,38,88,234.00,254.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 14:28:26'),(177,16,89,218.00,202.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=18 | esperado=1',1,'2026-04-28 14:28:42'),(178,44,89,236.00,256.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=18 | esperado=1',1,'2026-04-28 14:28:42'),(179,38,90,254.00,238.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=2 | esperado=1',1,'2026-04-28 14:36:13'),(180,44,90,256.00,276.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=2 | esperado=1',1,'2026-04-28 14:36:13'),(181,37,91,612.00,620.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=362 | esperado=1',1,'2026-04-28 14:37:06'),(182,5,91,250.00,246.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=362 | esperado=1',1,'2026-04-28 14:37:06'),(183,42,92,257.00,277.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=7 | esperado=1',1,'2026-04-28 14:37:30'),(184,36,92,250.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=7 | esperado=1',1,'2026-04-28 14:37:30'),(185,39,93,250.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 14:38:42'),(186,50,93,250.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 14:38:42'),(187,37,94,620.00,628.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=343 | esperado=1',1,'2026-04-28 14:39:06'),(188,42,94,277.00,273.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=343 | esperado=1',1,'2026-04-28 14:39:06'),(189,37,95,628.00,636.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=358 | esperado=1',1,'2026-04-28 14:39:56'),(190,39,95,270.00,266.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=358 | esperado=1',1,'2026-04-28 14:39:56'),(191,37,96,636.00,642.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=402 | esperado=1',1,'2026-04-28 14:40:26'),(192,50,96,234.00,232.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=402 | esperado=1',1,'2026-04-28 14:40:26'),(193,37,97,642.00,648.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=408 | esperado=1',1,'2026-04-28 14:40:38'),(194,36,97,234.00,232.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=408 | esperado=1',1,'2026-04-28 14:40:38'),(195,42,98,273.00,293.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=7 | esperado=1',1,'2026-04-28 14:41:13'),(196,39,98,266.00,250.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=7 | esperado=1',1,'2026-04-28 14:41:13'),(197,42,99,293.00,309.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=61 | esperado=1',1,'2026-04-28 14:41:44'),(198,50,99,232.00,220.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=61 | esperado=1',1,'2026-04-28 14:41:44'),(199,42,100,309.00,325.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=63 | esperado=1',1,'2026-04-28 14:43:04'),(200,5,100,246.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=63 | esperado=1',1,'2026-04-28 14:43:04'),(201,39,101,250.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=18 | esperado=1',1,'2026-04-28 14:44:08'),(202,36,101,232.00,216.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=18 | esperado=1',1,'2026-04-28 14:44:08'),(203,39,102,270.00,288.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=36 | esperado=1',1,'2026-04-28 14:44:34'),(204,5,102,234.00,220.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=36 | esperado=1',1,'2026-04-28 14:44:34'),(205,50,103,220.00,240.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=4 | esperado=1',1,'2026-04-28 14:44:55'),(206,36,103,216.00,200.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=4 | esperado=1',1,'2026-04-28 14:44:55'),(207,50,104,240.00,260.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=20 | esperado=1',1,'2026-04-28 14:45:14'),(208,5,104,220.00,204.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=20 | esperado=1',1,'2026-04-28 14:45:14'),(209,36,105,200.00,184.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=4 | esperado=1',1,'2026-04-28 14:45:33'),(210,5,105,204.00,224.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=4 | esperado=1',1,'2026-04-28 14:45:33'),(211,7,106,743.00,749.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=493 | esperado=1',1,'2026-04-28 14:46:18'),(212,13,106,250.00,248.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=493 | esperado=1',1,'2026-04-28 14:46:18'),(213,4,107,335.00,313.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=85 | esperado=0',1,'2026-04-28 14:46:38'),(214,3,107,250.00,278.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=85 | esperado=0',1,'2026-04-28 14:46:38'),(215,18,108,250.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 14:46:57'),(216,10,108,250.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=0 | esperado=1',1,'2026-04-28 14:46:57'),(217,7,109,749.00,755.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=436 | esperado=1',1,'2026-04-28 14:47:22'),(218,4,109,313.00,311.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=436 | esperado=1',1,'2026-04-28 14:47:22'),(219,7,110,755.00,759.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=521 | esperado=1',1,'2026-04-28 14:47:36'),(220,18,110,234.00,234.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=521 | esperado=1',1,'2026-04-28 14:47:36'),(221,7,111,759.00,765.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=489 | esperado=1',1,'2026-04-28 14:47:58'),(222,10,111,270.00,268.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=489 | esperado=1',1,'2026-04-28 14:47:58'),(223,7,112,765.00,771.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=487 | esperado=1',1,'2026-04-28 14:48:13'),(224,3,112,278.00,276.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=487 | esperado=1',1,'2026-04-28 14:48:13'),(225,4,113,311.00,327.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=77 | esperado=1',1,'2026-04-28 14:48:31'),(226,18,113,234.00,222.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=77 | esperado=1',1,'2026-04-28 14:48:31'),(227,4,114,327.00,343.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=59 | esperado=1',1,'2026-04-28 14:49:01'),(228,10,114,268.00,256.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=59 | esperado=1',1,'2026-04-28 14:49:01'),(229,4,115,343.00,321.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=95 | esperado=0',1,'2026-04-28 14:49:41'),(230,13,115,248.00,276.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=95 | esperado=0',1,'2026-04-28 14:49:41'),(231,18,116,222.00,210.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=54 | esperado=1',1,'2026-04-28 14:50:05'),(232,3,116,276.00,292.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=54 | esperado=1',1,'2026-04-28 14:50:05'),(233,18,117,210.00,198.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=66 | esperado=1',1,'2026-04-28 14:50:19'),(234,13,117,276.00,292.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=66 | esperado=1',1,'2026-04-28 14:50:19'),(235,10,118,256.00,242.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=36 | esperado=1',1,'2026-04-28 14:50:50'),(236,3,118,292.00,310.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=36 | esperado=1',1,'2026-04-28 14:50:50'),(237,10,119,242.00,230.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=50 | esperado=1',1,'2026-04-28 14:51:08'),(238,13,119,292.00,308.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=50 | esperado=1',1,'2026-04-28 14:51:08'),(239,3,120,310.00,330.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=2 | esperado=1',1,'2026-04-28 14:51:29'),(240,13,120,308.00,292.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=2 | esperado=1',1,'2026-04-28 14:51:29'),(241,7,121,771.00,779.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=369 | esperado=1',1,'2026-04-28 15:22:54'),(242,25,121,402.00,398.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=369 | esperado=1',1,'2026-04-28 15:22:54'),(243,42,122,325.00,349.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=38 | esperado=0',1,'2026-04-28 15:23:01'),(244,32,122,363.00,343.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=38 | esperado=0',1,'2026-04-28 15:23:01'),(245,46,123,1065.00,1069.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=743 | esperado=1',1,'2026-04-28 15:23:06'),(246,23,123,322.00,322.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=743 | esperado=1',1,'2026-04-28 15:23:06'),(247,31,124,609.00,609.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1125 | esperado=1',1,'2026-04-28 15:23:13'),(248,19,124,1734.00,1736.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1125 | esperado=1',1,'2026-04-28 15:23:13'),(249,12,125,677.00,685.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=347 | esperado=1',1,'2026-04-28 15:23:19'),(250,3,125,330.00,326.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=347 | esperado=1',1,'2026-04-28 15:23:19'),(251,47,126,998.00,1058.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=953 | esperado=0',1,'2026-04-28 15:23:25'),(252,14,126,1951.00,1907.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=953 | esperado=0',1,'2026-04-28 15:23:25'),(253,37,127,648.00,656.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=318 | esperado=1',1,'2026-04-28 15:23:29'),(254,2,127,330.00,326.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=318 | esperado=1',1,'2026-04-28 15:23:29'),(255,43,128,310.00,370.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=718 | esperado=0',1,'2026-04-28 15:23:35'),(256,24,128,1028.00,984.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=718 | esperado=0',1,'2026-04-28 15:23:35'),(257,13,129,292.00,310.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=26 | esperado=1',1,'2026-04-28 15:24:04'),(258,49,129,266.00,252.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=26 | esperado=1',1,'2026-04-28 15:24:04'),(259,50,130,260.00,282.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=20 | esperado=0',1,'2026-04-28 15:24:10'),(260,28,130,280.00,262.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=20 | esperado=0',1,'2026-04-28 15:24:10'),(261,11,131,308.00,324.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=78 | esperado=1',1,'2026-04-28 15:24:16'),(262,8,131,230.00,218.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=78 | esperado=1',1,'2026-04-28 15:24:16'),(263,26,132,268.00,256.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=64 | esperado=1',1,'2026-04-28 15:24:21'),(264,21,132,332.00,348.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=64 | esperado=1',1,'2026-04-28 15:24:21'),(265,40,133,300.00,322.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=21 | esperado=0',1,'2026-04-28 15:24:30'),(266,4,133,321.00,303.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=21 | esperado=0',1,'2026-04-28 15:24:30'),(267,44,134,276.00,298.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=22 | esperado=0',1,'2026-04-28 15:24:34'),(268,27,134,298.00,280.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=22 | esperado=0',1,'2026-04-28 15:24:34'),(269,39,135,288.00,270.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=22 | esperado=0',1,'2026-04-28 15:24:45'),(270,35,135,266.00,288.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=22 | esperado=0',1,'2026-04-28 15:24:45'),(271,10,136,230.00,252.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=14 | esperado=0',1,'2026-04-28 15:24:58'),(272,29,136,244.00,226.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=14 | esperado=0',1,'2026-04-28 15:24:58'),(273,38,137,238.00,258.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=12 | esperado=1',1,'2026-04-28 15:25:07'),(274,41,137,226.00,210.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=12 | esperado=1',1,'2026-04-28 15:25:07'),(275,20,138,232.00,214.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=14 | esperado=0',1,'2026-04-28 15:25:13'),(276,45,138,218.00,240.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=14 | esperado=0',1,'2026-04-28 15:25:13'),(277,5,139,224.00,208.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=8 | esperado=1',1,'2026-04-28 15:25:25'),(278,9,139,232.00,252.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=8 | esperado=1',1,'2026-04-28 15:25:25'),(279,18,140,198.00,218.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=20 | esperado=1',1,'2026-04-28 15:25:36'),(280,15,140,178.00,162.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=20 | esperado=1',1,'2026-04-28 15:25:36'),(281,16,141,202.00,184.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=8 | esperado=0',1,'2026-04-28 15:25:42'),(282,33,141,194.00,216.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=8 | esperado=0',1,'2026-04-28 15:25:42'),(283,34,142,196.00,218.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=16 | esperado=0',1,'2026-04-28 15:25:48'),(284,30,142,212.00,194.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=16 | esperado=0',1,'2026-04-28 15:25:48'),(285,36,143,184.00,168.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=6 | esperado=1',1,'2026-04-28 15:25:59'),(286,48,143,190.00,210.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=6 | esperado=1',1,'2026-04-28 15:25:59'),(287,7,145,779.00,785.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=430 | esperado=1',1,'2026-04-28 15:32:41'),(288,42,145,349.00,347.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=430 | esperado=1',1,'2026-04-28 15:32:41'),(289,46,146,1069.00,1069.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=667 | esperado=1',1,'2026-04-28 15:32:47'),(290,19,146,1736.00,1740.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=667 | esperado=1',1,'2026-04-28 15:32:47'),(291,12,147,685.00,731.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=373 | esperado=0',1,'2026-04-28 15:32:52'),(292,47,147,1058.00,1022.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=373 | esperado=0',1,'2026-04-28 15:32:52'),(293,37,148,656.00,666.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=286 | esperado=1',1,'2026-04-28 15:32:56'),(294,43,148,370.00,364.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=286 | esperado=1',1,'2026-04-28 15:32:56'),(295,13,149,310.00,290.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=28 | esperado=0',1,'2026-04-28 15:33:13'),(296,50,149,282.00,306.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=28 | esperado=0',1,'2026-04-28 15:33:13'),(297,11,150,324.00,346.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=24 | esperado=0',1,'2026-04-28 15:33:18'),(298,21,150,348.00,330.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=24 | esperado=0',1,'2026-04-28 15:33:18'),(299,40,151,322.00,342.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=24 | esperado=1',1,'2026-04-28 15:33:23'),(300,44,151,298.00,282.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=24 | esperado=1',1,'2026-04-28 15:33:23'),(301,35,152,288.00,272.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=6 | esperado=1',1,'2026-04-28 15:33:30'),(302,22,152,294.00,314.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=6 | esperado=1',1,'2026-04-28 15:33:30'),(303,10,153,252.00,274.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=6 | esperado=0',1,'2026-04-28 15:33:42'),(304,38,153,258.00,240.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=6 | esperado=0',1,'2026-04-28 15:33:42'),(305,45,154,240.00,224.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=12 | esperado=1',1,'2026-04-28 15:33:49'),(306,9,154,252.00,272.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=12 | esperado=1',1,'2026-04-28 15:33:49'),(307,18,155,218.00,200.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=2 | esperado=0',1,'2026-04-28 15:33:57'),(308,33,155,216.00,238.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=2 | esperado=0',1,'2026-04-28 15:33:57'),(309,34,156,218.00,200.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=8 | esperado=0',1,'2026-04-28 15:34:03'),(310,48,156,210.00,232.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=8 | esperado=0',1,'2026-04-28 15:34:03'),(311,7,157,785.00,785.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=955 | esperado=1',1,'2026-04-28 19:09:45'),(312,19,157,1740.00,1742.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=955 | esperado=1',1,'2026-04-28 19:09:45'),(313,12,158,731.00,709.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=65 | esperado=0',1,'2026-04-28 19:10:01'),(314,37,158,666.00,694.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=65 | esperado=0',1,'2026-04-28 19:10:01'),(315,50,159,306.00,292.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=40 | esperado=1',1,'2026-04-28 19:10:10'),(316,11,159,346.00,364.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=40 | esperado=1',1,'2026-04-28 19:10:10'),(317,40,160,342.00,360.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=28 | esperado=1',1,'2026-04-28 19:10:18'),(318,22,160,314.00,300.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=28 | esperado=1',1,'2026-04-28 19:10:18'),(319,10,161,274.00,256.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=2 | esperado=0',1,'2026-04-28 19:10:23'),(320,9,161,272.00,294.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=2 | esperado=0',1,'2026-04-28 19:10:23'),(321,33,162,238.00,258.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=6 | esperado=1',1,'2026-04-28 19:10:42'),(322,48,162,232.00,216.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=6 | esperado=1',1,'2026-04-28 19:10:42'),(323,19,163,1742.00,1744.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1048 | esperado=1',1,'2026-04-28 19:11:33'),(324,37,163,694.00,694.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=1048 | esperado=1',1,'2026-04-28 19:11:33'),(325,11,164,364.00,384.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=4 | esperado=1',1,'2026-04-28 19:11:39'),(326,40,164,360.00,344.00,NULL,NULL,'Finalização de jogo | tipo=SPING_OPEN | peso=2 | Δ=4 | esperado=1',1,'2026-04-28 19:11:39');
/*!40000 ALTER TABLE `historico_rating_ranking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historico_resultados`
--

DROP TABLE IF EXISTS `historico_resultados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historico_resultados` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `jogo_id` bigint unsigned NOT NULL,
  `status_anterior` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_novo` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vencedor_anterior_id` bigint unsigned DEFAULT NULL,
  `vencedor_novo_id` bigint unsigned DEFAULT NULL,
  `alterado_por` bigint unsigned NOT NULL,
  `motivo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_hist_res_jogo` (`jogo_id`),
  KEY `idx_hist_res_admin` (`alterado_por`),
  KEY `idx_hist_res_data` (`created_at`),
  KEY `fk_hist_res_venc_ant` (`vencedor_anterior_id`),
  KEY `fk_hist_res_venc_novo` (`vencedor_novo_id`),
  CONSTRAINT `fk_hist_res_admin` FOREIGN KEY (`alterado_por`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `fk_hist_res_jogo` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_hist_res_venc_ant` FOREIGN KEY (`vencedor_anterior_id`) REFERENCES `atletas` (`id`),
  CONSTRAINT `fk_hist_res_venc_novo` FOREIGN KEY (`vencedor_novo_id`) REFERENCES `atletas` (`id`),
  CONSTRAINT `chk_hist_status_anterior` CHECK (((`status_anterior` is null) or (`status_anterior` in (_utf8mb4'AGENDADO',_utf8mb4'EM_ANDAMENTO',_utf8mb4'FINALIZADO',_utf8mb4'W_O',_utf8mb4'CANCELADO')))),
  CONSTRAINT `chk_hist_status_novo` CHECK ((`status_novo` in (_utf8mb4'AGENDADO',_utf8mb4'EM_ANDAMENTO',_utf8mb4'FINALIZADO',_utf8mb4'W_O',_utf8mb4'CANCELADO')))
) ENGINE=InnoDB AUTO_INCREMENT=165 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historico_resultados`
--

LOCK TABLES `historico_resultados` WRITE;
/*!40000 ALTER TABLE `historico_resultados` DISABLE KEYS */;
INSERT INTO `historico_resultados` VALUES (1,5,'AGENDADO','FINALIZADO',NULL,19,1,'Finalização de jogo','2026-04-28 12:51:37'),(2,1,'AGENDADO','FINALIZADO',NULL,19,1,'Finalização de jogo','2026-04-28 12:52:12'),(3,2,'AGENDADO','FINALIZADO',NULL,21,1,'Finalização de jogo','2026-04-28 12:52:45'),(4,3,'AGENDADO','FINALIZADO',NULL,2,1,'Finalização de jogo','2026-04-28 12:53:15'),(5,6,'AGENDADO','FINALIZADO',NULL,19,1,'Finalização de jogo','2026-04-28 12:54:07'),(6,7,'AGENDADO','FINALIZADO',NULL,19,1,'Finalização de jogo','2026-04-28 12:55:10'),(7,4,'AGENDADO','FINALIZADO',NULL,19,1,'Finalização de jogo','2026-04-28 12:55:20'),(8,8,'AGENDADO','FINALIZADO',NULL,21,1,'Finalização de jogo','2026-04-28 12:55:41'),(9,9,'AGENDADO','FINALIZADO',NULL,2,1,'Finalização de jogo','2026-04-28 12:56:22'),(10,10,'AGENDADO','FINALIZADO',NULL,21,1,'Finalização de jogo','2026-04-28 12:57:17'),(11,11,'AGENDADO','FINALIZADO',NULL,41,1,'Finalização de jogo','2026-04-28 12:58:59'),(12,12,'AGENDADO','FINALIZADO',NULL,35,1,'Finalização de jogo','2026-04-28 12:59:25'),(13,13,'AGENDADO','FINALIZADO',NULL,2,1,'Finalização de jogo','2026-04-28 12:59:40'),(14,14,'AGENDADO','FINALIZADO',NULL,2,1,'Finalização de jogo','2026-04-28 13:00:10'),(15,15,'AGENDADO','FINALIZADO',NULL,35,1,'Finalização de jogo','2026-04-28 13:00:54'),(16,16,'AGENDADO','FINALIZADO',NULL,32,1,'Finalização de jogo','2026-04-28 13:03:07'),(17,17,'AGENDADO','FINALIZADO',NULL,43,1,'Finalização de jogo','2026-04-28 13:03:54'),(18,18,'AGENDADO','FINALIZADO',NULL,28,1,'Finalização de jogo','2026-04-28 13:04:30'),(19,19,'AGENDADO','FINALIZADO',NULL,32,1,'Finalização de jogo','2026-04-28 13:05:49'),(20,20,'AGENDADO','FINALIZADO',NULL,32,1,'Finalização de jogo','2026-04-28 13:06:12'),(21,21,'AGENDADO','FINALIZADO',NULL,32,1,'Finalização de jogo','2026-04-28 13:07:15'),(22,22,'AGENDADO','FINALIZADO',NULL,32,1,'Finalização de jogo','2026-04-28 13:08:40'),(23,23,'AGENDADO','FINALIZADO',NULL,43,1,'Finalização de jogo','2026-04-28 13:09:09'),(24,24,'AGENDADO','FINALIZADO',NULL,43,1,'Finalização de jogo','2026-04-28 13:09:45'),(25,25,'AGENDADO','FINALIZADO',NULL,43,1,'Finalização de jogo','2026-04-28 13:10:00'),(26,26,'AGENDADO','FINALIZADO',NULL,29,1,'Finalização de jogo','2026-04-28 13:11:28'),(27,27,'AGENDADO','FINALIZADO',NULL,17,1,'Finalização de jogo','2026-04-28 13:11:42'),(28,28,'AGENDADO','FINALIZADO',NULL,28,1,'Finalização de jogo','2026-04-28 13:12:00'),(29,29,'AGENDADO','FINALIZADO',NULL,28,1,'Finalização de jogo','2026-04-28 13:12:24'),(30,30,'AGENDADO','FINALIZADO',NULL,29,1,'Finalização de jogo','2026-04-28 13:12:43'),(31,31,'AGENDADO','FINALIZADO',NULL,12,1,'Finalização de jogo','2026-04-28 13:14:04'),(32,32,'AGENDADO','FINALIZADO',NULL,31,1,'Finalização de jogo','2026-04-28 13:14:25'),(33,33,'AGENDADO','FINALIZADO',NULL,40,1,'Finalização de jogo','2026-04-28 13:14:40'),(34,34,'AGENDADO','FINALIZADO',NULL,12,1,'Finalização de jogo','2026-04-28 13:15:09'),(35,35,'AGENDADO','FINALIZADO',NULL,12,1,'Finalização de jogo','2026-04-28 13:15:39'),(36,36,'AGENDADO','FINALIZADO',NULL,12,1,'Finalização de jogo','2026-04-28 13:15:54'),(37,37,'AGENDADO','FINALIZADO',NULL,12,1,'Finalização de jogo','2026-04-28 13:16:14'),(38,38,'AGENDADO','FINALIZADO',NULL,31,1,'Finalização de jogo','2026-04-28 13:16:35'),(39,39,'AGENDADO','FINALIZADO',NULL,31,1,'Finalização de jogo','2026-04-28 13:16:53'),(40,40,'AGENDADO','FINALIZADO',NULL,31,1,'Finalização de jogo','2026-04-28 13:17:08'),(41,41,'AGENDADO','FINALIZADO',NULL,40,1,'Finalização de jogo','2026-04-28 13:17:41'),(42,42,'AGENDADO','FINALIZADO',NULL,40,1,'Finalização de jogo','2026-04-28 13:18:12'),(43,43,'AGENDADO','FINALIZADO',NULL,26,1,'Finalização de jogo','2026-04-28 13:18:37'),(44,44,'AGENDADO','FINALIZADO',NULL,20,1,'Finalização de jogo','2026-04-28 13:18:57'),(45,45,'AGENDADO','FINALIZADO',NULL,26,1,'Finalização de jogo','2026-04-28 13:19:21'),(46,46,'AGENDADO','FINALIZADO',NULL,24,1,'Finalização de jogo','2026-04-28 13:49:00'),(47,47,'AGENDADO','FINALIZADO',NULL,25,1,'Finalização de jogo','2026-04-28 13:49:45'),(48,48,'AGENDADO','FINALIZADO',NULL,22,1,'Finalização de jogo','2026-04-28 13:50:25'),(49,49,'AGENDADO','FINALIZADO',NULL,24,1,'Finalização de jogo','2026-04-28 13:51:15'),(50,50,'AGENDADO','FINALIZADO',NULL,24,1,'Finalização de jogo','2026-04-28 13:53:40'),(51,51,'AGENDADO','FINALIZADO',NULL,24,1,'Finalização de jogo','2026-04-28 13:53:52'),(52,52,'AGENDADO','FINALIZADO',NULL,24,1,'Finalização de jogo','2026-04-28 13:54:14'),(53,53,'AGENDADO','FINALIZADO',NULL,25,1,'Finalização de jogo','2026-04-28 13:54:54'),(54,54,'AGENDADO','FINALIZADO',NULL,25,1,'Finalização de jogo','2026-04-28 13:55:14'),(55,55,'AGENDADO','FINALIZADO',NULL,25,1,'Finalização de jogo','2026-04-28 13:55:35'),(56,56,'AGENDADO','FINALIZADO',NULL,49,1,'Finalização de jogo','2026-04-28 13:56:12'),(57,57,'AGENDADO','FINALIZADO',NULL,49,1,'Finalização de jogo','2026-04-28 13:58:41'),(58,58,'AGENDADO','FINALIZADO',NULL,22,1,'Finalização de jogo','2026-04-28 13:59:15'),(59,59,'AGENDADO','FINALIZADO',NULL,22,1,'Finalização de jogo','2026-04-28 13:59:50'),(60,60,'AGENDADO','FINALIZADO',NULL,9,1,'Finalização de jogo','2026-04-28 14:00:37'),(61,61,'AGENDADO','FINALIZADO',NULL,14,1,'Finalização de jogo','2026-04-28 14:01:03'),(62,62,'AGENDADO','FINALIZADO',NULL,45,1,'Finalização de jogo','2026-04-28 14:01:17'),(63,63,'AGENDADO','FINALIZADO',NULL,23,1,'Finalização de jogo','2026-04-28 14:01:33'),(64,64,'AGENDADO','FINALIZADO',NULL,14,1,'Finalização de jogo','2026-04-28 14:02:03'),(65,65,'AGENDADO','FINALIZADO',NULL,14,1,'Finalização de jogo','2026-04-28 14:02:23'),(66,66,'AGENDADO','FINALIZADO',NULL,14,1,'Finalização de jogo','2026-04-28 14:02:47'),(67,67,'AGENDADO','FINALIZADO',NULL,14,1,'Finalização de jogo','2026-04-28 14:03:07'),(68,68,'AGENDADO','FINALIZADO',NULL,27,1,'Finalização de jogo','2026-04-28 14:03:26'),(69,69,'AGENDADO','FINALIZADO',NULL,23,1,'Finalização de jogo','2026-04-28 14:03:55'),(70,70,'AGENDADO','FINALIZADO',NULL,8,1,'Finalização de jogo','2026-04-28 14:04:19'),(71,71,'AGENDADO','FINALIZADO',NULL,27,1,'Finalização de jogo','2026-04-28 14:04:40'),(72,72,'AGENDADO','FINALIZADO',NULL,27,1,'Finalização de jogo','2026-04-28 14:05:07'),(73,73,'AGENDADO','FINALIZADO',NULL,23,1,'Finalização de jogo','2026-04-28 14:05:30'),(74,74,'AGENDADO','FINALIZADO',NULL,23,1,'Finalização de jogo','2026-04-28 14:05:52'),(75,75,'AGENDADO','FINALIZADO',NULL,30,1,'Finalização de jogo','2026-04-28 14:06:19'),(77,76,'AGENDADO','FINALIZADO',NULL,46,1,'Finalização de jogo','2026-04-28 14:20:48'),(78,77,'AGENDADO','FINALIZADO',NULL,47,1,'Finalização de jogo','2026-04-28 14:21:05'),(79,78,'AGENDADO','FINALIZADO',NULL,11,1,'Finalização de jogo','2026-04-28 14:21:23'),(80,79,'AGENDADO','FINALIZADO',NULL,46,1,'Finalização de jogo','2026-04-28 14:22:00'),(81,80,'AGENDADO','FINALIZADO',NULL,46,1,'Finalização de jogo','2026-04-28 14:22:16'),(82,81,'AGENDADO','FINALIZADO',NULL,46,1,'Finalização de jogo','2026-04-28 14:22:31'),(83,82,'AGENDADO','FINALIZADO',NULL,46,1,'Finalização de jogo','2026-04-28 14:22:58'),(84,83,'AGENDADO','FINALIZADO',NULL,47,1,'Finalização de jogo','2026-04-28 14:23:51'),(85,84,'AGENDADO','FINALIZADO',NULL,47,1,'Finalização de jogo','2026-04-28 14:24:57'),(86,85,'AGENDADO','FINALIZADO',NULL,47,1,'Finalização de jogo','2026-04-28 14:25:44'),(87,86,'AGENDADO','FINALIZADO',NULL,11,1,'Finalização de jogo','2026-04-28 14:26:06'),(88,87,'AGENDADO','FINALIZADO',NULL,11,1,'Finalização de jogo','2026-04-28 14:26:36'),(89,88,'AGENDADO','FINALIZADO',NULL,38,1,'Finalização de jogo','2026-04-28 14:28:26'),(90,89,'AGENDADO','FINALIZADO',NULL,44,1,'Finalização de jogo','2026-04-28 14:28:42'),(91,90,'AGENDADO','FINALIZADO',NULL,44,1,'Finalização de jogo','2026-04-28 14:36:13'),(92,91,'AGENDADO','FINALIZADO',NULL,37,1,'Finalização de jogo','2026-04-28 14:37:06'),(93,92,'AGENDADO','FINALIZADO',NULL,42,1,'Finalização de jogo','2026-04-28 14:37:30'),(94,93,'AGENDADO','FINALIZADO',NULL,39,1,'Finalização de jogo','2026-04-28 14:38:42'),(95,94,'AGENDADO','FINALIZADO',NULL,37,1,'Finalização de jogo','2026-04-28 14:39:06'),(96,95,'AGENDADO','FINALIZADO',NULL,37,1,'Finalização de jogo','2026-04-28 14:39:56'),(97,96,'AGENDADO','FINALIZADO',NULL,37,1,'Finalização de jogo','2026-04-28 14:40:26'),(98,97,'AGENDADO','FINALIZADO',NULL,37,1,'Finalização de jogo','2026-04-28 14:40:38'),(99,98,'AGENDADO','FINALIZADO',NULL,42,1,'Finalização de jogo','2026-04-28 14:41:13'),(100,99,'AGENDADO','FINALIZADO',NULL,42,1,'Finalização de jogo','2026-04-28 14:41:44'),(101,100,'AGENDADO','FINALIZADO',NULL,42,1,'Finalização de jogo','2026-04-28 14:43:04'),(102,101,'AGENDADO','FINALIZADO',NULL,39,1,'Finalização de jogo','2026-04-28 14:44:08'),(103,102,'AGENDADO','FINALIZADO',NULL,39,1,'Finalização de jogo','2026-04-28 14:44:34'),(104,103,'AGENDADO','FINALIZADO',NULL,50,1,'Finalização de jogo','2026-04-28 14:44:55'),(105,104,'AGENDADO','FINALIZADO',NULL,50,1,'Finalização de jogo','2026-04-28 14:45:14'),(106,105,'AGENDADO','FINALIZADO',NULL,5,1,'Finalização de jogo','2026-04-28 14:45:33'),(107,106,'AGENDADO','FINALIZADO',NULL,7,1,'Finalização de jogo','2026-04-28 14:46:18'),(108,107,'AGENDADO','FINALIZADO',NULL,3,1,'Finalização de jogo','2026-04-28 14:46:38'),(109,108,'AGENDADO','FINALIZADO',NULL,10,1,'Finalização de jogo','2026-04-28 14:46:57'),(110,109,'AGENDADO','FINALIZADO',NULL,7,1,'Finalização de jogo','2026-04-28 14:47:22'),(111,110,'AGENDADO','FINALIZADO',NULL,7,1,'Finalização de jogo','2026-04-28 14:47:36'),(112,111,'AGENDADO','FINALIZADO',NULL,7,1,'Finalização de jogo','2026-04-28 14:47:58'),(113,112,'AGENDADO','FINALIZADO',NULL,7,1,'Finalização de jogo','2026-04-28 14:48:13'),(114,113,'AGENDADO','FINALIZADO',NULL,4,1,'Finalização de jogo','2026-04-28 14:48:31'),(115,114,'AGENDADO','FINALIZADO',NULL,4,1,'Finalização de jogo','2026-04-28 14:49:01'),(116,115,'AGENDADO','FINALIZADO',NULL,13,1,'Finalização de jogo','2026-04-28 14:49:41'),(117,116,'AGENDADO','FINALIZADO',NULL,3,1,'Finalização de jogo','2026-04-28 14:50:05'),(118,117,'AGENDADO','FINALIZADO',NULL,13,1,'Finalização de jogo','2026-04-28 14:50:19'),(119,118,'AGENDADO','FINALIZADO',NULL,3,1,'Finalização de jogo','2026-04-28 14:50:50'),(120,119,'AGENDADO','FINALIZADO',NULL,13,1,'Finalização de jogo','2026-04-28 14:51:08'),(121,120,'AGENDADO','FINALIZADO',NULL,3,1,'Finalização de jogo','2026-04-28 14:51:29'),(122,121,'AGENDADO','FINALIZADO',NULL,7,1,'Finalização de jogo','2026-04-28 15:22:54'),(123,122,'AGENDADO','FINALIZADO',NULL,42,1,'Finalização de jogo','2026-04-28 15:23:01'),(124,123,'AGENDADO','FINALIZADO',NULL,46,1,'Finalização de jogo','2026-04-28 15:23:06'),(125,124,'AGENDADO','FINALIZADO',NULL,19,1,'Finalização de jogo','2026-04-28 15:23:13'),(126,125,'AGENDADO','FINALIZADO',NULL,12,1,'Finalização de jogo','2026-04-28 15:23:19'),(127,126,'AGENDADO','FINALIZADO',NULL,47,1,'Finalização de jogo','2026-04-28 15:23:25'),(128,127,'AGENDADO','FINALIZADO',NULL,37,1,'Finalização de jogo','2026-04-28 15:23:29'),(129,128,'AGENDADO','FINALIZADO',NULL,43,1,'Finalização de jogo','2026-04-28 15:23:35'),(130,129,'AGENDADO','FINALIZADO',NULL,13,1,'Finalização de jogo','2026-04-28 15:24:04'),(131,130,'AGENDADO','FINALIZADO',NULL,50,1,'Finalização de jogo','2026-04-28 15:24:10'),(132,131,'AGENDADO','FINALIZADO',NULL,11,1,'Finalização de jogo','2026-04-28 15:24:16'),(133,132,'AGENDADO','FINALIZADO',NULL,21,1,'Finalização de jogo','2026-04-28 15:24:21'),(134,133,'AGENDADO','FINALIZADO',NULL,40,1,'Finalização de jogo','2026-04-28 15:24:30'),(135,134,'AGENDADO','FINALIZADO',NULL,44,1,'Finalização de jogo','2026-04-28 15:24:34'),(136,135,'AGENDADO','FINALIZADO',NULL,35,1,'Finalização de jogo','2026-04-28 15:24:45'),(137,136,'AGENDADO','FINALIZADO',NULL,10,1,'Finalização de jogo','2026-04-28 15:24:58'),(138,137,'AGENDADO','FINALIZADO',NULL,38,1,'Finalização de jogo','2026-04-28 15:25:07'),(139,138,'AGENDADO','FINALIZADO',NULL,45,1,'Finalização de jogo','2026-04-28 15:25:13'),(140,139,'AGENDADO','FINALIZADO',NULL,9,1,'Finalização de jogo','2026-04-28 15:25:25'),(141,140,'AGENDADO','FINALIZADO',NULL,18,1,'Finalização de jogo','2026-04-28 15:25:36'),(142,141,'AGENDADO','FINALIZADO',NULL,33,1,'Finalização de jogo','2026-04-28 15:25:42'),(143,142,'AGENDADO','FINALIZADO',NULL,34,1,'Finalização de jogo','2026-04-28 15:25:48'),(144,143,'AGENDADO','FINALIZADO',NULL,48,1,'Finalização de jogo','2026-04-28 15:25:59'),(145,145,'AGENDADO','FINALIZADO',NULL,7,1,'Finalização de jogo','2026-04-28 15:32:41'),(146,146,'AGENDADO','FINALIZADO',NULL,19,1,'Finalização de jogo','2026-04-28 15:32:47'),(147,147,'AGENDADO','FINALIZADO',NULL,12,1,'Finalização de jogo','2026-04-28 15:32:52'),(148,148,'AGENDADO','FINALIZADO',NULL,37,1,'Finalização de jogo','2026-04-28 15:32:56'),(149,149,'AGENDADO','FINALIZADO',NULL,50,1,'Finalização de jogo','2026-04-28 15:33:13'),(150,150,'AGENDADO','FINALIZADO',NULL,11,1,'Finalização de jogo','2026-04-28 15:33:18'),(151,151,'AGENDADO','FINALIZADO',NULL,40,1,'Finalização de jogo','2026-04-28 15:33:23'),(152,152,'AGENDADO','FINALIZADO',NULL,22,1,'Finalização de jogo','2026-04-28 15:33:30'),(153,153,'AGENDADO','FINALIZADO',NULL,10,1,'Finalização de jogo','2026-04-28 15:33:42'),(154,154,'AGENDADO','FINALIZADO',NULL,9,1,'Finalização de jogo','2026-04-28 15:33:49'),(155,155,'AGENDADO','FINALIZADO',NULL,33,1,'Finalização de jogo','2026-04-28 15:33:57'),(156,156,'AGENDADO','FINALIZADO',NULL,48,1,'Finalização de jogo','2026-04-28 15:34:03'),(157,157,'AGENDADO','FINALIZADO',NULL,19,1,'Finalização de jogo','2026-04-28 19:09:45'),(158,158,'AGENDADO','FINALIZADO',NULL,37,1,'Finalização de jogo','2026-04-28 19:10:01'),(159,159,'AGENDADO','FINALIZADO',NULL,11,1,'Finalização de jogo','2026-04-28 19:10:10'),(160,160,'AGENDADO','FINALIZADO',NULL,40,1,'Finalização de jogo','2026-04-28 19:10:18'),(161,161,'AGENDADO','FINALIZADO',NULL,9,1,'Finalização de jogo','2026-04-28 19:10:23'),(162,162,'AGENDADO','FINALIZADO',NULL,33,1,'Finalização de jogo','2026-04-28 19:10:42'),(163,163,'AGENDADO','FINALIZADO',NULL,19,1,'Finalização de jogo','2026-04-28 19:11:33'),(164,164,'AGENDADO','FINALIZADO',NULL,11,1,'Finalização de jogo','2026-04-28 19:11:39');
/*!40000 ALTER TABLE `historico_resultados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscricoes_competicao`
--

DROP TABLE IF EXISTS `inscricoes_competicao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscricoes_competicao` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `competicao_id` bigint unsigned NOT NULL,
  `atleta_id` bigint unsigned NOT NULL,
  `seed_num` int unsigned DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INSCRITO',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_inscricao_comp_atleta` (`competicao_id`,`atleta_id`),
  KEY `idx_inscricao_comp` (`competicao_id`),
  KEY `idx_inscricao_atleta` (`atleta_id`),
  CONSTRAINT `fk_insc_atleta` FOREIGN KEY (`atleta_id`) REFERENCES `atletas` (`id`),
  CONSTRAINT `fk_insc_comp` FOREIGN KEY (`competicao_id`) REFERENCES `competicoes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_insc_status` CHECK ((`status` in (_utf8mb4'INSCRITO',_utf8mb4'CONFIRMADO',_utf8mb4'CANCELADO')))
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscricoes_competicao`
--

LOCK TABLES `inscricoes_competicao` WRITE;
/*!40000 ALTER TABLE `inscricoes_competicao` DISABLE KEYS */;
INSERT INTO `inscricoes_competicao` VALUES (101,5,22,NULL,'INSCRITO','2026-04-28 12:42:12'),(102,5,19,NULL,'INSCRITO','2026-04-28 12:42:12'),(103,5,27,NULL,'INSCRITO','2026-04-28 12:42:12'),(104,5,25,NULL,'INSCRITO','2026-04-28 12:42:12'),(105,5,29,NULL,'INSCRITO','2026-04-28 12:42:12'),(106,5,23,NULL,'INSCRITO','2026-04-28 12:42:12'),(107,5,8,NULL,'INSCRITO','2026-04-28 12:42:12'),(108,5,2,NULL,'INSCRITO','2026-04-28 12:42:12'),(109,5,15,NULL,'INSCRITO','2026-04-28 12:42:12'),(110,5,24,NULL,'INSCRITO','2026-04-28 12:42:12'),(111,5,33,NULL,'INSCRITO','2026-04-28 12:42:12'),(112,5,48,NULL,'INSCRITO','2026-04-28 12:42:12'),(113,5,35,NULL,'INSCRITO','2026-04-28 12:42:12'),(114,5,9,NULL,'INSCRITO','2026-04-28 12:42:12'),(115,5,44,NULL,'INSCRITO','2026-04-28 12:42:12'),(116,5,4,NULL,'INSCRITO','2026-04-28 12:42:12'),(117,5,32,NULL,'INSCRITO','2026-04-28 12:42:12'),(118,5,13,NULL,'INSCRITO','2026-04-28 12:42:12'),(119,5,12,NULL,'INSCRITO','2026-04-28 12:42:12'),(120,5,30,NULL,'INSCRITO','2026-04-28 12:42:12'),(121,5,47,NULL,'INSCRITO','2026-04-28 12:42:13'),(122,5,20,NULL,'INSCRITO','2026-04-28 12:42:13'),(123,5,28,NULL,'INSCRITO','2026-04-28 12:42:13'),(124,5,38,NULL,'INSCRITO','2026-04-28 12:42:13'),(125,5,36,NULL,'INSCRITO','2026-04-28 12:42:13'),(126,5,5,NULL,'INSCRITO','2026-04-28 12:42:13'),(127,5,31,NULL,'INSCRITO','2026-04-28 12:42:13'),(128,5,41,NULL,'INSCRITO','2026-04-28 12:42:13'),(129,5,40,NULL,'INSCRITO','2026-04-28 12:42:13'),(130,5,39,NULL,'INSCRITO','2026-04-28 12:42:13'),(131,5,10,NULL,'INSCRITO','2026-04-28 12:42:13'),(132,5,11,NULL,'INSCRITO','2026-04-28 12:42:13'),(133,5,18,NULL,'INSCRITO','2026-04-28 12:42:13'),(134,5,14,NULL,'INSCRITO','2026-04-28 12:42:13'),(135,5,46,NULL,'INSCRITO','2026-04-28 12:42:13'),(136,5,34,NULL,'INSCRITO','2026-04-28 12:42:13'),(137,5,42,NULL,'INSCRITO','2026-04-28 12:42:13'),(138,5,7,NULL,'INSCRITO','2026-04-28 12:42:13'),(139,5,21,NULL,'INSCRITO','2026-04-28 12:42:13'),(140,5,45,NULL,'INSCRITO','2026-04-28 12:42:13'),(141,5,43,NULL,'INSCRITO','2026-04-28 12:42:13'),(142,5,37,NULL,'INSCRITO','2026-04-28 12:42:13'),(143,5,26,NULL,'INSCRITO','2026-04-28 12:42:13'),(144,5,50,NULL,'INSCRITO','2026-04-28 12:42:13'),(145,5,49,NULL,'INSCRITO','2026-04-28 12:42:13'),(146,5,16,NULL,'INSCRITO','2026-04-28 12:42:13'),(147,5,3,NULL,'INSCRITO','2026-04-28 12:42:13'),(148,5,17,NULL,'INSCRITO','2026-04-28 12:42:13');
/*!40000 ALTER TABLE `inscricoes_competicao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jogos`
--

DROP TABLE IF EXISTS `jogos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jogos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `competicao_id` bigint unsigned NOT NULL,
  `fase` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rodada` int unsigned DEFAULT NULL,
  `atleta_a_id` bigint unsigned NOT NULL,
  `atleta_b_id` bigint unsigned DEFAULT NULL,
  `vencedor_id` bigint unsigned DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AGENDADO',
  `data_hora_prevista` datetime DEFAULT NULL,
  `data_hora_inicio` datetime DEFAULT NULL,
  `data_hora_fim` datetime DEFAULT NULL,
  `observacoes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_jogos_competicao` (`competicao_id`),
  KEY `idx_jogos_status` (`status`),
  KEY `idx_jogos_atleta_a` (`atleta_a_id`),
  KEY `idx_jogos_atleta_b` (`atleta_b_id`),
  KEY `idx_jogos_vencedor` (`vencedor_id`),
  CONSTRAINT `fk_jogo_atleta_a` FOREIGN KEY (`atleta_a_id`) REFERENCES `atletas` (`id`),
  CONSTRAINT `fk_jogo_atleta_b` FOREIGN KEY (`atleta_b_id`) REFERENCES `atletas` (`id`),
  CONSTRAINT `fk_jogo_comp` FOREIGN KEY (`competicao_id`) REFERENCES `competicoes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jogo_vencedor` FOREIGN KEY (`vencedor_id`) REFERENCES `atletas` (`id`),
  CONSTRAINT `chk_jogo_atletas_diff` CHECK ((`atleta_a_id` <> `atleta_b_id`)),
  CONSTRAINT `chk_jogo_datas` CHECK (((`data_hora_inicio` is null) or (`data_hora_fim` is null) or (`data_hora_fim` >= `data_hora_inicio`))),
  CONSTRAINT `chk_jogo_status` CHECK ((`status` in (_utf8mb4'AGENDADO',_utf8mb4'EM_ANDAMENTO',_utf8mb4'FINALIZADO',_utf8mb4'W_O',_utf8mb4'CANCELADO'))),
  CONSTRAINT `chk_jogo_vencedor_valido` CHECK (((`vencedor_id` is null) or (`vencedor_id` in (`atleta_a_id`,`atleta_b_id`))))
) ENGINE=InnoDB AUTO_INCREMENT=165 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jogos`
--

LOCK TABLES `jogos` WRITE;
/*!40000 ALTER TABLE `jogos` DISABLE KEYS */;
INSERT INTO `jogos` VALUES (1,5,'GRUPO_G01',1,19,35,19,'FINALIZADO',NULL,NULL,'2026-04-28 12:52:12',NULL,'2026-04-28 12:49:57','2026-04-28 12:52:12'),(2,5,'GRUPO_G01',2,21,33,21,'FINALIZADO',NULL,NULL,'2026-04-28 12:52:45',NULL,'2026-04-28 12:49:57','2026-04-28 12:52:45'),(3,5,'GRUPO_G01',3,41,2,2,'FINALIZADO',NULL,NULL,'2026-04-28 12:53:15',NULL,'2026-04-28 12:49:57','2026-04-28 12:53:15'),(4,5,'GRUPO_G01',4,19,21,19,'FINALIZADO',NULL,NULL,'2026-04-28 12:55:20',NULL,'2026-04-28 12:49:57','2026-04-28 12:55:20'),(5,5,'GRUPO_G01',5,19,41,19,'FINALIZADO',NULL,NULL,'2026-04-28 12:51:37',NULL,'2026-04-28 12:49:57','2026-04-28 12:51:37'),(6,5,'GRUPO_G01',6,19,2,19,'FINALIZADO',NULL,NULL,'2026-04-28 12:54:07',NULL,'2026-04-28 12:49:57','2026-04-28 12:54:07'),(7,5,'GRUPO_G01',7,19,33,19,'FINALIZADO',NULL,NULL,'2026-04-28 12:55:10',NULL,'2026-04-28 12:49:57','2026-04-28 12:55:10'),(8,5,'GRUPO_G01',8,21,41,21,'FINALIZADO',NULL,NULL,'2026-04-28 12:55:41',NULL,'2026-04-28 12:49:57','2026-04-28 12:55:41'),(9,5,'GRUPO_G01',9,21,2,2,'FINALIZADO',NULL,NULL,'2026-04-28 12:56:22',NULL,'2026-04-28 12:49:57','2026-04-28 12:56:22'),(10,5,'GRUPO_G01',10,21,35,21,'FINALIZADO',NULL,NULL,'2026-04-28 12:57:17',NULL,'2026-04-28 12:49:57','2026-04-28 12:57:17'),(11,5,'GRUPO_G01',11,41,33,41,'FINALIZADO',NULL,NULL,'2026-04-28 12:58:59',NULL,'2026-04-28 12:49:57','2026-04-28 12:58:59'),(12,5,'GRUPO_G01',12,41,35,35,'FINALIZADO',NULL,NULL,'2026-04-28 12:59:25',NULL,'2026-04-28 12:49:57','2026-04-28 12:59:25'),(13,5,'GRUPO_G01',13,2,33,2,'FINALIZADO',NULL,NULL,'2026-04-28 12:59:40',NULL,'2026-04-28 12:49:57','2026-04-28 12:59:40'),(14,5,'GRUPO_G01',14,2,35,2,'FINALIZADO',NULL,NULL,'2026-04-28 13:00:10',NULL,'2026-04-28 12:49:57','2026-04-28 13:00:10'),(15,5,'GRUPO_G01',15,33,35,35,'FINALIZADO',NULL,NULL,'2026-04-28 13:00:54',NULL,'2026-04-28 12:49:57','2026-04-28 13:00:54'),(16,5,'GRUPO_G02',1,32,15,32,'FINALIZADO',NULL,NULL,'2026-04-28 13:03:07',NULL,'2026-04-28 12:49:57','2026-04-28 13:03:07'),(17,5,'GRUPO_G02',2,43,29,43,'FINALIZADO',NULL,NULL,'2026-04-28 13:03:54',NULL,'2026-04-28 12:49:57','2026-04-28 13:03:54'),(18,5,'GRUPO_G02',3,17,28,28,'FINALIZADO',NULL,NULL,'2026-04-28 13:04:30',NULL,'2026-04-28 12:49:57','2026-04-28 13:04:30'),(19,5,'GRUPO_G02',4,32,43,32,'FINALIZADO',NULL,NULL,'2026-04-28 13:05:49',NULL,'2026-04-28 12:49:57','2026-04-28 13:05:49'),(20,5,'GRUPO_G02',5,32,17,32,'FINALIZADO',NULL,NULL,'2026-04-28 13:06:12',NULL,'2026-04-28 12:49:57','2026-04-28 13:06:12'),(21,5,'GRUPO_G02',6,32,28,32,'FINALIZADO',NULL,NULL,'2026-04-28 13:07:15',NULL,'2026-04-28 12:49:57','2026-04-28 13:07:15'),(22,5,'GRUPO_G02',7,32,29,32,'FINALIZADO',NULL,NULL,'2026-04-28 13:08:40',NULL,'2026-04-28 12:49:57','2026-04-28 13:08:40'),(23,5,'GRUPO_G02',8,43,17,43,'FINALIZADO',NULL,NULL,'2026-04-28 13:09:09',NULL,'2026-04-28 12:49:57','2026-04-28 13:09:09'),(24,5,'GRUPO_G02',9,43,28,43,'FINALIZADO',NULL,NULL,'2026-04-28 13:09:45',NULL,'2026-04-28 12:49:57','2026-04-28 13:09:45'),(25,5,'GRUPO_G02',10,43,15,43,'FINALIZADO',NULL,NULL,'2026-04-28 13:10:00',NULL,'2026-04-28 12:49:57','2026-04-28 13:10:00'),(26,5,'GRUPO_G02',11,17,29,29,'FINALIZADO',NULL,NULL,'2026-04-28 13:11:28',NULL,'2026-04-28 12:49:57','2026-04-28 13:11:28'),(27,5,'GRUPO_G02',12,17,15,17,'FINALIZADO',NULL,NULL,'2026-04-28 13:11:42',NULL,'2026-04-28 12:49:57','2026-04-28 13:11:42'),(28,5,'GRUPO_G02',13,28,29,28,'FINALIZADO',NULL,NULL,'2026-04-28 13:12:00',NULL,'2026-04-28 12:49:57','2026-04-28 13:12:00'),(29,5,'GRUPO_G02',14,28,15,28,'FINALIZADO',NULL,NULL,'2026-04-28 13:12:24',NULL,'2026-04-28 12:49:57','2026-04-28 13:12:24'),(30,5,'GRUPO_G02',15,29,15,29,'FINALIZADO',NULL,NULL,'2026-04-28 13:12:43',NULL,'2026-04-28 12:49:57','2026-04-28 13:12:43'),(31,5,'GRUPO_G03',1,12,20,12,'FINALIZADO',NULL,NULL,'2026-04-28 13:14:04',NULL,'2026-04-28 12:49:57','2026-04-28 13:14:04'),(32,5,'GRUPO_G03',2,31,26,31,'FINALIZADO',NULL,NULL,'2026-04-28 13:14:25',NULL,'2026-04-28 12:49:57','2026-04-28 13:14:25'),(33,5,'GRUPO_G03',3,40,34,40,'FINALIZADO',NULL,NULL,'2026-04-28 13:14:40',NULL,'2026-04-28 12:49:57','2026-04-28 13:14:40'),(34,5,'GRUPO_G03',4,12,31,12,'FINALIZADO',NULL,NULL,'2026-04-28 13:15:09',NULL,'2026-04-28 12:49:57','2026-04-28 13:15:09'),(35,5,'GRUPO_G03',5,12,40,12,'FINALIZADO',NULL,NULL,'2026-04-28 13:15:39',NULL,'2026-04-28 12:49:57','2026-04-28 13:15:39'),(36,5,'GRUPO_G03',6,12,34,12,'FINALIZADO',NULL,NULL,'2026-04-28 13:15:54',NULL,'2026-04-28 12:49:57','2026-04-28 13:15:54'),(37,5,'GRUPO_G03',7,12,26,12,'FINALIZADO',NULL,NULL,'2026-04-28 13:16:14',NULL,'2026-04-28 12:49:57','2026-04-28 13:16:14'),(38,5,'GRUPO_G03',8,31,40,31,'FINALIZADO',NULL,NULL,'2026-04-28 13:16:35',NULL,'2026-04-28 12:49:57','2026-04-28 13:16:35'),(39,5,'GRUPO_G03',9,31,34,31,'FINALIZADO',NULL,NULL,'2026-04-28 13:16:53',NULL,'2026-04-28 12:49:57','2026-04-28 13:16:53'),(40,5,'GRUPO_G03',10,31,20,31,'FINALIZADO',NULL,NULL,'2026-04-28 13:17:08',NULL,'2026-04-28 12:49:57','2026-04-28 13:17:08'),(41,5,'GRUPO_G03',11,40,26,40,'FINALIZADO',NULL,NULL,'2026-04-28 13:17:41',NULL,'2026-04-28 12:49:57','2026-04-28 13:17:41'),(42,5,'GRUPO_G03',12,40,20,40,'FINALIZADO',NULL,NULL,'2026-04-28 13:18:12',NULL,'2026-04-28 12:49:57','2026-04-28 13:18:12'),(43,5,'GRUPO_G03',13,34,26,26,'FINALIZADO',NULL,NULL,'2026-04-28 13:18:37',NULL,'2026-04-28 12:49:57','2026-04-28 13:18:37'),(44,5,'GRUPO_G03',14,34,20,20,'FINALIZADO',NULL,NULL,'2026-04-28 13:18:57',NULL,'2026-04-28 12:49:57','2026-04-28 13:18:57'),(45,5,'GRUPO_G03',15,26,20,26,'FINALIZADO',NULL,NULL,'2026-04-28 13:19:21',NULL,'2026-04-28 12:49:57','2026-04-28 13:19:21'),(46,5,'GRUPO_G04',1,24,9,24,'FINALIZADO',NULL,NULL,'2026-04-28 13:49:00',NULL,'2026-04-28 12:49:57','2026-04-28 13:49:00'),(47,5,'GRUPO_G04',2,25,48,25,'FINALIZADO',NULL,NULL,'2026-04-28 13:49:45',NULL,'2026-04-28 12:49:57','2026-04-28 13:49:45'),(48,5,'GRUPO_G04',3,49,22,22,'FINALIZADO',NULL,NULL,'2026-04-28 13:50:25',NULL,'2026-04-28 12:49:57','2026-04-28 13:50:25'),(49,5,'GRUPO_G04',4,24,25,24,'FINALIZADO',NULL,NULL,'2026-04-28 13:51:15',NULL,'2026-04-28 12:49:57','2026-04-28 13:51:15'),(50,5,'GRUPO_G04',5,24,49,24,'FINALIZADO',NULL,NULL,'2026-04-28 13:53:40',NULL,'2026-04-28 12:49:57','2026-04-28 13:53:40'),(51,5,'GRUPO_G04',6,24,22,24,'FINALIZADO',NULL,NULL,'2026-04-28 13:53:52',NULL,'2026-04-28 12:49:57','2026-04-28 13:53:52'),(52,5,'GRUPO_G04',7,24,48,24,'FINALIZADO',NULL,NULL,'2026-04-28 13:54:14',NULL,'2026-04-28 12:49:57','2026-04-28 13:54:14'),(53,5,'GRUPO_G04',8,25,49,25,'FINALIZADO',NULL,NULL,'2026-04-28 13:54:54',NULL,'2026-04-28 12:49:57','2026-04-28 13:54:54'),(54,5,'GRUPO_G04',9,25,22,25,'FINALIZADO',NULL,NULL,'2026-04-28 13:55:14',NULL,'2026-04-28 12:49:57','2026-04-28 13:55:14'),(55,5,'GRUPO_G04',10,25,9,25,'FINALIZADO',NULL,NULL,'2026-04-28 13:55:35',NULL,'2026-04-28 12:49:57','2026-04-28 13:55:35'),(56,5,'GRUPO_G04',11,49,48,49,'FINALIZADO',NULL,NULL,'2026-04-28 13:56:12',NULL,'2026-04-28 12:49:57','2026-04-28 13:56:12'),(57,5,'GRUPO_G04',12,49,9,49,'FINALIZADO',NULL,NULL,'2026-04-28 13:58:41',NULL,'2026-04-28 12:49:57','2026-04-28 13:58:41'),(58,5,'GRUPO_G04',13,22,48,22,'FINALIZADO',NULL,NULL,'2026-04-28 13:59:15',NULL,'2026-04-28 12:49:57','2026-04-28 13:59:15'),(59,5,'GRUPO_G04',14,22,9,22,'FINALIZADO',NULL,NULL,'2026-04-28 13:59:50',NULL,'2026-04-28 12:49:57','2026-04-28 13:59:50'),(60,5,'GRUPO_G04',15,48,9,9,'FINALIZADO',NULL,NULL,'2026-04-28 14:00:37',NULL,'2026-04-28 12:49:57','2026-04-28 14:00:37'),(61,5,'GRUPO_G05',1,14,8,14,'FINALIZADO',NULL,NULL,'2026-04-28 14:01:03',NULL,'2026-04-28 12:49:57','2026-04-28 14:01:03'),(62,5,'GRUPO_G05',2,45,30,45,'FINALIZADO',NULL,NULL,'2026-04-28 14:01:17',NULL,'2026-04-28 12:49:57','2026-04-28 14:01:17'),(63,5,'GRUPO_G05',3,27,23,23,'FINALIZADO',NULL,NULL,'2026-04-28 14:01:33',NULL,'2026-04-28 12:49:57','2026-04-28 14:01:33'),(64,5,'GRUPO_G05',4,14,45,14,'FINALIZADO',NULL,NULL,'2026-04-28 14:02:03',NULL,'2026-04-28 12:49:57','2026-04-28 14:02:03'),(65,5,'GRUPO_G05',5,14,27,14,'FINALIZADO',NULL,NULL,'2026-04-28 14:02:23',NULL,'2026-04-28 12:49:57','2026-04-28 14:02:23'),(66,5,'GRUPO_G05',6,14,23,14,'FINALIZADO',NULL,NULL,'2026-04-28 14:02:47',NULL,'2026-04-28 12:49:57','2026-04-28 14:02:47'),(67,5,'GRUPO_G05',7,14,30,14,'FINALIZADO',NULL,NULL,'2026-04-28 14:03:07',NULL,'2026-04-28 12:49:57','2026-04-28 14:03:07'),(68,5,'GRUPO_G05',8,45,27,27,'FINALIZADO',NULL,NULL,'2026-04-28 14:03:26',NULL,'2026-04-28 12:49:57','2026-04-28 14:03:26'),(69,5,'GRUPO_G05',9,45,23,23,'FINALIZADO',NULL,NULL,'2026-04-28 14:03:55',NULL,'2026-04-28 12:49:57','2026-04-28 14:03:55'),(70,5,'GRUPO_G05',10,45,8,8,'FINALIZADO',NULL,NULL,'2026-04-28 14:04:19',NULL,'2026-04-28 12:49:57','2026-04-28 14:04:19'),(71,5,'GRUPO_G05',11,27,30,27,'FINALIZADO',NULL,NULL,'2026-04-28 14:04:40',NULL,'2026-04-28 12:49:57','2026-04-28 14:04:40'),(72,5,'GRUPO_G05',12,27,8,27,'FINALIZADO',NULL,NULL,'2026-04-28 14:05:07',NULL,'2026-04-28 12:49:57','2026-04-28 14:05:07'),(73,5,'GRUPO_G05',13,23,30,23,'FINALIZADO',NULL,NULL,'2026-04-28 14:05:30',NULL,'2026-04-28 12:49:57','2026-04-28 14:05:30'),(74,5,'GRUPO_G05',14,23,8,23,'FINALIZADO',NULL,NULL,'2026-04-28 14:05:52',NULL,'2026-04-28 12:49:57','2026-04-28 14:05:52'),(75,5,'GRUPO_G05',15,30,8,8,'FINALIZADO',NULL,NULL,'2026-04-28 14:06:19',NULL,'2026-04-28 12:49:57','2026-04-28 14:19:42'),(76,5,'GRUPO_G06',1,46,44,46,'FINALIZADO',NULL,NULL,'2026-04-28 14:20:48',NULL,'2026-04-28 12:49:57','2026-04-28 14:20:48'),(77,5,'GRUPO_G06',2,47,38,47,'FINALIZADO',NULL,NULL,'2026-04-28 14:21:05',NULL,'2026-04-28 12:49:57','2026-04-28 14:21:05'),(78,5,'GRUPO_G06',3,11,16,11,'FINALIZADO',NULL,NULL,'2026-04-28 14:21:23',NULL,'2026-04-28 12:49:57','2026-04-28 14:21:23'),(79,5,'GRUPO_G06',4,46,47,46,'FINALIZADO',NULL,NULL,'2026-04-28 14:22:00',NULL,'2026-04-28 12:49:57','2026-04-28 14:22:00'),(80,5,'GRUPO_G06',5,46,11,46,'FINALIZADO',NULL,NULL,'2026-04-28 14:22:16',NULL,'2026-04-28 12:49:57','2026-04-28 14:22:16'),(81,5,'GRUPO_G06',6,46,16,46,'FINALIZADO',NULL,NULL,'2026-04-28 14:22:31',NULL,'2026-04-28 12:49:57','2026-04-28 14:22:31'),(82,5,'GRUPO_G06',7,46,38,46,'FINALIZADO',NULL,NULL,'2026-04-28 14:22:58',NULL,'2026-04-28 12:49:57','2026-04-28 14:22:58'),(83,5,'GRUPO_G06',8,47,11,47,'FINALIZADO',NULL,NULL,'2026-04-28 14:23:51',NULL,'2026-04-28 12:49:57','2026-04-28 14:23:51'),(84,5,'GRUPO_G06',9,47,16,47,'FINALIZADO',NULL,NULL,'2026-04-28 14:24:57',NULL,'2026-04-28 12:49:57','2026-04-28 14:24:57'),(85,5,'GRUPO_G06',10,47,44,47,'FINALIZADO',NULL,NULL,'2026-04-28 14:25:44',NULL,'2026-04-28 12:49:57','2026-04-28 14:25:44'),(86,5,'GRUPO_G06',11,11,38,11,'FINALIZADO',NULL,NULL,'2026-04-28 14:26:06',NULL,'2026-04-28 12:49:57','2026-04-28 14:26:06'),(87,5,'GRUPO_G06',12,11,44,11,'FINALIZADO',NULL,NULL,'2026-04-28 14:26:36',NULL,'2026-04-28 12:49:57','2026-04-28 14:26:36'),(88,5,'GRUPO_G06',13,16,38,38,'FINALIZADO',NULL,NULL,'2026-04-28 14:28:26',NULL,'2026-04-28 12:49:57','2026-04-28 14:28:26'),(89,5,'GRUPO_G06',14,16,44,44,'FINALIZADO',NULL,NULL,'2026-04-28 14:28:42',NULL,'2026-04-28 12:49:57','2026-04-28 14:28:42'),(90,5,'GRUPO_G06',15,38,44,44,'FINALIZADO',NULL,NULL,'2026-04-28 14:36:13',NULL,'2026-04-28 12:49:57','2026-04-28 14:36:13'),(91,5,'GRUPO_G07',1,37,5,37,'FINALIZADO',NULL,NULL,'2026-04-28 14:37:06',NULL,'2026-04-28 12:49:57','2026-04-28 14:37:06'),(92,5,'GRUPO_G07',2,42,36,42,'FINALIZADO',NULL,NULL,'2026-04-28 14:37:30',NULL,'2026-04-28 12:49:57','2026-04-28 14:37:30'),(93,5,'GRUPO_G07',3,39,50,39,'FINALIZADO',NULL,NULL,'2026-04-28 14:38:42',NULL,'2026-04-28 12:49:57','2026-04-28 14:38:42'),(94,5,'GRUPO_G07',4,37,42,37,'FINALIZADO',NULL,NULL,'2026-04-28 14:39:06',NULL,'2026-04-28 12:49:57','2026-04-28 14:39:06'),(95,5,'GRUPO_G07',5,37,39,37,'FINALIZADO',NULL,NULL,'2026-04-28 14:39:56',NULL,'2026-04-28 12:49:57','2026-04-28 14:39:56'),(96,5,'GRUPO_G07',6,37,50,37,'FINALIZADO',NULL,NULL,'2026-04-28 14:40:26',NULL,'2026-04-28 12:49:57','2026-04-28 14:40:26'),(97,5,'GRUPO_G07',7,37,36,37,'FINALIZADO',NULL,NULL,'2026-04-28 14:40:38',NULL,'2026-04-28 12:49:57','2026-04-28 14:40:38'),(98,5,'GRUPO_G07',8,42,39,42,'FINALIZADO',NULL,NULL,'2026-04-28 14:41:13',NULL,'2026-04-28 12:49:57','2026-04-28 14:41:13'),(99,5,'GRUPO_G07',9,42,50,42,'FINALIZADO',NULL,NULL,'2026-04-28 14:41:44',NULL,'2026-04-28 12:49:57','2026-04-28 14:41:44'),(100,5,'GRUPO_G07',10,42,5,42,'FINALIZADO',NULL,NULL,'2026-04-28 14:43:04',NULL,'2026-04-28 12:49:57','2026-04-28 14:43:04'),(101,5,'GRUPO_G07',11,39,36,39,'FINALIZADO',NULL,NULL,'2026-04-28 14:44:08',NULL,'2026-04-28 12:49:57','2026-04-28 14:44:08'),(102,5,'GRUPO_G07',12,39,5,39,'FINALIZADO',NULL,NULL,'2026-04-28 14:44:34',NULL,'2026-04-28 12:49:57','2026-04-28 14:44:34'),(103,5,'GRUPO_G07',13,50,36,50,'FINALIZADO',NULL,NULL,'2026-04-28 14:44:55',NULL,'2026-04-28 12:49:57','2026-04-28 14:44:55'),(104,5,'GRUPO_G07',14,50,5,50,'FINALIZADO',NULL,NULL,'2026-04-28 14:45:14',NULL,'2026-04-28 12:49:57','2026-04-28 14:45:14'),(105,5,'GRUPO_G07',15,36,5,5,'FINALIZADO',NULL,NULL,'2026-04-28 14:45:33',NULL,'2026-04-28 12:49:57','2026-04-28 14:45:33'),(106,5,'GRUPO_G08',1,7,13,7,'FINALIZADO',NULL,NULL,'2026-04-28 14:46:18',NULL,'2026-04-28 12:49:57','2026-04-28 14:46:18'),(107,5,'GRUPO_G08',2,4,3,3,'FINALIZADO',NULL,NULL,'2026-04-28 14:46:38',NULL,'2026-04-28 12:49:57','2026-04-28 14:46:38'),(108,5,'GRUPO_G08',3,18,10,10,'FINALIZADO',NULL,NULL,'2026-04-28 14:46:57',NULL,'2026-04-28 12:49:57','2026-04-28 14:46:57'),(109,5,'GRUPO_G08',4,7,4,7,'FINALIZADO',NULL,NULL,'2026-04-28 14:47:22',NULL,'2026-04-28 12:49:57','2026-04-28 14:47:22'),(110,5,'GRUPO_G08',5,7,18,7,'FINALIZADO',NULL,NULL,'2026-04-28 14:47:36',NULL,'2026-04-28 12:49:57','2026-04-28 14:47:36'),(111,5,'GRUPO_G08',6,7,10,7,'FINALIZADO',NULL,NULL,'2026-04-28 14:47:58',NULL,'2026-04-28 12:49:57','2026-04-28 14:47:58'),(112,5,'GRUPO_G08',7,7,3,7,'FINALIZADO',NULL,NULL,'2026-04-28 14:48:13',NULL,'2026-04-28 12:49:57','2026-04-28 14:48:13'),(113,5,'GRUPO_G08',8,4,18,4,'FINALIZADO',NULL,NULL,'2026-04-28 14:48:31',NULL,'2026-04-28 12:49:57','2026-04-28 14:48:31'),(114,5,'GRUPO_G08',9,4,10,4,'FINALIZADO',NULL,NULL,'2026-04-28 14:49:01',NULL,'2026-04-28 12:49:57','2026-04-28 14:49:01'),(115,5,'GRUPO_G08',10,4,13,13,'FINALIZADO',NULL,NULL,'2026-04-28 14:49:41',NULL,'2026-04-28 12:49:57','2026-04-28 14:49:41'),(116,5,'GRUPO_G08',11,18,3,3,'FINALIZADO',NULL,NULL,'2026-04-28 14:50:05',NULL,'2026-04-28 12:49:57','2026-04-28 14:50:05'),(117,5,'GRUPO_G08',12,18,13,13,'FINALIZADO',NULL,NULL,'2026-04-28 14:50:19',NULL,'2026-04-28 12:49:57','2026-04-28 14:50:19'),(118,5,'GRUPO_G08',13,10,3,3,'FINALIZADO',NULL,NULL,'2026-04-28 14:50:50',NULL,'2026-04-28 12:49:57','2026-04-28 14:50:50'),(119,5,'GRUPO_G08',14,10,13,13,'FINALIZADO',NULL,NULL,'2026-04-28 14:51:08',NULL,'2026-04-28 12:49:57','2026-04-28 14:51:08'),(120,5,'GRUPO_G08',15,3,13,3,'FINALIZADO',NULL,NULL,'2026-04-28 14:51:29',NULL,'2026-04-28 12:49:57','2026-04-28 14:51:29'),(121,5,'OPEN_A_OITAVAS',NULL,7,25,7,'FINALIZADO',NULL,NULL,'2026-04-28 15:22:54',NULL,'2026-04-28 15:06:22','2026-04-28 15:22:54'),(122,5,'OPEN_A_OITAVAS',NULL,42,32,42,'FINALIZADO',NULL,NULL,'2026-04-28 15:23:01',NULL,'2026-04-28 15:06:22','2026-04-28 15:23:01'),(123,5,'OPEN_A_OITAVAS',NULL,46,23,46,'FINALIZADO',NULL,NULL,'2026-04-28 15:23:06',NULL,'2026-04-28 15:06:22','2026-04-28 15:23:06'),(124,5,'OPEN_A_OITAVAS',NULL,31,19,19,'FINALIZADO',NULL,NULL,'2026-04-28 15:23:13',NULL,'2026-04-28 15:06:22','2026-04-28 15:23:13'),(125,5,'OPEN_A_OITAVAS',NULL,12,3,12,'FINALIZADO',NULL,NULL,'2026-04-28 15:23:19',NULL,'2026-04-28 15:06:22','2026-04-28 15:23:19'),(126,5,'OPEN_A_OITAVAS',NULL,47,14,47,'FINALIZADO',NULL,NULL,'2026-04-28 15:23:25',NULL,'2026-04-28 15:06:22','2026-04-28 15:23:25'),(127,5,'OPEN_A_OITAVAS',NULL,37,2,37,'FINALIZADO',NULL,NULL,'2026-04-28 15:23:29',NULL,'2026-04-28 15:06:22','2026-04-28 15:23:29'),(128,5,'OPEN_A_OITAVAS',NULL,43,24,43,'W_O',NULL,NULL,'2026-04-28 15:23:35',NULL,'2026-04-28 15:06:22','2026-04-28 19:23:17'),(129,5,'OPEN_B_OITAVAS',NULL,13,49,13,'FINALIZADO',NULL,NULL,'2026-04-28 15:24:04',NULL,'2026-04-28 15:06:22','2026-04-28 15:24:04'),(130,5,'OPEN_B_OITAVAS',NULL,50,28,50,'FINALIZADO',NULL,NULL,'2026-04-28 15:24:10',NULL,'2026-04-28 15:06:23','2026-04-28 15:24:10'),(131,5,'OPEN_B_OITAVAS',NULL,11,8,11,'FINALIZADO',NULL,NULL,'2026-04-28 15:24:16',NULL,'2026-04-28 15:06:23','2026-04-28 15:24:16'),(132,5,'OPEN_B_OITAVAS',NULL,26,21,21,'FINALIZADO',NULL,NULL,'2026-04-28 15:24:21',NULL,'2026-04-28 15:06:23','2026-04-28 15:24:21'),(133,5,'OPEN_B_OITAVAS',NULL,40,4,40,'FINALIZADO',NULL,NULL,'2026-04-28 15:24:30',NULL,'2026-04-28 15:06:23','2026-04-28 15:24:30'),(134,5,'OPEN_B_OITAVAS',NULL,44,27,44,'FINALIZADO',NULL,NULL,'2026-04-28 15:24:34',NULL,'2026-04-28 15:06:23','2026-04-28 15:24:34'),(135,5,'OPEN_B_OITAVAS',NULL,39,35,35,'FINALIZADO',NULL,NULL,'2026-04-28 15:24:45',NULL,'2026-04-28 15:06:23','2026-04-28 15:24:45'),(136,5,'OPEN_C_QUARTAS',NULL,10,29,10,'FINALIZADO',NULL,NULL,'2026-04-28 15:24:58',NULL,'2026-04-28 15:07:20','2026-04-28 15:24:58'),(137,5,'OPEN_C_QUARTAS',NULL,38,41,38,'FINALIZADO',NULL,NULL,'2026-04-28 15:25:07',NULL,'2026-04-28 15:07:20','2026-04-28 15:25:07'),(138,5,'OPEN_C_QUARTAS',NULL,20,45,45,'FINALIZADO',NULL,NULL,'2026-04-28 15:25:13',NULL,'2026-04-28 15:07:20','2026-04-28 15:25:13'),(139,5,'OPEN_C_QUARTAS',NULL,5,9,9,'FINALIZADO',NULL,NULL,'2026-04-28 15:25:25',NULL,'2026-04-28 15:07:20','2026-04-28 15:25:25'),(140,5,'OPEN_D_QUARTAS',NULL,18,15,18,'FINALIZADO',NULL,NULL,'2026-04-28 15:25:36',NULL,'2026-04-28 15:07:20','2026-04-28 15:25:36'),(141,5,'OPEN_D_QUARTAS',NULL,16,33,33,'FINALIZADO',NULL,NULL,'2026-04-28 15:25:42',NULL,'2026-04-28 15:07:20','2026-04-28 15:25:42'),(142,5,'OPEN_D_QUARTAS',NULL,34,30,34,'FINALIZADO',NULL,NULL,'2026-04-28 15:25:48',NULL,'2026-04-28 15:07:20','2026-04-28 15:25:48'),(143,5,'OPEN_D_QUARTAS',NULL,36,48,48,'FINALIZADO',NULL,NULL,'2026-04-28 15:25:59',NULL,'2026-04-28 15:07:20','2026-04-28 15:25:59'),(144,5,'OPEN_B_OITAVAS',NULL,22,NULL,22,'W_O',NULL,NULL,NULL,'BYE_IDS:22','2026-04-28 15:21:27','2026-04-28 15:21:27'),(145,5,'OPEN_A_QUARTAS',NULL,7,42,7,'FINALIZADO',NULL,NULL,'2026-04-28 15:32:41',NULL,'2026-04-28 15:29:51','2026-04-28 15:32:41'),(146,5,'OPEN_A_QUARTAS',NULL,46,19,19,'FINALIZADO',NULL,NULL,'2026-04-28 15:32:47',NULL,'2026-04-28 15:29:51','2026-04-28 15:32:47'),(147,5,'OPEN_A_QUARTAS',NULL,12,47,12,'FINALIZADO',NULL,NULL,'2026-04-28 15:32:52',NULL,'2026-04-28 15:29:51','2026-04-28 15:32:52'),(148,5,'OPEN_A_QUARTAS',NULL,37,43,37,'FINALIZADO',NULL,NULL,'2026-04-28 15:32:56',NULL,'2026-04-28 15:29:51','2026-04-28 15:32:56'),(149,5,'OPEN_B_QUARTAS',NULL,13,50,50,'FINALIZADO',NULL,NULL,'2026-04-28 15:33:13',NULL,'2026-04-28 15:29:51','2026-04-28 15:33:13'),(150,5,'OPEN_B_QUARTAS',NULL,11,21,11,'FINALIZADO',NULL,NULL,'2026-04-28 15:33:18',NULL,'2026-04-28 15:29:51','2026-04-28 15:33:18'),(151,5,'OPEN_B_QUARTAS',NULL,40,44,40,'FINALIZADO',NULL,NULL,'2026-04-28 15:33:23',NULL,'2026-04-28 15:29:51','2026-04-28 15:33:23'),(152,5,'OPEN_B_QUARTAS',NULL,35,22,22,'FINALIZADO',NULL,NULL,'2026-04-28 15:33:30',NULL,'2026-04-28 15:29:51','2026-04-28 15:33:30'),(153,5,'OPEN_C_SEMI',NULL,10,38,10,'FINALIZADO',NULL,NULL,'2026-04-28 15:33:42',NULL,'2026-04-28 15:29:51','2026-04-28 15:33:42'),(154,5,'OPEN_C_SEMI',NULL,45,9,9,'FINALIZADO',NULL,NULL,'2026-04-28 15:33:49',NULL,'2026-04-28 15:29:51','2026-04-28 15:33:49'),(155,5,'OPEN_D_SEMI',NULL,18,33,33,'FINALIZADO',NULL,NULL,'2026-04-28 15:33:57',NULL,'2026-04-28 15:29:51','2026-04-28 15:33:57'),(156,5,'OPEN_D_SEMI',NULL,34,48,48,'FINALIZADO',NULL,NULL,'2026-04-28 15:34:03',NULL,'2026-04-28 15:29:51','2026-04-28 15:34:03'),(157,5,'OPEN_A_SEMI',NULL,7,19,19,'FINALIZADO',NULL,NULL,'2026-04-28 19:09:45',NULL,'2026-04-28 19:07:31','2026-04-28 19:09:45'),(158,5,'OPEN_A_SEMI',NULL,12,37,37,'FINALIZADO',NULL,NULL,'2026-04-28 19:10:01',NULL,'2026-04-28 19:07:31','2026-04-28 19:10:01'),(159,5,'OPEN_B_SEMI',NULL,50,11,11,'FINALIZADO',NULL,NULL,'2026-04-28 19:10:10',NULL,'2026-04-28 19:09:11','2026-04-28 19:10:10'),(160,5,'OPEN_B_SEMI',NULL,40,22,40,'FINALIZADO',NULL,NULL,'2026-04-28 19:10:18',NULL,'2026-04-28 19:09:11','2026-04-28 19:10:18'),(161,5,'OPEN_C_FINAL',NULL,10,9,9,'FINALIZADO',NULL,NULL,'2026-04-28 19:10:23',NULL,'2026-04-28 19:09:11','2026-04-28 19:10:23'),(162,5,'OPEN_D_FINAL',NULL,33,48,33,'FINALIZADO',NULL,NULL,'2026-04-28 19:10:42',NULL,'2026-04-28 19:09:11','2026-04-28 19:10:42'),(163,5,'OPEN_A_FINAL',NULL,19,37,19,'FINALIZADO',NULL,NULL,'2026-04-28 19:11:33',NULL,'2026-04-28 19:11:23','2026-04-28 19:11:33'),(164,5,'OPEN_B_FINAL',NULL,11,40,11,'FINALIZADO',NULL,NULL,'2026-04-28 19:11:39',NULL,'2026-04-28 19:11:23','2026-04-28 19:11:39');
/*!40000 ALTER TABLE `jogos` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_jogos_bu_finalizacao` BEFORE UPDATE ON `jogos` FOR EACH ROW BEGIN
    DECLARE v_tipo VARCHAR(30);
  DECLARE v_peso INT DEFAULT 1;

  DECLARE v_ra_old DECIMAL(10,2);
  DECLARE v_rb_old DECIMAL(10,2);
  DECLARE v_ra_new DECIMAL(10,2);
  DECLARE v_rb_new DECIMAL(10,2);

  DECLARE v_diff INT;
  DECLARE v_expected_win TINYINT;

  DECLARE v_v_points INT;
  DECLARE v_l_points INT;

  DECLARE v_vencedor_calc BIGINT UNSIGNED;
  DECLARE v_admin_id BIGINT UNSIGNED DEFAULT 1;

  IF NEW.status = 'FINALIZADO' AND OLD.status <> 'FINALIZADO' THEN

    -- Se não veio vencedor, tenta obter via sets
    IF NEW.vencedor_id IS NULL THEN
      CALL sp_obter_vencedor_jogo(NEW.id, v_vencedor_calc);
      SET NEW.vencedor_id = v_vencedor_calc;
END IF;

-- valida vencedor
IF NEW.vencedor_id IS NULL OR NEW.vencedor_id NOT IN (NEW.atleta_a_id, NEW.atleta_b_id) THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Jogo FINALIZADO exige vencedor_id válido (atleta_a_id ou atleta_b_id).';
END IF;

    -- peso por tipo de competição
SELECT c.tipo INTO v_tipo
FROM competicoes c
WHERE c.id = NEW.competicao_id;

IF v_tipo = 'SPING_OPEN' THEN
      SET v_peso = 2;
ELSE
      SET v_peso = 1; -- SPING_FOODS
END IF;

    -- ratings atuais
SELECT rating_atual INTO v_ra_old
FROM atletas
WHERE id = NEW.atleta_a_id
    FOR UPDATE;

SELECT rating_atual INTO v_rb_old
FROM atletas
WHERE id = NEW.atleta_b_id
    FOR UPDATE;

SET v_diff = ABS(ROUND(v_ra_old - v_rb_old));

    -- esperado/inseperado
    IF (NEW.vencedor_id = NEW.atleta_a_id AND v_ra_old >= v_rb_old)
       OR (NEW.vencedor_id = NEW.atleta_b_id AND v_rb_old >= v_ra_old) THEN
      SET v_expected_win = 1;
ELSE
      SET v_expected_win = 0;
END IF;

CALL sp_get_pontos_partida(v_diff, v_expected_win, v_v_points, v_l_points);

SET v_v_points = v_v_points * v_peso;
    SET v_l_points = v_l_points * v_peso;

    -- aplica stats + rating
    IF NEW.vencedor_id = NEW.atleta_a_id THEN
      SET v_ra_new = v_ra_old + v_v_points;
      SET v_rb_new = GREATEST(0, v_rb_old - v_l_points);

UPDATE atletas
SET partidas_jogadas = partidas_jogadas + 1,
    vitorias = vitorias + 1,
    rating_atual = v_ra_new
WHERE id = NEW.atleta_a_id;

UPDATE atletas
SET partidas_jogadas = partidas_jogadas + 1,
    derrotas = derrotas + 1,
    rating_atual = v_rb_new
WHERE id = NEW.atleta_b_id;
ELSE
      SET v_rb_new = v_rb_old + v_v_points;
      SET v_ra_new = GREATEST(0, v_ra_old - v_l_points);

UPDATE atletas
SET partidas_jogadas = partidas_jogadas + 1,
    derrotas = derrotas + 1,
    rating_atual = v_ra_new
WHERE id = NEW.atleta_a_id;

UPDATE atletas
SET partidas_jogadas = partidas_jogadas + 1,
    vitorias = vitorias + 1,
    rating_atual = v_rb_new
WHERE id = NEW.atleta_b_id;
END IF;

    -- histórico de rating (A)
INSERT INTO historico_rating_ranking
(atleta_id, jogo_id, rating_anterior, rating_novo, ranking_anterior, ranking_novo, motivo, alterado_por, created_at)
VALUES
    (NEW.atleta_a_id, NEW.id, v_ra_old, v_ra_new, NULL, NULL,
     CONCAT('Finalização de jogo | tipo=', v_tipo, ' | peso=', v_peso, ' | Δ=', v_diff, ' | esperado=', v_expected_win),
     v_admin_id, NOW());

-- histórico de rating (B)
INSERT INTO historico_rating_ranking
(atleta_id, jogo_id, rating_anterior, rating_novo, ranking_anterior, ranking_novo, motivo, alterado_por, created_at)
VALUES
    (NEW.atleta_b_id, NEW.id, v_rb_old, v_rb_new, NULL, NULL,
     CONCAT('Finalização de jogo | tipo=', v_tipo, ' | peso=', v_peso, ' | Δ=', v_diff, ' | esperado=', v_expected_win),
     v_admin_id, NOW());

-- auditoria de resultado
INSERT INTO historico_resultados
(jogo_id, status_anterior, status_novo, vencedor_anterior_id, vencedor_novo_id, alterado_por, motivo, created_at)
VALUES
    (NEW.id, OLD.status, NEW.status, OLD.vencedor_id, NEW.vencedor_id, v_admin_id, 'Finalização de jogo', NOW());

IF NEW.data_hora_fim IS NULL THEN
      SET NEW.data_hora_fim = NOW();
END IF;

END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `sets_jogo`
--

DROP TABLE IF EXISTS `sets_jogo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sets_jogo` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `jogo_id` bigint unsigned NOT NULL,
  `numero_set` int unsigned NOT NULL,
  `pontos_atleta_a` int unsigned NOT NULL,
  `pontos_atleta_b` int unsigned NOT NULL,
  `vencedor_set_id` bigint unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_set_unico` (`jogo_id`,`numero_set`),
  KEY `idx_sets_jogo` (`jogo_id`),
  KEY `fk_set_vencedor` (`vencedor_set_id`),
  CONSTRAINT `fk_set_jogo` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_set_vencedor` FOREIGN KEY (`vencedor_set_id`) REFERENCES `atletas` (`id`),
  CONSTRAINT `chk_set_vencedor_pontos` CHECK (((`vencedor_set_id` is null) or (`pontos_atleta_a` <> `pontos_atleta_b`)))
) ENGINE=InnoDB AUTO_INCREMENT=526 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sets_jogo`
--

LOCK TABLES `sets_jogo` WRITE;
/*!40000 ALTER TABLE `sets_jogo` DISABLE KEYS */;
INSERT INTO `sets_jogo` VALUES (1,5,1,11,3,19,'2026-04-28 12:51:37'),(2,5,2,11,2,19,'2026-04-28 12:51:37'),(3,5,3,11,3,19,'2026-04-28 12:51:37'),(4,1,1,11,3,19,'2026-04-28 12:52:12'),(5,1,2,11,8,19,'2026-04-28 12:52:12'),(6,1,3,11,9,19,'2026-04-28 12:52:12'),(7,2,1,11,6,21,'2026-04-28 12:52:45'),(8,2,2,11,5,21,'2026-04-28 12:52:45'),(9,2,3,11,9,21,'2026-04-28 12:52:45'),(10,3,1,5,11,2,'2026-04-28 12:53:15'),(11,3,2,5,11,2,'2026-04-28 12:53:15'),(12,3,3,1,11,2,'2026-04-28 12:53:15'),(13,6,1,11,7,19,'2026-04-28 12:54:07'),(14,6,2,11,2,19,'2026-04-28 12:54:07'),(15,6,3,11,1,19,'2026-04-28 12:54:07'),(16,7,1,11,2,19,'2026-04-28 12:55:10'),(17,7,2,11,5,19,'2026-04-28 12:55:10'),(18,7,3,11,2,19,'2026-04-28 12:55:10'),(19,4,1,11,0,19,'2026-04-28 12:55:20'),(20,4,2,11,0,19,'2026-04-28 12:55:20'),(21,4,3,11,0,19,'2026-04-28 12:55:20'),(22,8,1,11,5,21,'2026-04-28 12:55:41'),(23,8,2,11,7,21,'2026-04-28 12:55:41'),(24,8,3,11,7,21,'2026-04-28 12:55:41'),(25,9,1,12,10,21,'2026-04-28 12:56:22'),(26,9,2,11,6,21,'2026-04-28 12:56:22'),(27,9,3,6,11,2,'2026-04-28 12:56:22'),(28,9,4,5,11,2,'2026-04-28 12:56:22'),(29,9,5,7,11,2,'2026-04-28 12:56:22'),(30,10,1,6,11,35,'2026-04-28 12:57:17'),(31,10,2,7,11,35,'2026-04-28 12:57:17'),(32,10,3,11,9,21,'2026-04-28 12:57:17'),(33,10,4,11,7,21,'2026-04-28 12:57:17'),(34,10,5,11,6,21,'2026-04-28 12:57:17'),(35,11,1,12,10,41,'2026-04-28 12:58:59'),(36,11,2,11,13,33,'2026-04-28 12:58:59'),(37,11,3,3,11,33,'2026-04-28 12:58:59'),(38,11,4,11,9,41,'2026-04-28 12:58:59'),(39,11,5,12,10,41,'2026-04-28 12:58:59'),(40,12,1,7,11,35,'2026-04-28 12:59:25'),(41,12,2,8,11,35,'2026-04-28 12:59:25'),(42,12,3,9,11,35,'2026-04-28 12:59:25'),(43,13,1,11,9,2,'2026-04-28 12:59:40'),(44,13,2,11,8,2,'2026-04-28 12:59:40'),(45,13,3,11,3,2,'2026-04-28 12:59:40'),(46,14,1,11,9,2,'2026-04-28 13:00:10'),(47,14,2,11,6,2,'2026-04-28 13:00:10'),(48,14,3,13,11,2,'2026-04-28 13:00:10'),(49,15,1,2,11,35,'2026-04-28 13:00:54'),(50,15,2,6,11,35,'2026-04-28 13:00:54'),(51,15,3,9,11,35,'2026-04-28 13:00:54'),(52,16,1,11,1,32,'2026-04-28 13:03:07'),(53,16,2,11,4,32,'2026-04-28 13:03:07'),(54,16,3,11,2,32,'2026-04-28 13:03:07'),(55,17,1,11,2,43,'2026-04-28 13:03:54'),(56,17,2,11,4,43,'2026-04-28 13:03:54'),(57,17,3,11,5,43,'2026-04-28 13:03:54'),(58,18,1,3,11,28,'2026-04-28 13:04:30'),(59,18,2,3,11,28,'2026-04-28 13:04:30'),(60,18,3,4,11,28,'2026-04-28 13:04:30'),(61,19,1,8,11,43,'2026-04-28 13:05:49'),(62,19,2,13,11,32,'2026-04-28 13:05:49'),(63,19,3,11,8,32,'2026-04-28 13:05:49'),(64,19,4,11,7,32,'2026-04-28 13:05:49'),(65,20,1,11,1,32,'2026-04-28 13:06:12'),(66,20,2,11,0,32,'2026-04-28 13:06:12'),(67,20,3,11,3,32,'2026-04-28 13:06:12'),(68,21,1,12,10,32,'2026-04-28 13:07:15'),(69,21,2,11,8,32,'2026-04-28 13:07:15'),(70,21,3,6,11,28,'2026-04-28 13:07:15'),(71,21,4,11,9,32,'2026-04-28 13:07:15'),(72,22,1,11,2,32,'2026-04-28 13:08:40'),(73,22,2,11,2,32,'2026-04-28 13:08:40'),(74,22,3,12,10,32,'2026-04-28 13:08:40'),(75,23,1,11,1,43,'2026-04-28 13:09:09'),(76,23,2,11,3,43,'2026-04-28 13:09:09'),(77,23,3,11,3,43,'2026-04-28 13:09:09'),(78,24,1,11,9,43,'2026-04-28 13:09:45'),(79,24,2,12,14,28,'2026-04-28 13:09:45'),(80,24,3,9,11,28,'2026-04-28 13:09:45'),(81,24,4,11,5,43,'2026-04-28 13:09:45'),(82,24,5,11,4,43,'2026-04-28 13:09:45'),(83,25,1,11,0,43,'2026-04-28 13:10:00'),(84,25,2,11,1,43,'2026-04-28 13:10:00'),(85,25,3,11,1,43,'2026-04-28 13:10:00'),(86,26,1,0,11,29,'2026-04-28 13:11:28'),(87,26,2,0,11,29,'2026-04-28 13:11:28'),(88,26,3,0,11,29,'2026-04-28 13:11:28'),(89,27,1,11,5,17,'2026-04-28 13:11:42'),(90,27,2,11,3,17,'2026-04-28 13:11:42'),(91,27,3,11,3,17,'2026-04-28 13:11:42'),(92,28,1,11,7,28,'2026-04-28 13:12:00'),(93,28,2,11,2,28,'2026-04-28 13:12:00'),(94,28,3,11,8,28,'2026-04-28 13:12:00'),(95,29,1,11,3,28,'2026-04-28 13:12:24'),(96,29,2,11,6,28,'2026-04-28 13:12:24'),(97,29,3,11,2,28,'2026-04-28 13:12:24'),(98,30,1,11,2,29,'2026-04-28 13:12:43'),(99,30,2,11,2,29,'2026-04-28 13:12:43'),(100,30,3,11,2,29,'2026-04-28 13:12:43'),(101,31,1,12,10,12,'2026-04-28 13:14:04'),(102,31,2,11,1,12,'2026-04-28 13:14:04'),(103,31,3,11,5,12,'2026-04-28 13:14:04'),(104,32,1,11,0,31,'2026-04-28 13:14:25'),(105,32,2,11,0,31,'2026-04-28 13:14:25'),(106,32,3,11,0,31,'2026-04-28 13:14:25'),(107,33,1,11,2,40,'2026-04-28 13:14:40'),(108,33,2,11,4,40,'2026-04-28 13:14:40'),(109,33,3,11,3,40,'2026-04-28 13:14:40'),(110,34,1,5,11,31,'2026-04-28 13:15:09'),(111,34,2,11,4,12,'2026-04-28 13:15:09'),(112,34,3,11,13,31,'2026-04-28 13:15:09'),(113,34,4,13,11,12,'2026-04-28 13:15:09'),(114,34,5,11,6,12,'2026-04-28 13:15:09'),(115,35,1,11,5,12,'2026-04-28 13:15:39'),(116,35,2,11,4,12,'2026-04-28 13:15:39'),(117,35,3,11,7,12,'2026-04-28 13:15:39'),(118,36,1,11,5,12,'2026-04-28 13:15:54'),(119,36,2,11,4,12,'2026-04-28 13:15:54'),(120,36,3,11,3,12,'2026-04-28 13:15:54'),(121,37,1,11,4,12,'2026-04-28 13:16:14'),(122,37,2,11,1,12,'2026-04-28 13:16:14'),(123,37,3,11,6,12,'2026-04-28 13:16:14'),(124,38,1,11,4,31,'2026-04-28 13:16:35'),(125,38,2,11,4,31,'2026-04-28 13:16:35'),(126,38,3,11,7,31,'2026-04-28 13:16:35'),(127,39,1,11,7,31,'2026-04-28 13:16:53'),(128,39,2,11,3,31,'2026-04-28 13:16:53'),(129,39,3,11,6,31,'2026-04-28 13:16:53'),(130,40,1,11,9,31,'2026-04-28 13:17:08'),(131,40,2,11,3,31,'2026-04-28 13:17:08'),(132,40,3,11,3,31,'2026-04-28 13:17:08'),(133,41,1,16,14,40,'2026-04-28 13:17:41'),(134,41,2,9,11,26,'2026-04-28 13:17:41'),(135,41,3,11,3,40,'2026-04-28 13:17:41'),(136,41,4,11,9,40,'2026-04-28 13:17:41'),(137,42,1,11,3,40,'2026-04-28 13:18:12'),(138,42,2,11,6,40,'2026-04-28 13:18:12'),(139,42,3,15,13,40,'2026-04-28 13:18:12'),(140,43,1,5,11,26,'2026-04-28 13:18:37'),(141,43,2,2,11,26,'2026-04-28 13:18:37'),(142,43,3,3,11,26,'2026-04-28 13:18:37'),(143,44,1,4,11,20,'2026-04-28 13:18:57'),(144,44,2,3,11,20,'2026-04-28 13:18:57'),(145,44,3,4,11,20,'2026-04-28 13:18:57'),(146,45,1,13,11,26,'2026-04-28 13:19:21'),(147,45,2,10,12,20,'2026-04-28 13:19:21'),(148,45,3,11,8,26,'2026-04-28 13:19:21'),(149,45,4,11,6,26,'2026-04-28 13:19:21'),(150,46,1,11,2,24,'2026-04-28 13:49:00'),(151,46,2,11,2,24,'2026-04-28 13:49:00'),(152,46,3,11,6,24,'2026-04-28 13:49:00'),(153,47,1,11,3,25,'2026-04-28 13:49:45'),(154,47,2,11,1,25,'2026-04-28 13:49:45'),(155,47,3,11,5,25,'2026-04-28 13:49:45'),(156,48,1,11,8,49,'2026-04-28 13:50:25'),(157,48,2,8,11,22,'2026-04-28 13:50:25'),(158,48,3,8,11,22,'2026-04-28 13:50:25'),(159,48,4,12,10,49,'2026-04-28 13:50:25'),(160,48,5,8,11,22,'2026-04-28 13:50:25'),(161,49,1,11,9,24,'2026-04-28 13:51:06'),(162,49,2,8,11,25,'2026-04-28 13:51:07'),(163,49,3,11,6,24,'2026-04-28 13:51:10'),(164,49,4,11,8,24,'2026-04-28 13:51:13'),(165,50,1,11,5,24,'2026-04-28 13:53:40'),(166,50,2,9,11,49,'2026-04-28 13:53:40'),(167,50,3,11,8,24,'2026-04-28 13:53:40'),(168,50,4,11,8,24,'2026-04-28 13:53:40'),(169,51,1,11,1,24,'2026-04-28 13:53:52'),(170,51,2,11,3,24,'2026-04-28 13:53:52'),(171,51,3,11,4,24,'2026-04-28 13:53:52'),(172,52,1,11,2,24,'2026-04-28 13:54:14'),(173,52,2,11,6,24,'2026-04-28 13:54:14'),(174,52,3,11,4,24,'2026-04-28 13:54:14'),(175,53,1,11,3,25,'2026-04-28 13:54:54'),(176,53,2,11,6,25,'2026-04-28 13:54:54'),(177,53,3,11,3,25,'2026-04-28 13:54:54'),(178,54,1,11,4,25,'2026-04-28 13:55:13'),(179,54,2,11,4,25,'2026-04-28 13:55:13'),(180,54,3,11,2,25,'2026-04-28 13:55:13'),(181,55,1,11,5,25,'2026-04-28 13:55:33'),(182,55,2,11,5,25,'2026-04-28 13:55:34'),(183,55,3,11,2,25,'2026-04-28 13:55:34'),(184,56,1,12,10,49,'2026-04-28 13:56:10'),(185,56,2,11,7,49,'2026-04-28 13:56:10'),(186,56,3,11,6,49,'2026-04-28 13:56:11'),(187,57,1,11,2,49,'2026-04-28 13:58:40'),(188,57,2,4,11,9,'2026-04-28 13:58:41'),(189,57,3,11,4,49,'2026-04-28 13:58:41'),(190,57,4,6,11,9,'2026-04-28 13:58:41'),(191,57,5,12,10,49,'2026-04-28 13:58:41'),(192,58,1,11,7,22,'2026-04-28 13:59:14'),(193,58,2,11,2,22,'2026-04-28 13:59:15'),(194,58,3,11,5,22,'2026-04-28 13:59:15'),(195,59,1,11,2,22,'2026-04-28 13:59:49'),(196,59,2,11,2,22,'2026-04-28 13:59:49'),(197,59,3,11,3,22,'2026-04-28 13:59:50'),(198,60,1,7,11,9,'2026-04-28 14:00:36'),(199,60,2,11,7,48,'2026-04-28 14:00:36'),(200,60,3,8,11,9,'2026-04-28 14:00:36'),(201,60,4,11,7,48,'2026-04-28 14:00:36'),(202,60,5,11,13,9,'2026-04-28 14:00:36'),(203,61,1,11,5,14,'2026-04-28 14:01:02'),(204,61,2,11,1,14,'2026-04-28 14:01:02'),(205,61,3,11,2,14,'2026-04-28 14:01:02'),(206,62,1,11,4,45,'2026-04-28 14:01:17'),(207,62,2,11,3,45,'2026-04-28 14:01:17'),(208,62,3,11,3,45,'2026-04-28 14:01:17'),(209,63,1,5,11,23,'2026-04-28 14:01:32'),(210,63,2,8,11,23,'2026-04-28 14:01:33'),(211,63,3,7,11,23,'2026-04-28 14:01:33'),(212,64,1,11,2,14,'2026-04-28 14:02:03'),(213,64,2,11,2,14,'2026-04-28 14:02:03'),(214,64,3,11,3,14,'2026-04-28 14:02:03'),(215,65,1,11,2,14,'2026-04-28 14:02:23'),(216,65,2,11,9,14,'2026-04-28 14:02:23'),(217,65,3,11,5,14,'2026-04-28 14:02:23'),(218,66,1,19,21,23,'2026-04-28 14:02:47'),(219,66,2,11,3,14,'2026-04-28 14:02:47'),(220,66,3,11,6,14,'2026-04-28 14:02:47'),(221,66,4,11,9,14,'2026-04-28 14:02:47'),(222,67,1,11,4,14,'2026-04-28 14:03:07'),(223,67,2,11,3,14,'2026-04-28 14:03:07'),(224,67,3,11,2,14,'2026-04-28 14:03:07'),(225,68,1,6,11,27,'2026-04-28 14:03:26'),(226,68,2,4,11,27,'2026-04-28 14:03:26'),(227,68,3,3,11,27,'2026-04-28 14:03:26'),(228,69,1,2,11,23,'2026-04-28 14:03:55'),(229,69,2,8,11,23,'2026-04-28 14:03:55'),(230,69,3,3,11,23,'2026-04-28 14:03:55'),(231,70,1,5,11,8,'2026-04-28 14:04:17'),(232,70,2,5,11,8,'2026-04-28 14:04:19'),(233,70,3,8,11,8,'2026-04-28 14:04:19'),(234,71,1,11,1,27,'2026-04-28 14:04:40'),(235,71,2,11,3,27,'2026-04-28 14:04:40'),(236,71,3,11,1,27,'2026-04-28 14:04:40'),(237,72,1,8,11,8,'2026-04-28 14:05:05'),(238,72,2,11,7,27,'2026-04-28 14:05:06'),(239,72,3,11,8,27,'2026-04-28 14:05:06'),(240,72,4,11,8,27,'2026-04-28 14:05:07'),(241,73,1,11,3,23,'2026-04-28 14:05:29'),(242,73,2,11,3,23,'2026-04-28 14:05:30'),(243,73,3,11,1,23,'2026-04-28 14:05:30'),(244,74,1,11,6,23,'2026-04-28 14:05:50'),(245,74,2,11,7,23,'2026-04-28 14:05:50'),(246,74,3,11,8,23,'2026-04-28 14:05:50'),(250,75,1,2,11,8,'2026-04-28 14:19:41'),(251,75,2,6,11,8,'2026-04-28 14:19:41'),(252,75,3,3,11,8,'2026-04-28 14:19:41'),(253,76,1,11,5,46,'2026-04-28 14:20:47'),(254,76,2,11,4,46,'2026-04-28 14:20:48'),(255,76,3,11,3,46,'2026-04-28 14:20:48'),(256,77,1,11,2,47,'2026-04-28 14:21:04'),(257,77,2,11,2,47,'2026-04-28 14:21:04'),(258,77,3,11,1,47,'2026-04-28 14:21:05'),(259,78,1,11,1,11,'2026-04-28 14:21:18'),(260,78,2,11,2,11,'2026-04-28 14:21:20'),(261,78,3,11,4,11,'2026-04-28 14:21:23'),(262,79,1,11,7,46,'2026-04-28 14:22:00'),(263,79,2,8,11,47,'2026-04-28 14:22:00'),(264,79,3,19,17,46,'2026-04-28 14:22:00'),(265,79,4,11,7,46,'2026-04-28 14:22:00'),(266,80,1,11,7,46,'2026-04-28 14:22:16'),(267,80,2,11,4,46,'2026-04-28 14:22:16'),(268,80,3,11,9,46,'2026-04-28 14:22:16'),(269,81,1,11,2,46,'2026-04-28 14:22:31'),(270,81,2,11,2,46,'2026-04-28 14:22:31'),(271,81,3,11,0,46,'2026-04-28 14:22:31'),(272,82,1,11,5,46,'2026-04-28 14:22:58'),(273,82,2,11,1,46,'2026-04-28 14:22:58'),(274,82,3,11,2,46,'2026-04-28 14:22:58'),(275,83,1,5,11,11,'2026-04-28 14:23:50'),(276,83,2,12,10,47,'2026-04-28 14:23:51'),(277,83,3,11,6,47,'2026-04-28 14:23:51'),(278,83,4,11,5,47,'2026-04-28 14:23:51'),(279,84,1,11,3,47,'2026-04-28 14:24:56'),(280,84,2,11,3,47,'2026-04-28 14:24:56'),(281,84,3,11,1,47,'2026-04-28 14:24:57'),(282,85,1,17,15,47,'2026-04-28 14:25:44'),(283,85,2,11,4,47,'2026-04-28 14:25:44'),(284,85,3,11,4,47,'2026-04-28 14:25:44'),(285,86,1,11,5,11,'2026-04-28 14:26:06'),(286,86,2,11,4,11,'2026-04-28 14:26:06'),(287,86,3,11,4,11,'2026-04-28 14:26:06'),(288,87,1,11,6,11,'2026-04-28 14:26:36'),(289,87,2,11,3,11,'2026-04-28 14:26:36'),(290,87,3,11,3,11,'2026-04-28 14:26:36'),(291,88,1,7,11,38,'2026-04-28 14:28:26'),(292,88,2,8,11,38,'2026-04-28 14:28:26'),(293,88,3,4,11,38,'2026-04-28 14:28:26'),(294,89,1,5,11,44,'2026-04-28 14:28:42'),(295,89,2,6,11,44,'2026-04-28 14:28:42'),(296,89,3,4,11,44,'2026-04-28 14:28:42'),(297,90,1,7,11,44,'2026-04-28 14:36:11'),(298,90,2,8,11,44,'2026-04-28 14:36:12'),(299,90,3,7,11,44,'2026-04-28 14:36:12'),(300,91,1,11,2,37,'2026-04-28 14:36:50'),(301,91,2,11,3,37,'2026-04-28 14:37:02'),(302,91,3,11,2,37,'2026-04-28 14:37:06'),(303,92,1,11,1,42,'2026-04-28 14:37:30'),(304,92,2,11,3,42,'2026-04-28 14:37:30'),(305,92,3,11,2,42,'2026-04-28 14:37:30'),(306,93,1,10,12,50,'2026-04-28 14:38:42'),(307,93,2,11,7,39,'2026-04-28 14:38:42'),(308,93,3,14,16,50,'2026-04-28 14:38:42'),(309,93,4,11,9,39,'2026-04-28 14:38:42'),(310,93,5,11,6,39,'2026-04-28 14:38:42'),(311,94,1,11,9,37,'2026-04-28 14:39:06'),(312,94,2,8,11,42,'2026-04-28 14:39:06'),(313,94,3,13,11,37,'2026-04-28 14:39:06'),(314,94,4,11,3,37,'2026-04-28 14:39:06'),(315,95,1,11,3,37,'2026-04-28 14:39:54'),(316,95,2,11,6,37,'2026-04-28 14:39:55'),(317,95,3,11,7,37,'2026-04-28 14:39:56'),(318,96,1,11,7,37,'2026-04-28 14:40:26'),(319,96,2,11,8,37,'2026-04-28 14:40:26'),(320,96,3,11,6,37,'2026-04-28 14:40:26'),(321,97,1,11,1,37,'2026-04-28 14:40:38'),(322,97,2,11,2,37,'2026-04-28 14:40:38'),(323,97,3,11,7,37,'2026-04-28 14:40:38'),(324,98,1,11,8,42,'2026-04-28 14:41:13'),(325,98,2,11,4,42,'2026-04-28 14:41:13'),(326,98,3,11,8,42,'2026-04-28 14:41:13'),(327,99,1,11,5,42,'2026-04-28 14:41:43'),(328,99,2,11,6,42,'2026-04-28 14:41:44'),(329,99,3,11,8,42,'2026-04-28 14:41:44'),(330,100,1,11,4,42,'2026-04-28 14:43:04'),(331,100,2,11,3,42,'2026-04-28 14:43:04'),(332,100,3,11,2,42,'2026-04-28 14:43:04'),(333,101,1,11,6,39,'2026-04-28 14:44:08'),(334,101,2,11,4,39,'2026-04-28 14:44:08'),(335,101,3,11,8,39,'2026-04-28 14:44:08'),(336,102,1,11,3,39,'2026-04-28 14:44:34'),(337,102,2,11,5,39,'2026-04-28 14:44:34'),(338,102,3,7,11,5,'2026-04-28 14:44:34'),(339,102,4,11,9,39,'2026-04-28 14:44:34'),(340,103,1,11,7,50,'2026-04-28 14:44:55'),(341,103,2,11,8,50,'2026-04-28 14:44:55'),(342,103,3,11,5,50,'2026-04-28 14:44:55'),(343,104,1,11,6,50,'2026-04-28 14:45:14'),(344,104,2,15,13,50,'2026-04-28 14:45:14'),(345,104,3,11,9,50,'2026-04-28 14:45:14'),(346,105,1,6,11,5,'2026-04-28 14:45:33'),(347,105,2,6,11,5,'2026-04-28 14:45:33'),(348,105,3,5,11,5,'2026-04-28 14:45:33'),(349,106,1,11,0,7,'2026-04-28 14:46:18'),(350,106,2,11,0,7,'2026-04-28 14:46:18'),(351,106,3,11,0,7,'2026-04-28 14:46:18'),(352,107,1,4,11,3,'2026-04-28 14:46:38'),(353,107,2,9,11,3,'2026-04-28 14:46:38'),(354,107,3,8,11,3,'2026-04-28 14:46:38'),(355,108,1,9,11,10,'2026-04-28 14:46:57'),(356,108,2,6,11,10,'2026-04-28 14:46:57'),(357,108,3,5,11,10,'2026-04-28 14:46:57'),(358,109,1,11,4,7,'2026-04-28 14:47:22'),(359,109,2,11,7,7,'2026-04-28 14:47:22'),(360,109,3,11,5,7,'2026-04-28 14:47:22'),(361,110,1,11,5,7,'2026-04-28 14:47:36'),(362,110,2,11,4,7,'2026-04-28 14:47:36'),(363,110,3,11,4,7,'2026-04-28 14:47:36'),(364,111,1,11,7,7,'2026-04-28 14:47:58'),(365,111,2,11,3,7,'2026-04-28 14:47:58'),(366,111,3,11,9,7,'2026-04-28 14:47:58'),(367,112,1,11,9,7,'2026-04-28 14:48:13'),(368,112,2,11,7,7,'2026-04-28 14:48:13'),(369,112,3,11,3,7,'2026-04-28 14:48:13'),(370,113,1,11,8,4,'2026-04-28 14:48:31'),(371,113,2,11,7,4,'2026-04-28 14:48:31'),(372,113,3,11,3,4,'2026-04-28 14:48:31'),(373,114,1,11,7,4,'2026-04-28 14:49:01'),(374,114,2,11,9,4,'2026-04-28 14:49:01'),(375,114,3,9,11,10,'2026-04-28 14:49:01'),(376,114,4,11,6,4,'2026-04-28 14:49:01'),(377,115,1,7,11,13,'2026-04-28 14:49:41'),(378,115,2,3,11,13,'2026-04-28 14:49:41'),(379,115,3,6,11,13,'2026-04-28 14:49:41'),(380,116,1,0,11,3,'2026-04-28 14:50:05'),(381,116,2,6,11,3,'2026-04-28 14:50:05'),(382,116,3,7,11,3,'2026-04-28 14:50:05'),(383,117,1,2,11,13,'2026-04-28 14:50:19'),(384,117,2,4,11,13,'2026-04-28 14:50:19'),(385,117,3,4,11,13,'2026-04-28 14:50:19'),(386,118,1,8,11,3,'2026-04-28 14:50:50'),(387,118,2,11,5,10,'2026-04-28 14:50:50'),(388,118,3,4,11,3,'2026-04-28 14:50:50'),(389,118,4,2,11,3,'2026-04-28 14:50:50'),(390,119,1,6,11,13,'2026-04-28 14:51:08'),(391,119,2,9,11,13,'2026-04-28 14:51:08'),(392,119,3,2,11,13,'2026-04-28 14:51:08'),(393,120,1,11,7,3,'2026-04-28 14:51:29'),(394,120,2,5,11,13,'2026-04-28 14:51:29'),(395,120,3,11,3,3,'2026-04-28 14:51:29'),(396,120,4,11,8,3,'2026-04-28 14:51:29'),(397,121,1,11,0,7,'2026-04-28 15:22:54'),(398,121,2,11,0,7,'2026-04-28 15:22:54'),(399,121,3,11,0,7,'2026-04-28 15:22:54'),(400,122,1,11,0,42,'2026-04-28 15:23:01'),(401,122,2,11,0,42,'2026-04-28 15:23:01'),(402,122,3,11,0,42,'2026-04-28 15:23:01'),(403,123,1,11,0,46,'2026-04-28 15:23:06'),(404,123,2,11,0,46,'2026-04-28 15:23:06'),(405,123,3,11,0,46,'2026-04-28 15:23:06'),(406,124,1,0,11,19,'2026-04-28 15:23:13'),(407,124,2,0,11,19,'2026-04-28 15:23:13'),(408,124,3,0,11,19,'2026-04-28 15:23:13'),(409,125,1,11,0,12,'2026-04-28 15:23:19'),(410,125,2,11,0,12,'2026-04-28 15:23:19'),(411,125,3,11,0,12,'2026-04-28 15:23:19'),(412,126,1,11,0,47,'2026-04-28 15:23:25'),(413,126,2,11,0,47,'2026-04-28 15:23:25'),(414,126,3,11,0,47,'2026-04-28 15:23:25'),(415,127,1,11,0,37,'2026-04-28 15:23:29'),(416,127,2,11,0,37,'2026-04-28 15:23:29'),(417,127,3,11,0,37,'2026-04-28 15:23:29'),(418,128,1,11,0,43,'2026-04-28 15:23:35'),(419,128,2,11,0,43,'2026-04-28 15:23:35'),(420,128,3,11,0,43,'2026-04-28 15:23:35'),(421,129,1,11,0,13,'2026-04-28 15:24:04'),(422,129,2,11,0,13,'2026-04-28 15:24:04'),(423,129,3,11,0,13,'2026-04-28 15:24:04'),(424,130,1,11,0,50,'2026-04-28 15:24:10'),(425,130,2,11,0,50,'2026-04-28 15:24:10'),(426,130,3,11,0,50,'2026-04-28 15:24:10'),(427,131,1,11,0,11,'2026-04-28 15:24:16'),(428,131,2,11,0,11,'2026-04-28 15:24:16'),(429,131,3,11,0,11,'2026-04-28 15:24:16'),(430,132,1,0,11,21,'2026-04-28 15:24:21'),(431,132,2,0,11,21,'2026-04-28 15:24:21'),(432,132,3,0,11,21,'2026-04-28 15:24:21'),(433,133,1,11,0,40,'2026-04-28 15:24:30'),(434,133,2,11,0,40,'2026-04-28 15:24:30'),(435,133,3,11,0,40,'2026-04-28 15:24:30'),(436,134,1,11,0,44,'2026-04-28 15:24:34'),(437,134,2,11,0,44,'2026-04-28 15:24:34'),(438,134,3,11,0,44,'2026-04-28 15:24:34'),(439,135,1,0,11,35,'2026-04-28 15:24:45'),(440,135,2,0,11,35,'2026-04-28 15:24:45'),(441,135,3,0,11,35,'2026-04-28 15:24:45'),(442,136,1,11,0,10,'2026-04-28 15:24:58'),(443,136,2,11,0,10,'2026-04-28 15:24:58'),(444,136,3,11,0,10,'2026-04-28 15:24:58'),(445,137,1,11,0,38,'2026-04-28 15:25:07'),(446,137,2,11,0,38,'2026-04-28 15:25:07'),(447,137,3,11,0,38,'2026-04-28 15:25:07'),(448,138,1,0,11,45,'2026-04-28 15:25:13'),(449,138,2,0,11,45,'2026-04-28 15:25:13'),(450,138,3,0,11,45,'2026-04-28 15:25:13'),(451,139,1,0,11,9,'2026-04-28 15:25:25'),(452,139,2,0,11,9,'2026-04-28 15:25:25'),(453,139,3,0,11,9,'2026-04-28 15:25:25'),(454,140,1,11,0,18,'2026-04-28 15:25:36'),(455,140,2,11,0,18,'2026-04-28 15:25:36'),(456,140,3,11,0,18,'2026-04-28 15:25:36'),(457,141,1,0,11,33,'2026-04-28 15:25:42'),(458,141,2,0,11,33,'2026-04-28 15:25:42'),(459,141,3,0,11,33,'2026-04-28 15:25:42'),(460,142,1,11,0,34,'2026-04-28 15:25:48'),(461,142,2,11,0,34,'2026-04-28 15:25:48'),(462,142,3,11,0,34,'2026-04-28 15:25:48'),(463,143,1,0,11,48,'2026-04-28 15:25:59'),(464,143,2,0,11,48,'2026-04-28 15:25:59'),(465,143,3,0,11,48,'2026-04-28 15:25:59'),(466,145,1,11,0,7,'2026-04-28 15:32:41'),(467,145,2,11,0,7,'2026-04-28 15:32:41'),(468,145,3,11,0,7,'2026-04-28 15:32:41'),(469,146,1,0,11,19,'2026-04-28 15:32:47'),(470,146,2,0,11,19,'2026-04-28 15:32:47'),(471,146,3,0,11,19,'2026-04-28 15:32:47'),(472,147,1,11,0,12,'2026-04-28 15:32:52'),(473,147,2,11,0,12,'2026-04-28 15:32:52'),(474,147,3,11,0,12,'2026-04-28 15:32:52'),(475,148,1,11,0,37,'2026-04-28 15:32:56'),(476,148,2,11,0,37,'2026-04-28 15:32:56'),(477,148,3,11,0,37,'2026-04-28 15:32:56'),(478,149,1,0,11,50,'2026-04-28 15:33:07'),(479,149,2,0,11,50,'2026-04-28 15:33:08'),(480,149,3,0,11,50,'2026-04-28 15:33:13'),(481,150,1,11,0,11,'2026-04-28 15:33:18'),(482,150,2,11,0,11,'2026-04-28 15:33:18'),(483,150,3,11,0,11,'2026-04-28 15:33:18'),(484,151,1,11,0,40,'2026-04-28 15:33:23'),(485,151,2,11,0,40,'2026-04-28 15:33:23'),(486,151,3,11,0,40,'2026-04-28 15:33:23'),(487,152,1,0,11,22,'2026-04-28 15:33:30'),(488,152,2,0,11,22,'2026-04-28 15:33:30'),(489,152,3,0,11,22,'2026-04-28 15:33:30'),(490,153,1,11,0,10,'2026-04-28 15:33:42'),(491,153,2,11,0,10,'2026-04-28 15:33:42'),(492,153,3,11,0,10,'2026-04-28 15:33:42'),(493,154,1,0,11,9,'2026-04-28 15:33:48'),(494,154,2,0,11,9,'2026-04-28 15:33:48'),(495,154,3,0,11,9,'2026-04-28 15:33:49'),(496,155,1,0,11,33,'2026-04-28 15:33:55'),(497,155,2,0,11,33,'2026-04-28 15:33:55'),(498,155,3,0,11,33,'2026-04-28 15:33:56'),(499,156,1,0,11,48,'2026-04-28 15:34:01'),(500,156,2,0,11,48,'2026-04-28 15:34:02'),(501,156,3,0,11,48,'2026-04-28 15:34:02'),(502,157,1,0,11,19,'2026-04-28 19:09:45'),(503,157,2,0,11,19,'2026-04-28 19:09:45'),(504,157,3,0,11,19,'2026-04-28 19:09:45'),(505,158,1,0,11,37,'2026-04-28 19:10:00'),(506,158,2,0,11,37,'2026-04-28 19:10:01'),(507,158,3,0,11,37,'2026-04-28 19:10:01'),(508,159,1,0,11,11,'2026-04-28 19:10:10'),(509,159,2,0,11,11,'2026-04-28 19:10:10'),(510,159,3,0,11,11,'2026-04-28 19:10:10'),(511,160,1,11,0,40,'2026-04-28 19:10:18'),(512,160,2,11,0,40,'2026-04-28 19:10:18'),(513,160,3,11,0,40,'2026-04-28 19:10:18'),(514,161,1,0,11,9,'2026-04-28 19:10:23'),(515,161,2,0,11,9,'2026-04-28 19:10:23'),(516,161,3,0,11,9,'2026-04-28 19:10:23'),(517,162,1,11,0,33,'2026-04-28 19:10:42'),(518,162,2,11,0,33,'2026-04-28 19:10:42'),(519,162,3,11,0,33,'2026-04-28 19:10:42'),(520,163,1,11,0,19,'2026-04-28 19:11:33'),(521,163,2,11,0,19,'2026-04-28 19:11:33'),(522,163,3,11,0,19,'2026-04-28 19:11:33'),(523,164,1,11,0,11,'2026-04-28 19:11:39'),(524,164,2,11,0,11,'2026-04-28 19:11:39'),(525,164,3,11,0,11,'2026-04-28 19:11:39');
/*!40000 ALTER TABLE `sets_jogo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sping_open_config`
--

DROP TABLE IF EXISTS `sping_open_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sping_open_config` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `atletas_por_grupo` int unsigned NOT NULL DEFAULT '5',
  `posicoes_nivel_a` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1,2',
  `posicoes_nivel_b` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '3',
  `posicoes_nivel_c` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '4',
  `posicoes_nivel_d` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '5',
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `padrao` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sping_config_padrao` (`padrao`),
  KEY `idx_sping_config_ativo` (`ativo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sping_open_config`
--

LOCK TABLES `sping_open_config` WRITE;
/*!40000 ALTER TABLE `sping_open_config` DISABLE KEYS */;
INSERT INTO `sping_open_config` VALUES (1,'Configuração Padrão','Grupos de 5 atletas com distribuição A(1-2), B(3), C(4), D(5)',5,'1,2','3','4','5',0,1,'2026-04-26 14:13:09','2026-04-26 14:46:57'),(2,'Grupos de 6',NULL,6,'1,2','3,4','5','6',1,0,'2026-04-26 14:31:55','2026-04-26 14:46:57');
/*!40000 ALTER TABLE `sping_open_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `papel` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ADMIN',
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuarios_email` (`email`),
  CONSTRAINT `chk_usuarios_papel` CHECK ((`papel` = _utf8mb4'ADMIN'))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'test','test@test.com','$2a$10$WIUlV9bQWDVrld6DVkjZseOe3GUdhuGHeRwB5x2FQMKu6PEQi9Zhq','ADMIN',1,'2026-04-26 14:26:40','2026-04-26 14:26:40');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_ranking_atual`
--

DROP TABLE IF EXISTS `vw_ranking_atual`;
/*!50001 DROP VIEW IF EXISTS `vw_ranking_atual`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_ranking_atual` AS SELECT 
 1 AS `id`,
 1 AS `nome`,
 1 AS `ranking_posicao`,
 1 AS `rating_atual`,
 1 AS `partidas_jogadas`,
 1 AS `vitorias`,
 1 AS `derrotas`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'spingpong'
--

--
-- Dumping routines for database 'spingpong'
--
/*!50003 DROP FUNCTION IF EXISTS `fn_faixa_rating` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_faixa_rating`(p_rating DECIMAL(10,2)) RETURNS char(1) CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci
    DETERMINISTIC
BEGIN
  DECLARE v_faixa CHAR(1);

  IF p_rating >= 3300 THEN SET v_faixa = 'A';
  ELSEIF p_rating >= 2800 THEN SET v_faixa = 'B';
  ELSEIF p_rating >= 2300 THEN SET v_faixa = 'C';
  ELSEIF p_rating >= 1900 THEN SET v_faixa = 'D';
  ELSEIF p_rating >= 1600 THEN SET v_faixa = 'E';
  ELSEIF p_rating >= 1300 THEN SET v_faixa = 'F';
  ELSEIF p_rating >= 1000 THEN SET v_faixa = 'G';
  ELSEIF p_rating >= 850 THEN SET v_faixa = 'H';
  ELSEIF p_rating >= 700 THEN SET v_faixa = 'I';
  ELSEIF p_rating >= 550 THEN SET v_faixa = 'J';
  ELSEIF p_rating >= 400 THEN SET v_faixa = 'L';
  ELSEIF p_rating >= 350 THEN SET v_faixa = 'M';
  ELSEIF p_rating >= 251 THEN SET v_faixa = 'N';
ELSE SET v_faixa = 'O';
END IF;

RETURN v_faixa;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_pontos_partida` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_pontos_partida`(
    IN  p_diff INT,
    IN  p_expected_win TINYINT,
    OUT p_v_points INT,
    OUT p_l_points INT
)
BEGIN
  SET p_v_points = 0;
  SET p_l_points = 0;

  IF p_expected_win = 1 THEN
    -- Vitórias esperadas
    IF p_diff >= 750 THEN
      SET p_v_points = 1;  SET p_l_points = 0;
    ELSEIF p_diff >= 500 THEN
      SET p_v_points = 2;  SET p_l_points = 0;
    ELSEIF p_diff >= 400 THEN
      SET p_v_points = 3;  SET p_l_points = 1;
    ELSEIF p_diff >= 300 THEN
      SET p_v_points = 4;  SET p_l_points = 2;
    ELSEIF p_diff >= 200 THEN
      SET p_v_points = 5;  SET p_l_points = 3;
    ELSEIF p_diff >= 150 THEN
      SET p_v_points = 6;  SET p_l_points = 4;
    ELSEIF p_diff >= 100 THEN
      SET p_v_points = 7;  SET p_l_points = 5;
    ELSEIF p_diff >= 50 THEN
      SET p_v_points = 8;  SET p_l_points = 6;
    ELSEIF p_diff >= 25 THEN
      SET p_v_points = 9;  SET p_l_points = 7;
ELSE
      SET p_v_points = 10; SET p_l_points = 8;
END IF;
ELSE
    -- Vitórias/derrotas inesperadas
    IF p_diff >= 500 THEN
      SET p_v_points = 30; SET p_l_points = 22;
    ELSEIF p_diff >= 400 THEN
      SET p_v_points = 26; SET p_l_points = 20;
    ELSEIF p_diff >= 300 THEN
      SET p_v_points = 23; SET p_l_points = 18;
    ELSEIF p_diff >= 200 THEN
      SET p_v_points = 20; SET p_l_points = 16;
    ELSEIF p_diff >= 150 THEN
      SET p_v_points = 18; SET p_l_points = 14;
    ELSEIF p_diff >= 100 THEN
      SET p_v_points = 16; SET p_l_points = 12;
    ELSEIF p_diff >= 50 THEN
      SET p_v_points = 14; SET p_l_points = 11;
    ELSEIF p_diff >= 25 THEN
      SET p_v_points = 12; SET p_l_points = 10;
ELSE
      SET p_v_points = 11; SET p_l_points = 9;
END IF;
END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_obter_vencedor_jogo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obter_vencedor_jogo`(
    IN p_jogo_id BIGINT UNSIGNED,
    OUT p_vencedor_id BIGINT UNSIGNED
)
BEGIN
  DECLARE v_atleta_a BIGINT UNSIGNED;
  DECLARE v_atleta_b BIGINT UNSIGNED;
  DECLARE v_sets_a INT DEFAULT 0;
  DECLARE v_sets_b INT DEFAULT 0;

SELECT j.atleta_a_id, j.atleta_b_id
INTO v_atleta_a, v_atleta_b
FROM jogos j
WHERE j.id = p_jogo_id;

SELECT
    COALESCE(SUM(CASE WHEN s.pontos_atleta_a > s.pontos_atleta_b THEN 1 ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN s.pontos_atleta_b > s.pontos_atleta_a THEN 1 ELSE 0 END), 0)
INTO v_sets_a, v_sets_b
FROM sets_jogo s
WHERE s.jogo_id = p_jogo_id;

IF v_sets_a > v_sets_b THEN
    SET p_vencedor_id = v_atleta_a;
  ELSEIF v_sets_b > v_sets_a THEN
    SET p_vencedor_id = v_atleta_b;
ELSE
    SET p_vencedor_id = NULL;
END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `vw_ranking_atual`
--

/*!50001 DROP VIEW IF EXISTS `vw_ranking_atual`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_ranking_atual` AS select `a`.`id` AS `id`,`a`.`nome` AS `nome`,`a`.`ranking_posicao` AS `ranking_posicao`,`a`.`rating_atual` AS `rating_atual`,`a`.`partidas_jogadas` AS `partidas_jogadas`,`a`.`vitorias` AS `vitorias`,`a`.`derrotas` AS `derrotas` from `atletas` `a` where (`a`.`ativo` = 1) order by (case when (`a`.`ranking_posicao` is null) then 1 else 0 end),`a`.`ranking_posicao`,`a`.`rating_atual` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-28 19:33:53
