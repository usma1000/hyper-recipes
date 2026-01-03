import { serial, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createTable } from "../tableCreator";
import { RecipesTable } from "./recipes";
import { RecipeStepsTable } from "./recipeSteps";
import { VersionIngredientsTable } from "./versionIngredients";
import { IngredientOverridesTable } from "./ingredientOverrides";
import { StepOverridesTable } from "./stepOverrides";

/**
 * Difficulty levels for recipe versions.
 * MEDIUM is always the canonical base version.
 */
export const difficultyEnum = pgEnum("difficulty_level", [
  "EASY",
  "MEDIUM",
  "HARD",
]);

/**
 * RecipeVersions table - contains EASY/MEDIUM/HARD versions for each recipe.
 * MEDIUM version (isBase=true) contains the canonical recipe data.
 * EASY/HARD versions store delta overrides only.
 */
export const RecipeVersionsTable = createTable("recipe_versions", {
  id: serial("id").primaryKey().notNull(),
  recipeId: integer("recipe_id")
    .references(() => RecipesTable.id, { onDelete: "cascade" })
    .notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  isBase: boolean("is_base").default(false).notNull(),
});

/**
 * Relations for RecipeVersionsTable.
 * Each version belongs to one recipe and has many steps, ingredients, and overrides.
 */
export const RecipeVersionsRelations = relations(
  RecipeVersionsTable,
  ({ one, many }) => {
    return {
      recipe: one(RecipesTable, {
        fields: [RecipeVersionsTable.recipeId],
        references: [RecipesTable.id],
      }),
      steps: many(RecipeStepsTable),
      versionIngredients: many(VersionIngredientsTable),
      ingredientOverrides: many(IngredientOverridesTable),
      stepOverrides: many(StepOverridesTable),
    };
  },
);

export type RecipeVersion = typeof RecipeVersionsTable.$inferSelect;
export type NewRecipeVersion = typeof RecipeVersionsTable.$inferInsert;
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

