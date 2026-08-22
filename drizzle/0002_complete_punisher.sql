CREATE TABLE `subscriber_waitlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`plan` enum('STARTER','BUSINESS') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscriber_waitlist_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `usage` ADD `resetAt` timestamp;--> statement-breakpoint
CREATE INDEX `subscriber_waitlist_email_plan_idx` ON `subscriber_waitlist` (`email`,`plan`);