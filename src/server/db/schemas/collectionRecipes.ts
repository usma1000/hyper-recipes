import { integer, primaryKey, index } from "drizzle-orm/pg-core";
import { createTable } from "../tableCreator";
import { RecipesTable } from "./recipes";
import { CollectionsTable } from "./collections";
import { relations } from "drizzle-orm";

export const CollectionRecipesTable = createTable(
  "collection_recipes",
  {
    collectionId: integer("collection_id")
      .references(() => CollectionsTable.id)
      .notNull(),
    recipeId: integer("recipe_id")
      .references(() => RecipesTable.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.collectionId, table.recipeId] }),
    collectionIdx: index("collection_recipes_collection_idx").on(
      table.collectionId,
    ),
    recipeIdx: index("collection_recipes_recipe_idx").on(table.recipeId),
  }),
);

export const CollectionRecipesTableRelations = relations(
  CollectionRecipesTable,
  ({ one }) => {
    return {
      collection: one(CollectionsTable, {
        fields: [CollectionRecipesTable.collectionId],
        references: [CollectionsTable.id],
      }),
      recipe: one(RecipesTable, {
        fields: [CollectionRecipesTable.recipeId],
        references: [RecipesTable.id],
      }),
    };
  },
);
