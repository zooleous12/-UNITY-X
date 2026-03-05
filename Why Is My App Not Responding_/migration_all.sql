CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementType` varchar(100) NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`icon` varchar(50),
	`progress` int NOT NULL DEFAULT 0,
	`target` int NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
;
CREATE TABLE `flashcards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`studyMaterialId` int,
	`front` text NOT NULL,
	`back` text NOT NULL,
	`easeFactor` float NOT NULL DEFAULT 2.5,
	`interval` int NOT NULL DEFAULT 0,
	`repetitions` int NOT NULL DEFAULT 0,
	`nextReviewAt` timestamp NOT NULL DEFAULT (now()),
	`lastReviewedAt` timestamp,
	`correctCount` int NOT NULL DEFAULT 0,
	`incorrectCount` int NOT NULL DEFAULT 0,
	`difficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'medium',
	`tags` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `flashcards_id` PRIMARY KEY(`id`)
);
;
CREATE TABLE `study_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`type` enum('audio','pdf','document_scan','video') NOT NULL,
	`originalFileUrl` text,
	`originalFileKey` text,
	`processedFileUrl` text,
	`processedFileKey` text,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`processingError` text,
	`duration` int,
	`pageCount` int,
	`wordCount` int,
	`language` varchar(10),
	`transcription` text,
	`summary` text,
	`keyPoints` json,
	`definitions` json,
	`timestamps` json,
	`subject` varchar(100),
	`course` varchar(200),
	`tags` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `study_materials_id` PRIMARY KEY(`id`)
);
;
CREATE TABLE `study_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sessionType` enum('review','flashcards','reading','practice') NOT NULL,
	`studyMaterialId` int,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`endedAt` timestamp,
	`durationMinutes` int,
	`itemsReviewed` int NOT NULL DEFAULT 0,
	`itemsCorrect` int NOT NULL DEFAULT 0,
	`itemsIncorrect` int NOT NULL DEFAULT 0,
	`subject` varchar(100),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `study_sessions_id` PRIMARY KEY(`id`)
);
;
CREATE TABLE `subscription_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` enum('subscribed','upgraded','downgraded','canceled','renewed') NOT NULL,
	`fromTier` enum('free','student','scholar','academic'),
	`toTier` enum('free','student','scholar','academic') NOT NULL,
	`amount` float,
	`currency` varchar(3) DEFAULT 'usd',
	`stripeEventId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscription_history_id` PRIMARY KEY(`id`)
);
;
CREATE TABLE `weakness_analyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`testImageUrl` text NOT NULL,
	`testImageKey` text NOT NULL,
	`testType` varchar(100),
	`subject` varchar(100),
	`mistakes` json,
	`weakConcepts` json,
	`predictions` json,
	`score` float,
	`totalQuestions` int,
	`correctAnswers` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `weakness_analyses_id` PRIMARY KEY(`id`)
);
;
ALTER TABLE `users` ADD `subscriptionTier` enum('free','student','scholar','academic') DEFAULT 'free' NOT NULL;;
ALTER TABLE `users` ADD `subscriptionStatus` enum('active','canceled','past_due','trialing') DEFAULT 'active';;
ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);;
ALTER TABLE `users` ADD `stripeSubscriptionId` varchar(255);;
ALTER TABLE `users` ADD `subscriptionEndsAt` timestamp;;
ALTER TABLE `users` ADD `monthlyAudioMinutes` int DEFAULT 0 NOT NULL;;
ALTER TABLE `users` ADD `monthlyPdfPages` int DEFAULT 0 NOT NULL;;
ALTER TABLE `users` ADD `usageResetAt` timestamp DEFAULT (now()) NOT NULL;ALTER TABLE `users` MODIFY COLUMN `subscriptionTier` enum('free','student','scholar','academic','founder','beta') NOT NULL DEFAULT 'free';;
ALTER TABLE `users` ADD `userTier` enum('regular','founder_core','beta_tester') DEFAULT 'regular' NOT NULL;;
ALTER TABLE `users` ADD `seatNumber` int;;
ALTER TABLE `users` ADD `seatType` enum('reserved_family','public_founder','beta_tester');;
ALTER TABLE `users` ADD `lifetimeFree` boolean DEFAULT false NOT NULL;;
ALTER TABLE `users` ADD `betaFreeYearUnlocked` boolean DEFAULT false NOT NULL;;
ALTER TABLE `users` ADD `betaFreeYearStart` timestamp;;
ALTER TABLE `users` ADD `betaFreeYearEnd` timestamp;;
ALTER TABLE `users` ADD `founderBadge` varchar(100);CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(200) NOT NULL,
	`code` varchar(50),
	`color` varchar(7) NOT NULL DEFAULT '#6366f1',
	`semester` varchar(50),
	`instructor` varchar(200),
	`description` text,
	`materialsCount` int NOT NULL DEFAULT 0,
	`flashcardsCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
;
ALTER TABLE `flashcards` ADD `courseId` int;;
ALTER TABLE `study_materials` ADD `courseId` int;CREATE TABLE `user_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`themeMode` enum('light','dark','auto') DEFAULT 'dark',
	`purpleShade` varchar(20) DEFAULT 'default',
	`accentColor` varchar(7) DEFAULT '#a855f7',
	`fontSize` enum('small','medium','large') DEFAULT 'medium',
	`sidebarPosition` enum('left','right','hidden') DEFAULT 'left',
	`cardLayout` enum('compact','comfortable','spacious') DEFAULT 'comfortable',
	`dashboardLayout` varchar(50) DEFAULT 'default',
	`experimentalFeatures` json DEFAULT ('{}'),
	`submittedSuggestions` json DEFAULT ('[]'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_preferences_userId_unique` UNIQUE(`userId`)
);
ALTER TABLE `user_preferences` MODIFY COLUMN `experimentalFeatures` json;;
ALTER TABLE `user_preferences` MODIFY COLUMN `submittedSuggestions` json;ALTER TABLE `user_preferences` MODIFY COLUMN `experimentalFeatures` text;;
ALTER TABLE `user_preferences` MODIFY COLUMN `submittedSuggestions` text;CREATE TABLE `material_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`materialId` int NOT NULL,
	`userId` int NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`tokensUsed` int,
	`responseTime` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `material_questions_id` PRIMARY KEY(`id`)
);
