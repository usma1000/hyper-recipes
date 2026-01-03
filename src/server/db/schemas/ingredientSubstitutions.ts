import { serial, integer, varchar, text, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createTable } from "../tableCreator";
import { VersionIngredientsTable } from "./versionIngredients";
import { IngredientsTable } from "./ingredients";

/**
 * IngredientSubstitutions table - defines alternative ingredients for a version ingredient.
 * Allows authors to specify what can be used instead of the primary ingredient.
 */
export const IngredientSubstitutionsTable = createTable(
  "ingredient_substitutions",
  {
    id: serial("id").primaryKey().notNull(),
    versionIngredientId: integer("version_ingredient_id")
      .references(() => VersionIngredientsTable.id, { onDelete: "cascade" })
      .notNull(),
    substituteIngredientId: integer("substitute_ingredient_id")
      .references(() => IngredientsTable.id, { onDelete: "cascade" })
      .notNull(),
    substituteQuantity: numeric("substitute_quantity", {
      precision: 10,
      scale: 3,
    }).notNull(),
    substituteUnit: varchar("substitute_unit", { length: 50 }).notNull(),
    notes: text("notes"),
  },
);

/**
 * Relations for IngredientSubstitutionsTable.
 * Each substitution belongs to one version ingredient and references one substitute ingredient.
 */
export const IngredientSubstitutionsRelations = relations(
  IngredientSubstitutionsTable,
  ({ one }) => {
    return {
      versionIngredient: one(VersionIngredientsTable, {
        fields: [IngredientSubstitutionsTable.versionIngredientId],
        references: [VersionIngredientsTable.id],
      }),
      substituteIngredient: one(IngredientsTable, {
        fields: [IngredientSubstitutionsTable.substituteIngredientId],
        references: [IngredientsTable.id],
      }),
    };
  },
);

export type IngredientSubstitution =
  typeof IngredientSubstitutionsTable.$inferSelect;
export type NewIngredientSubstitution =
  typeof IngredientSubstitutionsTable.$inferInsert;

