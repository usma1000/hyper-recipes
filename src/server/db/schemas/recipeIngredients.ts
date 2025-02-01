import { integer, varchar, primaryKey } from 'drizzle-orm/pg-core';
import { createTable } from '../tableCreator';
import { RecipesTable } from './recipes';
import { IngredientsTable } from './ingredients';
import { relations } from 'drizzle-orm';

export const RecipeIngredientsTable = createTable(
  "recipe_ingredients",
  {
    recipeId: integer("recipe_id").references(() => RecipesTable.id).notNull(),
    ingredientId: integer("ingredient_id").references(() => IngredientsTable.id).notNull(),
    quantity: varchar("quantity", { length: 256 }).notNull(),
  },
  table => {
    return {
      pk: primaryKey({ columns: [table.recipeId, table.ingredientId] }),
    }
  }
);

// Define relations for RecipeIngredientsTable
export const RecipeIngredientsRelations = relations(RecipeIngredientsTable, ({one}) => {
  return {
    recipe: one(RecipesTable, {
      fields: [RecipeIngredientsTable.recipeId],
      references: [RecipesTable.id],
    }),
    ingredient: one(IngredientsTable, {
      fields: [RecipeIngredientsTable.ingredientId],
      references: [IngredientsTable.id],
    }),
  }
});