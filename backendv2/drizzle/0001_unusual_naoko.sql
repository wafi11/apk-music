ALTER TABLE "albums" ALTER COLUMN "id" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "albums" ALTER COLUMN "artists_id" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "artists" ALTER COLUMN "id" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "songs" ALTER COLUMN "id" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "songs" ALTER COLUMN "artists_id" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "songs" ALTER COLUMN "albums_id" SET DATA TYPE varchar(30);