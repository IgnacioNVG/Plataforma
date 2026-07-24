PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`rut_hash` text NOT NULL,
	`email` text,
	`name` text NOT NULL,
	`last_name` text NOT NULL,
	`biography` text,
	`phone` text,
	`avatar_url` text,
	`password_hash` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "rut_hash", "email", "name", "last_name", "biography", "phone", "avatar_url", "password_hash", "is_active", "created_at") SELECT "id", "rut_hash", "email", "name", "last_name", "biography", "phone", "avatar_url", "password_hash", "is_active", "created_at" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);