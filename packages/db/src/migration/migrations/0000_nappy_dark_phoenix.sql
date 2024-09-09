CREATE TABLE `checkout_item` (
	`id` text PRIMARY KEY NOT NULL,
	`checkout_id` text NOT NULL,
	`product_id` text NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`quantity` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `checkout` (
	`id` text PRIMARY KEY NOT NULL,
	`ref_id` text NOT NULL,
	`user_id` text NOT NULL,
	`currency` text NOT NULL,
	`sub_total` real NOT NULL,
	`discount` real DEFAULT 0,
	`tax` real DEFAULT 0,
	`total` real NOT NULL,
	`client_name` text NOT NULL,
	`client_phone` text NOT NULL,
	`client_address` text,
	`additional_info` text,
	`status` text DEFAULT 'IDLE',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`username` text NOT NULL,
	`profile` text,
	`google_id` text,
	`email` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transaction` (
	`id` text PRIMARY KEY NOT NULL,
	`checkout_id` text NOT NULL,
	`md5` text NOT NULL,
	`qr_code` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `transaction_ref` (
	`id` text PRIMARY KEY NOT NULL,
	`transaction_id` text NOT NULL,
	`md5` text NOT NULL,
	`qr_code` text NOT NULL,
	`hash` text NOT NULL,
	`from_account_id` text NOT NULL,
	`to_account_id` text NOT NULL,
	`currency` text NOT NULL,
	`amount` real NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_google_id_unique` ON `user` (`google_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `transaction_md5_unique` ON `transaction` (`md5`);--> statement-breakpoint
CREATE UNIQUE INDEX `transaction_qr_code_unique` ON `transaction` (`qr_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `transaction_ref_hash_unique` ON `transaction_ref` (`hash`);