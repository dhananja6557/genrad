-- 1. Create the database
CREATE DATABASE IF NOT EXISTS gen_rad_user_management;
USE gen_rad_user_management;

-- 2. Create the Users table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    googleId VARCHAR(255) NOT NULL UNIQUE,
    displayName VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    image VARCHAR(500),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);