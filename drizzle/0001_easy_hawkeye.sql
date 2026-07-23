CREATE TABLE `mock_padron` (
	`id` text PRIMARY KEY NOT NULL,
	`rut_hash` text NOT NULL,
	`name` text,
	`last_name` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mock_padron_rut_hash_unique` ON `mock_padron` (`rut_hash`);