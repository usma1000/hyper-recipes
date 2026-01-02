import type { InferSelectModel } from "drizzle-orm";
import {
  ImagesTable,
  RecipesTable,
  IngredientsTable,
  TagsTable,
  CollectionsTable,
} from "~/server/db/schemas";

export {};

declare global {
  // Infer types from your database schemas
  type HeroImage = InferSelectModel<typeof ImagesTable>;
  type Ingredient = InferSelectModel<typeof IngredientsTable>;
  type Tag = InferSelectModel<typeof TagsTable>;
  type Recipe = InferSelectModel<typeof RecipesTable> & {
    heroImage: HeroImage | null;
  };
  type Collection = InferSelectModel<typeof CollectionsTable> & {
    recipes: Array<{
      recipe: Recipe;
    }>;
  };

  // Define custom roles
  type Roles = "admin" | "editor" | "user";

  // Augment the global namespace with custom types
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "admin" | "editor" | "user";
    };
  }
}
