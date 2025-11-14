CREATE DATABASE IF NOT EXISTS gen_rad_user_management;
USE gen_rad_user_management;

CREATE TABLE `credithistory` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `creditsBefore` int NOT NULL,
  `creditsAfter` int NOT NULL,
  `creditsUsed` int NOT NULL,
  `action` varchar(50) NOT NULL,
  `projectId` int DEFAULT NULL,
  `description` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `projecthistory` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `projectName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectType` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prompt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `files` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `users` (
  `id` int NOT NULL,
  `googleId` varchar(255) NOT NULL,
  `displayName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `credits` int DEFAULT '5',
  `totalCredits` int DEFAULT '5',
  `creditsResetDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `creditsUsedThisMonth` int DEFAULT '0'
);

ALTER TABLE `credithistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

ALTER TABLE `projecthistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_userId` (`userId`),
  ADD KEY `idx_createdAt` (`createdAt`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `googleId` (`googleId`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `credithistory`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

ALTER TABLE `projecthistory`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `credithistory`
  ADD CONSTRAINT `credithistory_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `projecthistory`
  ADD CONSTRAINT `projecthistory_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
