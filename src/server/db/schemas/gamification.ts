import { integer, text, timestamp, serial, index } from "drizzle-orm/pg-core";
import { createTable } from "../tableCreator";

export const PointsTable = createTable(
  "points",
  {
    userId: text("user_id").notNull(),
    points: integer("points").default(0).notNull(),
    level: integer("level").default(1).notNull(),
    xpForCurrentLevel: integer("xp_for_current_level").default(0).notNull(),
    nextLevelXp: integer("next_level_xp").default(100).notNull(),
  },
  (table) => ({
    userIdIdx: index("points_user_id_idx").on(table.userId),
  }),
);

export const AchievementsTable = createTable(
  "achievements",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    earnedAt: timestamp("earned_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("achievements_user_id_idx").on(table.userId),
  }),
);

export const BadgesTable = createTable(
  "badges",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    badgeName: text("badge_name").notNull(),
    earnedAt: timestamp("earned_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("badges_user_id_idx").on(table.userId),
  }),
);
