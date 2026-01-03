import {
  serial,
  integer,
  text,
  varchar,
  json,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createTable } from "../tableCreator";
import { RecipeVersionsTable } from "./recipeVersions";

/**
 * Skill level enum for recipe steps.
 * Indicates the difficulty of executing a particular step.
 */
export const skillLevelEnum = pgEnum("skill_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

/**
 * RecipeSteps table - normalized step entities for recipe versions.
 * Each step belongs to a version and contains instruction, media, timing, and advanced metadata.
 */
export const RecipeStepsTable = createTable("recipe_steps", {
  id: serial("id").primaryKey().notNull(),
  versionId: integer("version_id")
    .references(() => RecipeVersionsTable.id, { onDelete: "cascade" })
    .notNull(),
  stepOrder: integer("step_order").notNull(),
  instruction: text("instruction").notNull(),
  mediaUrl: varchar("media_url", { length: 512 }),
  timerSeconds: integer("timer_seconds"),
  skillLevel: skillLevelEnum("skill_level"),
  tools: json("tools").$type<string[]>(),
  techniques: json("techniques").$type<string[]>(),
});

/**
 * Relations for RecipeStepsTable.
 * Each step belongs to one recipe version.
 */
export const RecipeStepsRelations = relations(RecipeStepsTable, ({ one }) => {
  return {
    version: one(RecipeVersionsTable, {
      fields: [RecipeStepsTable.versionId],
      references: [RecipeVersionsTable.id],
    }),
  };
});

export type RecipeStep = typeof RecipeStepsTable.$inferSelect;
export type NewRecipeStep = typeof RecipeStepsTable.$inferInsert;
export type SkillLevel = "beginner" | "intermediate" | "advanced";

