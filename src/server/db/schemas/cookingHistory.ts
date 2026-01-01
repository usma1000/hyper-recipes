import { serial, varchar, integer, real, text, timestamp, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createTable } from "../tableCreator";
import { RecipesTable } from "./recipes";
import { relations } from "drizzle-orm";

export const CookingSessionsTable = createTable(
  "cooking_sessions",
  {
    id: serial("id").primaryKey().notNull(),
    recipeId: integer("recipe_id")
      .references(() => RecipesTable.id)
      .notNull(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    rating: real("rating").notNull(),
    timeMinutes: integer("time_minutes").notNull(),
    notes: text("notes"),
    cookedAt: timestamp("cooked_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    recipeIdIdx: index("cooking_sessions_recipe_id_idx").on(table.recipeId),
    userIdIdx: index("cooking_sessions_user_id_idx").on(table.userId),
    userRecipeIdx: index("cooking_sessions_user_recipe_idx").on(
      table.userId,
      table.recipeId,
    ),
  }),
);

export const CookingSessionsTableRelations = relations(
  CookingSessionsTable,
  ({ one }) => {
    return {
      recipe: one(RecipesTable, {
        fields: [CookingSessionsTable.recipeId],
        references: [RecipesTable.id],
      }),
    };
  },
);

