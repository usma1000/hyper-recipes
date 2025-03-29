import "server-only";
import { db } from "../db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq, count } from "drizzle-orm";
import { type JSONContent } from "novel";
import { RecipesTable } from "../db/schemas";
import { slugify } from "~/lib/utils";
import { revalidateRecipePaths } from "./utils";

type newRecipe = typeof RecipesTable.$inferInsert;

export async function getRecipeIdFromSlug(slug: string) {
  const recipe = await db.query.RecipesTable.findFirst({
    where: (model, { eq }) => eq(model.slug, slug),
    columns: {
      id: true,
    },
  });

  if (!recipe) throw new Error("Recipe not found");

  return recipe.id;
}

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

export async function getAllRecipes() {
  const recipes = await db.query.RecipesTable.findMany({
    where: (model, { eq }) => eq(model.published, true),
    orderBy: (model, { desc }) => desc(model.id),
    with: {
      heroImage: true,
    },
  });
  return recipes;
}

export async function getAllRecipeNames() {
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
}

export async function getSliderRecipes() {
  const recipes = await db.query.RecipesTable.findMany({
    where: (model, { eq }) => eq(model.published, true),
    orderBy: (model, { desc }) => desc(model.id),
    limit: 6,
    with: {
      heroImage: true,
    },
  });
  return recipes;
}

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

export async function getRecipeNameAndDescription(id: number) {
  const recipe = await db.query.RecipesTable.findFirst({
    where: (model, { eq }) => eq(model.id, id),
    columns: {
      name: true,
      description: true,
    },
  });

  if (!recipe) throw new Error("Recipe not found");

  return recipe;
}

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

export async function getStepsByRecipeId(id: number): Promise<JSONContent> {
  const recipe = await db.query.RecipesTable.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!recipe) throw new Error("Recipe not found");

  return recipe.steps as JSONContent;
}

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

  revalidatePath("/recipe/[slug]", "page");
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
