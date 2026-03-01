CREATE TABLE "albums" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"image" text,
	"artists_id" varchar(10),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "artists" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"image" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"artists_id" varchar(10),
	"albums_id" varchar(10),
	"title" varchar(100) NOT NULL,
	"description" text,
	"image" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "albums" ADD CONSTRAINT "albums_artists_id_artists_id_fk" FOREIGN KEY ("artists_id") REFERENCES "public"."artists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "songs" ADD CONSTRAINT "songs_artists_id_artists_id_fk" FOREIGN KEY ("artists_id") REFERENCES "public"."artists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "songs" ADD CONSTRAINT "songs_albums_id_albums_id_fk" FOREIGN KEY ("albums_id") REFERENCES "public"."albums"("id") ON DELETE no action ON UPDATE no action;