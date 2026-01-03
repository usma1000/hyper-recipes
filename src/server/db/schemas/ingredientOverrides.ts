import { serial, integer, json, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createTable } from "../tableCreator";
import { RecipeVersionsTable } from "./recipeVersions";
import { VersionIngredientsTable } from "./versionIngredients";

/**
 * Override operation types for ingredient modifications in EASY/HARD versions.
 * - ADD: Add a new ingredient not in the base
 * - REMOVE: Remove an ingredient from the base
 * - UPDATE: Modify quantity/unit/notes of a base ingredient
 * - REPLACE: Swap one ingredient for another
 */
export const ingredientOverrideOperationEnum = pgEnum(
  "ingredient_override_operation",
  ["ADD", "REMOVE", "UPDATE", "REPLACE"],
);

/**
 * IngredientOverride data structure for ADD operation.
 */
export type AddIngredientOverrideData = {
  ingredientId: number;
  quantity: string;
  unit: string;
  notes?: string;
  isOptional?: boolean;
};

/**
 * IngredientOverride data structure for UPDATE operation.
 */
export type UpdateIngredientOverrideData = {
  quantity?: string;
  unit?: string;
  notes?: string;
  isOptional?: boolean;
};

/**
 * IngredientOverride data structure for REPLACE operation.
 */
export type ReplaceIngredientOverrideData = {
  newIngredientId: number;
  quantity: string;
  unit: string;
  notes?: string;
};

export type IngredientOverrideData =
  | AddIngredientOverrideData
  | UpdateIngredientOverrideData
  | ReplaceIngredientOverrideData
  | null;

/**
 * IngredientOverrides table - stores delta patches for EASY/HARD versions.
 * Each override describes a modification to apply on top of the MEDIUM base.
 */
export const IngredientOverridesTable = createTable("ingredient_overrides", {
  id: serial("id").primaryKey().notNull(),
  versionId: integer("version_id")
    .references(() => RecipeVersionsTable.id, { onDelete: "cascade" })
    .notNull(),
  operation: ingredientOverrideOperationEnum("operation").notNull(),
  targetIngredientId: integer("target_ingredient_id").references(
    () => VersionIngredientsTable.id,
    { onDelete: "cascade" },
  ),
  overrideData: json("override_data").$type<IngredientOverrideData>(),
});

/**
 * Relations for IngredientOverridesTable.
 * Each override belongs to a version and optionally targets a base ingredient.
 */
export const IngredientOverridesRelations = relations(
  IngredientOverridesTable,
  ({ one }) => {
    return {
      version: one(RecipeVersionsTable, {
        fields: [IngredientOverridesTable.versionId],
        references: [RecipeVersionsTable.id],
      }),
      targetIngredient: one(VersionIngredientsTable, {
        fields: [IngredientOverridesTable.targetIngredientId],
        references: [VersionIngredientsTable.id],
      }),
    };
  },
);

export type IngredientOverride = typeof IngredientOverridesTable.$inferSelect;
export type NewIngredientOverride =
  typeof IngredientOverridesTable.$inferInsert;
export type IngredientOverrideOperation = "ADD" | "REMOVE" | "UPDATE" | "REPLACE";

