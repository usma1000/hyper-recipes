import { serial, varchar, integer } from 'drizzle-orm/pg-core';
import { createTable } from '../tableCreator';
import { RecipesTable } from './recipes';
import { relations } from 'drizzle-orm';

export const FavoritesTable = createTable(
  "favorite_recipes",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    recipeId: integer("recipe_id").references(() => RecipesTable.id).notNull(),
  }
);

// Define relations for FavoritesTable
export const FavoritesTableRelations = relations(FavoritesTable, ({one}) => {
  return {
    favoritedRecipe: one(RecipesTable, {
      fields: [FavoritesTable.recipeId],
      references: [RecipesTable.id],
    }),
  }
});