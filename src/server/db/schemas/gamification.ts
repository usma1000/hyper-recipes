import { integer, text, timestamp, serial } from "drizzle-orm/pg-core";
import { createTable } from "../tableCreator";

export const PointsTable = createTable("points", {
  userId: text("user_id").notNull(),
  points: integer("points").default(0).notNull(),
});

export const AchievementsTable = createTable("achievements", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export const BadgesTable = createTable("badges", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  badgeName: text("badge_name").notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});
