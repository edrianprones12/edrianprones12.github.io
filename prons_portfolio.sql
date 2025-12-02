-- prons_portfolio.sql
-- SQL for portfolio comment system

CREATE DATABASE IF NOT EXISTS `prons_portfolio` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `prons_portfolio`;

CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 