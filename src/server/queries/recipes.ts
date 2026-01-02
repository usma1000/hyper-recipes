import "server-only";
import { db } from "../db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath, unstable_cache } from "next/cache";
import { eq, count } from "drizzle-orm";
import { type JSONContent } from "novel";
import { RecipesTable } from "../db/schemas";
import { slugify } from "~/lib/utils";
import { revalidateRecipePaths } from "./utils";

type newRecipe = typeof RecipesTable.$inferInsert;

/**
 * Fetches recipe ID from slug with caching.
 * Cache invalidated when recipes are updated.
 * @param slug - The recipe slug
 * @returns The recipe ID
 */
export const getRecipeIdFromSlug = unstable_cache(
  async (slug: string): Promise<number> => {
    const recipe = await db.query.RecipesTable.findFirst({
      where: (model, { eq }) => eq(model.slug, slug),
      columns: {
        id: true,
      },
    });

    if (!recipe) throw new Error("Recipe not found");

    return recipe.id;
  },
  ["recipe-id-from-slug"],
  { revalidate: 60, tags: ["recipes"] },
);

export async function createNewRecipe(recipe: newRecipe) {
  const user = auth();
  if (!user.userId) throw new Error("Not authenticated");

  const slug = slugify(recipe.name);

  // handle slug uniqueness
  const [result] = await db
    .select({ value: count() })
    .from(RecipesTable)
    .where(eq(RecipesTable.slug, slug));

  const finalSlug =
    (result?.value ?? 0) > 0 ? `${slug}-${(result?.value ?? 0) + 1}` : slug;

  const [newRecipe] = await db
    .insert(RecipesTable)
    .values({ ...recipe, slug: finalSlug })
    .returning();

  revalidatePath("/", "layout");
  return newRecipe;
}

/**
 * Fetches all published recipes with hero images.
 * Cached for 60 seconds, invalidated via "recipes" tag.
 */
export const getAllRecipes = unstable_cache(
  async () => {
    const recipes = await db.query.RecipesTable.findMany({
      where: (model, { eq }) => eq(model.published, true),
      orderBy: (model, { desc }) => desc(model.id),
      with: {
        heroImage: true,
      },
    });
    return recipes;
  },
  ["all-recipes"],
  { revalidate: 60, tags: ["recipes"] },
);

/**
 * Fetches all published recipe names for search.
 * Cached for 60 seconds, invalidated via "recipes" tag.
 */
export const getAllRecipeNames = unstable_cache(
  async () => {
    const recipes = await db.query.RecipesTable.findMany({
      where: (model, { eq }) => eq(model.published, true),
      orderBy: (model, { desc }) => desc(model.name),
      columns: {
        id: true,
        name: true,
        slug: true,
      },
    });
    return recipes;
  },
  ["all-recipe-names"],
  { revalidate: 60, tags: ["recipes"] },
);

/**
 * Fetches recipes for the home page slider.
 * Cached for 60 seconds, invalidated via "recipes" tag.
 */
export const getSliderRecipes = unstable_cache(
  async () => {
    const recipes = await db.query.RecipesTable.findMany({
      where: (model, { eq }) => eq(model.published, true),
      orderBy: (model, { desc }) => desc(model.id),
      limit: 6,
      with: {
        heroImage: true,
      },
    });
    return recipes;
  },
  ["slider-recipes"],
  { revalidate: 60, tags: ["recipes"] },
);

export async function getRecipe(id: number) {
  const recipe = await db.query.RecipesTable.findFirst({
    where: (model, { eq }) => eq(model.id, id),
    with: {
      heroImage: true,
    },
  });

  if (!recipe) throw new Error("Recipe not found.");

  if (!recipe.published && !auth().userId)
    throw new Error("Recipe is unpublished.");

  return recipe;
}

/**
 * Fetches a complete recipe with all relations in a single query.
 * Includes: heroImage, ingredients (with ingredient details), and tags (with tag details).
 * Note: This does NOT check auth for unpublished recipes - caller must handle access control.
 * @param id - The recipe ID
 */
export const getFullRecipeById = unstable_cache(
  async (id: number) => {
    const recipe = await db.query.RecipesTable.findFirst({
      where: (model, { eq }) => eq(model.id, id),
      with: {
        heroImage: true,
        ingredients: {
          with: {
            ingredient: true,
          },
        },
        tags: {
          with: {
            tag: true,
          },
        },
      },
    });

    if (!recipe) throw new Error("Recipe not found");

    return recipe;
  },
  ["full-recipe-by-id"],
  { revalidate: 60, tags: ["recipes", "ingredients", "tags"] },
);

/**
 * Fetches recipe name and description for metadata generation.
 * Cached for 60 seconds, invalidated via "recipes" tag.
 * @param id - The recipe ID
 */
export const getRecipeNameAndDescription = unstable_cache(
  async (id: number) => {
    const recipe = await db.query.RecipesTable.findFirst({
      where: (model, { eq }) => eq(model.id, id),
      columns: {
        name: true,
        description: true,
      },
    });

    if (!recipe) throw new Error("Recipe not found");

    return recipe;
  },
  ["recipe-name-description"],
  { revalidate: 60, tags: ["recipes"] },
);

export async function updateRecipeNameAndDescription(
  id: number,
  name: string,
  description: string,
) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db
    .update(RecipesTable)
    .set({
      name,
      description,
    })
    .where(eq(RecipesTable.id, id));

  revalidateRecipePaths();
}

/**
 * Fetches recipe steps by ID.
 * Cached for 60 seconds, invalidated via "recipes" tag.
 * @param id - The recipe ID
 */
export const getStepsByRecipeId = unstable_cache(
  async (id: number): Promise<JSONContent> => {
    const recipe = await db.query.RecipesTable.findFirst({
      where: (model, { eq }) => eq(model.id, id),
    });

    if (!recipe) throw new Error("Recipe not found");

    return recipe.steps as JSONContent;
  },
  ["recipe-steps"],
  { revalidate: 60, tags: ["recipes"] },
);

export async function saveStepsForRecipeId(id: number, steps: string) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  const parsedSteps = JSON.parse(steps);
  await db
    .update(RecipesTable)
    .set({
      steps: parsedSteps,
    })
    .where(eq(RecipesTable.id, id));

  revalidateRecipePaths();
}

export async function setPublishRecipe(id: number, published: boolean) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db
    .update(RecipesTable)
    .set({
      published: published,
    })
    .where(eq(RecipesTable.id, id));

  revalidateRecipePaths();
}

export type RecipeWithoutHeroImage = Omit<Recipe, "heroImage">;

export async function getUnpublishedRecipes(): Promise<
  RecipeWithoutHeroImage[]
> {
  const unpublishedRecipes = await db.query.RecipesTable.findMany({
    where: (model, { eq }) => eq(model.published, false),
    orderBy: (model, { desc }) => desc(model.createdAt),
  });

  return unpublishedRecipes;
}

export async function updateRecipeHeroImage(recipeId: number, imageId: number) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db
    .update(RecipesTable)
    .set({
      heroImageId: imageId,
    })
    .where(eq(RecipesTable.id, recipeId));

  return { success: true };
}
