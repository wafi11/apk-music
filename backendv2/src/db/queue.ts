import { relations } from "drizzle-orm";
import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { songs } from "./schema";

// ─── Queues ────────────────────────────────────────────────────

export const queues = pgTable("queues", {
  id: varchar("id", { length: 30 }).primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Queue Items ───────────────────────────────────────────────

export const queueItems = pgTable("queue_items", {
  id: varchar("id", { length: 30 }).primaryKey(),
  queueId: varchar("queue_id", { length: 30 }).references(() => queues.id, {
    onDelete: "cascade",
  }),
  songId: varchar("song_id", { length: 30 }).references(() => songs.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Relations ─────────────────────────────────────────────────

export const queuesRelations = relations(queues, ({ many }) => ({
  items: many(queueItems),
}));

export const queueItemsRelations = relations(queueItems, ({ one }) => ({
  queue: one(queues, {
    fields: [queueItems.queueId],
    references: [queues.id],
  }),
  song: one(songs, {
    fields: [queueItems.songId],
    references: [songs.id],
  }),
}));

// ─── Types ─────────────────────────────────────────────────────

export type Queue = typeof queues.$inferSelect;
export type NewQueue = typeof queues.$inferInsert;

export type QueueItem = typeof queueItems.$inferSelect;
export type NewQueueItem = typeof queueItems.$inferInsert;
