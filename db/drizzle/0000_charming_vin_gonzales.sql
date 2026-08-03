CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT '2026-08-03T05:10:24.815Z' NOT NULL,
	`updated_at` text
);
