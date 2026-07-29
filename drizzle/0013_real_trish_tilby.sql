CREATE TABLE `access_request` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`requester_user_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`requested_at` integer NOT NULL,
	`resolved_at` integer,
	`resolved_by_user_id` text,
	FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`requester_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`resolved_by_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `role_request` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`proposed_title` text NOT NULL,
	`proposed_functional_area` text NOT NULL,
	`requester_user_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`requested_at` integer NOT NULL,
	`resolved_at` integer,
	`resolved_by_user_id` text,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`requester_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`resolved_by_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `position_type` ADD `functional_area` text DEFAULT 'general' NOT NULL;