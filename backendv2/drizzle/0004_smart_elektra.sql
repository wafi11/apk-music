ALTER TABLE "songs" ADD COLUMN "yt_id" varchar(20);--> statement-breakpoint
ALTER TABLE "songs" ADD CONSTRAINT "songs_yt_id_unique" UNIQUE("yt_id");