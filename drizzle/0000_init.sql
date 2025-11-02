CREATE TABLE `users` (
`id` int AUTO_INCREMENT NOT NULL,
`openId` varchar(64) NOT NULL,
`name` text,
`email` varchar(320),
`loginMethod` varchar(64),
`role` enum('user','admin') NOT NULL DEFAULT 'user',
`createdAt` timestamp NOT NULL DEFAULT (now()),
`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
CONSTRAINT `users_id` PRIMARY KEY(`id`),
CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);

CREATE TABLE `playerProgress` (
`id` int AUTO_INCREMENT NOT NULL,
`userId` int NOT NULL,
`totalXP` int NOT NULL DEFAULT 0,
`totalCoins` int NOT NULL DEFAULT 0,
`totalKills` int NOT NULL DEFAULT 0,
`totalPlayTime` int NOT NULL DEFAULT 0,
`noobHighScore` int NOT NULL DEFAULT 0,
`proHighScore` int NOT NULL DEFAULT 0,
`godHighScore` int NOT NULL DEFAULT 0,
`psychoHighScore` int NOT NULL DEFAULT 0,
`ultimateHighScore` int NOT NULL DEFAULT 0,
`unlockedModes` text NOT NULL,
`unlockedAbilities` text NOT NULL,
`unlockedWeapons` text NOT NULL,
`unlockedCostumes` text NOT NULL,
`achievements` text NOT NULL,
`createdAt` timestamp NOT NULL DEFAULT (now()),
`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT `playerProgress_id` PRIMARY KEY(`id`)
);

CREATE TABLE `gameSessions` (
`id` int AUTO_INCREMENT NOT NULL,
`userId` int NOT NULL,
`mode` enum('noob','pro','god','psycho','ultimate') NOT NULL,
`wavesSurvived` int NOT NULL,
`enemiesDefeated` int NOT NULL,
`timeAlive` int NOT NULL,
`xpEarned` int NOT NULL,
`coinsEarned` int NOT NULL,
`skillsUsed` text NOT NULL,
`damageDealt` int NOT NULL,
`damageTaken` int NOT NULL,
`createdAt` timestamp NOT NULL DEFAULT (now()),
CONSTRAINT `gameSessions_id` PRIMARY KEY(`id`)
);

CREATE TABLE `leaderboard` (
`id` int AUTO_INCREMENT NOT NULL,
`userId` int NOT NULL,
`userName` varchar(255) NOT NULL,
`mode` enum('noob','pro','god','psycho','ultimate') NOT NULL,
`highScore` int NOT NULL,
`totalKills` int NOT NULL,
`rank` int NOT NULL,
`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT `leaderboard_id` PRIMARY KEY(`id`)
);

CREATE TABLE `achievements` (
`id` int AUTO_INCREMENT NOT NULL,
`userId` int NOT NULL,
`achievementId` varchar(64) NOT NULL,
`achievementName` varchar(255) NOT NULL,
`description` text,
`unlockedAt` timestamp NOT NULL DEFAULT (now()),
CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
