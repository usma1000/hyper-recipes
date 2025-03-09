import {
  serial,
  varchar,
  integer,
  timestamp,
  boolean,
  json,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createTable } from "../tableCreator";
import { ImagesTable } from "./images";
import { relations } from "drizzle-orm";
import { FavoritesTable } from "./favorites";
import { RecipesToTagsTable } from "./recipesToTags";
import { RecipeIngredientsTable } from "./recipeIngredients";

export const RecipesTable = createTable(
  "recipes",
  {
    id: serial("id").primaryKey().notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull(),
    description: varchar("description", { length: 1024 }).notNull(),
    heroImageId: integer("hero_image_id").references(() => ImagesTable.id),
    steps: json("steps"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    published: boolean("published").default(false).notNull(),
  },
  (table) => {
    return {
      nameIndex: uniqueIndex("name_index").on(table.name),
      slugIndex: uniqueIndex("slug_index").on(table.slug),
    };
  },
);

// Define relations for RecipesTable
export const RecipesTableRelations = relations(
  RecipesTable,
  ({ one, many }) => {
    return {
      heroImage: one(ImagesTable, {
        fields: [RecipesTable.heroImageId],
        references: [ImagesTable.id],
      }),
      favoritedBy: many(FavoritesTable),
      tags: many(RecipesToTagsTable),
      ingredients: many(RecipeIngredientsTable),
    };
  },
);
