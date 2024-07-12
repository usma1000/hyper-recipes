// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql, relations } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer,
  pgEnum,
  uniqueIndex,
  primaryKey,
  boolean,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `hyper-recipes_${name}`);

// Table definitions
export const ImagesTable = createTable(
  "images",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    url: varchar("url", { length: 1024 }).notNull(),

    userId: varchar("userId", { length: 256 }).notNull(),

    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  }
);

export const RecipesTable = createTable(
  "recipes",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 1024 }).notNull(),
    heroImageId: integer("hero_image_id").references(() => ImagesTable.id),

    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  }, table => {
    return {
      nameIndex: uniqueIndex("name_index").on(table.name),
    }
  }
);

export const FavoritesTable = createTable(
  "favorite_recipes",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    recipeId: integer("recipe_id").references(() => RecipesTable.id).notNull(),
  }
);

// export const tagTypes = pgEnum("tag_types", ["cuisine_type", "meal_type"]);
// export const cuisineTypes = pgEnum("cuisine_types", ["american", "italian", "mexican", "chinese", "japanese", "indian", "french", "thai", "greek", "mediterranean", "middle_eastern", "spanish", "german", "korean"]);
// export const mealTypes = pgEnum("meal_types", ["breakfast", "lunch", "dinner", "snack", "dessert", "drink"]);

// export const tags = createTable(
//   "tag",
//   {
//     id: serial("id").primaryKey(),
//     name: varchar("name", { length: 256 }).notNull(),
//     type: varchar("type", { length: 256 }).notNull(),
//   }
// );

// Table relations
export const RecipesTableRelations = relations(RecipesTable, ({one, many}) => {
  return {
    heroImage: one(ImagesTable, {
      fields: [RecipesTable.heroImageId],
      references: [ImagesTable.id],
    }),
    favoritedBy: many(FavoritesTable),
  }
});

export const FavoritesTableRelations = relations(FavoritesTable, ({one}) => {
  return {
    favoritedRecipe: one(RecipesTable, {
      fields: [FavoritesTable.recipeId],
      references: [RecipesTable.id],
    }),
  }
});