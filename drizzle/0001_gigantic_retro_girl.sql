CREATE TABLE `generations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`originalImageUrl` text NOT NULL,
	`originalImageKey` text NOT NULL,
	`generatedImageUrl` text,
	`generatedImageKey` text,
	`category` varchar(64) NOT NULL,
	`scene` varchar(64) NOT NULL,
	`templateId` int,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`creditsUsed` int NOT NULL DEFAULT 0,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `generations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`plan` enum('FREE','STARTER','BUSINESS') NOT NULL DEFAULT 'FREE',
	`status` enum('active','canceled','expired') NOT NULL DEFAULT 'active',
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`category` varchar(64) NOT NULL,
	`scene` varchar(64) NOT NULL,
	`icon` varchar(12) NOT NULL,
	`description` text NOT NULL,
	`promptTemplate` text NOT NULL,
	`isPremium` boolean NOT NULL DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`month` varchar(7) NOT NULL,
	`generationsUsed` int NOT NULL DEFAULT 0,
	`generationLimit` int NOT NULL DEFAULT 5,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `usage_id` PRIMARY KEY(`id`),
	CONSTRAINT `usage_user_month_unique` UNIQUE(`userId`,`month`)
);
--> statement-breakpoint
CREATE INDEX `generations_user_idx` ON `generations` (`userId`);--> statement-breakpoint
CREATE INDEX `generations_status_idx` ON `generations` (`status`);--> statement-breakpoint
CREATE INDEX `subscriptions_user_idx` ON `subscriptions` (`userId`);--> statement-breakpoint
CREATE INDEX `templates_active_idx` ON `templates` (`isActive`);