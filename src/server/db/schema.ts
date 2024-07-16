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

export type SelectRecipe = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  description: string;
  heroImageId: number | null;
  heroImage: {
      id: number;
      name: string;
      url: string;
      userId: string;
      createdAt: Date;
      updatedAt: Date | null;
  } | null;
}

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

export const tagTypes = pgEnum("tag_types", ["Cuisine", "Meal"]);

export const TagsTable = createTable(
  "tag",
  {
    id: serial("id").primaryKey(),
    tagType: tagTypes("tag_types").notNull(),
    name: varchar("name", { length: 256 }).notNull(),
  }
);

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

// Table relations
export const RecipesTableRelations = relations(RecipesTable, ({one, many}) => {
  return {
    heroImage: one(ImagesTable, {
      fields: [RecipesTable.heroImageId],
      references: [ImagesTable.id],
    }),
    favoritedBy: many(FavoritesTable),
    tags: many(RecipesToTagsTable),
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

export const TagsRelations = relations(TagsTable, ({many}) => {
  return {
    recipes: many(RecipesToTagsTable),
  }
});

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