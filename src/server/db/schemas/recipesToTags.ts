import { integer, primaryKey } from 'drizzle-orm/pg-core';
import { createTable } from '../tableCreator';
import { RecipesTable } from './recipes';
import { TagsTable } from './tags';
import { relations } from 'drizzle-orm';

export const RecipesToTagsTable = createTable(
  "recipes_to_tags",
  {
    recipeId: integer("recipe_id").references(() => RecipesTable.id).notNull(),
    tagId: integer("tag_id").references(() => TagsTable.id).notNull(),
  },
  table => {
    return {
      pk: primaryKey({ columns: [table.recipeId, table.tagId] }),
    }
  }
);

// Define relations for RecipesToTagsTable
export const RecipesToTagsRelations = relations(RecipesToTagsTable, ({one}) => {
  return {
    recipe: one(RecipesTable, {
      fields: [RecipesToTagsTable.recipeId],
      references: [RecipesTable.id],
    }),
    tag: one(TagsTable, {
      fields: [RecipesToTagsTable.tagId],
      references: [TagsTable.id],
    }),
  }
});