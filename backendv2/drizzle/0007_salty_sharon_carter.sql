ALTER TABLE "albums" ADD COLUMN "yt_id" varchar(30);--> statement-breakpoint
ALTER TABLE "artists" ADD COLUMN "yt_id" varchar(30);--> statement-breakpoint
ALTER TABLE "albums" ADD CONSTRAINT "albums_yt_id_unique" UNIQUE("yt_id");--> statement-breakpoint
ALTER TABLE "artists" ADD CONSTRAINT "artists_yt_id_unique" UNIQUE("yt_id");