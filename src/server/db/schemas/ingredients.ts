import { serial, varchar } from "drizzle-orm/pg-core";
import { createTable } from "../tableCreator";
import { relations } from "drizzle-orm";
import { RecipeIngredientsTable } from "./recipeIngredients";

export const IngredientsTable = createTable("ingredients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  description: varchar("description", { length: 1024 }),
});

// Define relations for IngredientsTable
export const IngredientsRelations = relations(IngredientsTable, ({ many }) => {
  return {
    recipes: many(RecipeIngredientsTable),
  };
});
