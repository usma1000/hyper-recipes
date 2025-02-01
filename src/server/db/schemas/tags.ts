import { serial, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { createTable } from '../tableCreator';
import { relations } from 'drizzle-orm';
import { RecipesToTagsTable } from './recipesToTags';

export const tagTypes = pgEnum("tag_types", ["Cuisine", "Meal", "Diet"]);

export const TagsTable = createTable(
  "tag",
  {
    id: serial("id").primaryKey(),
    tagType: tagTypes("tag_types").notNull(),
    name: varchar("name", { length: 256 }).notNull(),
  }
);

// Define relations for TagsTable
export const TagsRelations = relations(TagsTable, ({many}) => {
  return {
    recipes: many(RecipesToTagsTable),
  }
});