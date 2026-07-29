ALTER TABLE `event` ADD `youtube_url` text;--> statement-breakpoint
ALTER TABLE `event` ADD `document_id` text REFERENCES document(id);