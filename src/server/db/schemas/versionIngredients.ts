import {
  serial,
  integer,
  varchar,
  text,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createTable } from "../tableCreator";
import { RecipeVersionsTable } from "./recipeVersions";
import { IngredientsTable } from "./ingredients";
import { IngredientSubstitutionsTable } from "./ingredientSubstitutions";
import { ScalingRulesTable } from "./scalingRules";

/**
 * VersionIngredients table - ingredients associated with a specific recipe version.
 * Contains quantity, unit, notes, and optional flag for each ingredient in a version.
 */
export const VersionIngredientsTable = createTable("version_ingredients", {
  id: serial("id").primaryKey().notNull(),
  versionId: integer("version_id")
    .references(() => RecipeVersionsTable.id, { onDelete: "cascade" })
    .notNull(),
  ingredientId: integer("ingredient_id")
    .references(() => IngredientsTable.id, { onDelete: "cascade" })
    .notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 3 }).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  notes: text("notes"),
  isOptional: boolean("is_optional").default(false).notNull(),
});

/**
 * Relations for VersionIngredientsTable.
 * Each version ingredient belongs to one version and references one ingredient.
 * Has many substitutions and scaling rules.
 */
export const VersionIngredientsRelations = relations(
  VersionIngredientsTable,
  ({ one, many }) => {
    return {
      version: one(RecipeVersionsTable, {
        fields: [VersionIngredientsTable.versionId],
        references: [RecipeVersionsTable.id],
      }),
      ingredient: one(IngredientsTable, {
        fields: [VersionIngredientsTable.ingredientId],
        references: [IngredientsTable.id],
      }),
      substitutions: many(IngredientSubstitutionsTable),
      scalingRules: many(ScalingRulesTable),
    };
  },
);

export type VersionIngredient = typeof VersionIngredientsTable.$inferSelect;
export type NewVersionIngredient = typeof VersionIngredientsTable.$inferInsert;

