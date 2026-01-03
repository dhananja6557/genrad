-- Run this in MySQL to create tables
CREATE DATABASE IF NOT EXISTS gen_rad_user_management;
USE gen_rad_user_management;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    googleId VARCHAR(255) NOT NULL UNIQUE,
    displayName VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    image VARCHAR(500),
    credits INT DEFAULT 5,
    totalCredits INT DEFAULT 5,
    creditsResetDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creditsUsedThisMonth INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ProjectHistory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    projectName VARCHAR(255) NOT NULL,
    projectType VARCHAR(50) NOT NULL,
    prompt TEXT NOT NULL,
    files LONGTEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    INDEX idx_userId (userId),
    INDEX idx_createdAt (createdAt)
);

CREATE TABLE CreditHistory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    creditsBefore INT NOT NULL,
    creditsAfter INT NOT NULL,
    creditsUsed INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    projectId INT,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    INDEX idx_userId (userId)
);