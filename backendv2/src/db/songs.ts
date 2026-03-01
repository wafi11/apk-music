import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// ─── Artists ───────────────────────────────────────────────────

export const artists = pgTable("artists", {
  id: varchar("id", { length: 30 }).primaryKey(),
  name: varchar("name", { length: 100 }),
  image: text("image"),
  ytId: varchar("yt_id", { length: 30 }).unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Albums ────────────────────────────────────────────────────

export const albums = pgTable("albums", {
  id: varchar("id", { length: 30 }).primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  image: text("image"),
  artistId: varchar("artists_id", { length: 30 }).references(() => artists.id),
  ytId: varchar("yt_id", { length: 30 }).unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Songs ─────────────────────────────────────────────────────

export const songs = pgTable("songs", {
  id: varchar("id", { length: 30 }).primaryKey(),
  artistId: varchar("artists_id", { length: 30 }).references(() => artists.id),
  albumId: varchar("albums_id", { length: 30 }).references(() => albums.id),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description"),
  image: text("image"),
  duration: varchar({ length: 10 }),
  linkYt: text("link_yt"),
  ytId: varchar("yt_id", { length: 30 }).unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Relations ─────────────────────────────────────────────────

export const artistsRelations = relations(artists, ({ many }) => ({
  albums: many(albums),
  songs: many(songs),
}));

export const albumsRelations = relations(albums, ({ one, many }) => ({
  artist: one(artists, {
    fields: [albums.artistId],
    references: [artists.id],
  }),
  songs: many(songs),
}));

export const songsRelations = relations(songs, ({ one }) => ({
  artist: one(artists, {
    fields: [songs.artistId],
    references: [artists.id],
  }),
  album: one(albums, {
    fields: [songs.albumId],
    references: [albums.id],
  }),
}));

// ─── Types ─────────────────────────────────────────────────────

export type Artist = typeof artists.$inferSelect;
export type NewArtist = typeof artists.$inferInsert;

export type Album = typeof albums.$inferSelect;
export type NewAlbum = typeof albums.$inferInsert;

export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;
