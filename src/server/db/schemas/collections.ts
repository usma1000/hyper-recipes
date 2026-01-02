import { serial, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createTable } from "../tableCreator";
import { relations } from "drizzle-orm";
import { CollectionRecipesTable } from "./collectionRecipes";

export const CollectionsTable = createTable("collections", {
  id: serial("id").primaryKey().notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const CollectionsTableRelations = relations(
  CollectionsTable,
  ({ many }) => {
    return {
      recipes: many(CollectionRecipesTable),
    };
  },
);
