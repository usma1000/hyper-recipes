import {
  serial,
  varchar,
  integer,
  timestamp,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createTable } from "../tableCreator";
import { RecipesTable } from "./recipes";
import { relations } from "drizzle-orm";

/**
 * Table for storing per-step notes for a user on a recipe.
 * Each user can have one note per step per recipe.
 */
export const RecipeStepNotesTable = createTable(
  "recipe_step_notes",
  {
    id: serial("id").primaryKey().notNull(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    recipeId: integer("recipe_id")
      .references(() => RecipesTable.id, { onDelete: "cascade" })
      .notNull(),
    stepIndex: integer("step_index").notNull(),
    note: text("note").notNull().default(""),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    userRecipeStepIdx: uniqueIndex("step_notes_user_recipe_step_idx").on(
      table.userId,
      table.recipeId,
      table.stepIndex
    ),
  })
);

/**
 * Table for storing general notes for a user on a recipe.
 * Each user can have one general note per recipe.
 */
export const RecipeUserNotesTable = createTable(
  "recipe_user_notes",
  {
    id: serial("id").primaryKey().notNull(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    recipeId: integer("recipe_id")
      .references(() => RecipesTable.id, { onDelete: "cascade" })
      .notNull(),
    note: text("note").notNull().default(""),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    userRecipeIdx: uniqueIndex("user_notes_user_recipe_idx").on(
      table.userId,
      table.recipeId
    ),
  })
);

export const RecipeStepNotesTableRelations = relations(
  RecipeStepNotesTable,
  ({ one }) => ({
    recipe: one(RecipesTable, {
      fields: [RecipeStepNotesTable.recipeId],
      references: [RecipesTable.id],
    }),
  })
);

export const RecipeUserNotesTableRelations = relations(
  RecipeUserNotesTable,
  ({ one }) => ({
    recipe: one(RecipesTable, {
      fields: [RecipeUserNotesTable.recipeId],
      references: [RecipesTable.id],
    }),
  })
);

