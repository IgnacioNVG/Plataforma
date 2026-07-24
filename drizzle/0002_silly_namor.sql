CREATE TABLE `padron_provisorio` (
	`id` text PRIMARY KEY NOT NULL,
	`rut` text NOT NULL,
	`name` text NOT NULL,
	`last_name` text NOT NULL,
	`region` text,
	`comuna` text,
	`status` text DEFAULT 'Activo',
	`role` text DEFAULT 'Militante Base',
	`join_date` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `padron_provisorio_rut_unique` ON `padron_provisorio` (`rut`);