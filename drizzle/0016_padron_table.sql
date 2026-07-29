-- Custom SQL migration file, put your code below! --
DROP TABLE IF EXISTS `padron_provisorio`;
DROP TABLE IF EXISTS `mock_padron`;

CREATE TABLE `padron` (
	`id` text PRIMARY KEY NOT NULL,
	`rut_hash` text NOT NULL,
	`ficha` text,
	`name` text,
	`last_name` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);

CREATE UNIQUE INDEX `padron_rut_hash_unique` ON `padron` (`rut_hash`);