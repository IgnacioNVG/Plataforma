CREATE TABLE `school` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`target_audience` text,
	`status` text DEFAULT 'publicado' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `course` ADD `school_id` text NOT NULL REFERENCES school(id);