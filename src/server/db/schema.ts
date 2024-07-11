// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql, relations } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `hyper-recipes_${name}`);

export const images = createTable(
  "image",
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

export const recipe = createTable(
  "recipe",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 1024 }).notNull(),
    heroImageId: integer("hero_image_id").references(() => images.id),

    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  }
);

export const recipeHeroImage = relations(recipe, ({one}) => ({
  heroImage: one(images, {
    fields: [recipe.heroImageId],
    references: [images.id],
  }),
}));