import 'server-only';
import { db } from './db';
import { auth } from '@clerk/nextjs/server';
import { FavoritesTable, RecipeIngredientsTable, RecipesTable, RecipesToTagsTable, TagsTable } from './db/schema';
import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { type JSONContent } from 'novel';

// Image queries

export async function getAllImages() {
  const images = await db.query.ImagesTable.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });
  return images;
}

export async function getImage(id: number) {
  const image = await db.query.ImagesTable.findFirst({ 
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!image) throw new Error('Image not found');

  return image;
}

// Recipe queries

export async function getAllRecipes() {
  const recipes = await db.query.RecipesTable.findMany({
    orderBy: (model, { desc }) => desc(model.id),
    with: {
      heroImage: true,
    },
  });
  return recipes;
}

export async function getAllRecipeNames() {
  const recipes = await db.query.RecipesTable.findMany({
    orderBy: (model, { desc }) => desc(model.name),
    columns: {
      id: true,
      name: true,
    },
  });
  return recipes;
}

export async function getSliderRecipes() {
  const recipes = await db.query.RecipesTable.findMany({
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

  if (!recipe) throw new Error('Recipe not found');

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

  if (!recipe) throw new Error('Recipe not found');

  return recipe;
}

export async function getStepsByRecipeId(id: number): Promise<JSONContent> {
  const recipe = await db.query.RecipesTable.findFirst({ 
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!recipe) throw new Error('Recipe not found');
  
  return recipe.steps as JSONContent;
}

export async function saveStepsForRecipeId(id: number, steps: any) {
  const user = auth();

  if (!user.userId) throw new Error('Not authenticated');

  await db.update(RecipesTable).set({
    steps,
  }).where(eq(RecipesTable.id, id));

  revalidatePath('/recipe/[slug]', 'page');
}

// Favorite recipes queries

export async function getMyFavoriteRecipes() {
  const user = auth();

  if (!user.userId) throw new Error('Not authenticated');

  const favoriteRecipes = await db.query.FavoritesTable.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    with: {
      favoritedRecipe: {
        with: {
          heroImage: true,
        }
      }
    },
  });
  const recipes = favoriteRecipes.map(favorite => favorite.favoritedRecipe);
  return recipes;
}

export async function isFavoriteRecipe(recipeId: number) {
  const user = auth();

  if (!user.userId) throw new Error('Not authenticated');

  const favoriteRecipe = await db.query.FavoritesTable.findFirst({
    where: (model, { and, eq }) => and(
      eq(model.userId, user.userId),
      eq(model.recipeId, recipeId),
    ),
  });

  return !!favoriteRecipe;
}

export async function createFavoriteRecipe(recipeId: number) {
  const user = auth();

  if (!user.userId) throw new Error('Not authenticated');

  await db.insert(FavoritesTable).values({
    userId: user.userId,
    recipeId,
  });

  revalidatePath('/', 'layout');
  revalidatePath('/recipe/[slug]', 'page');
}

export async function removeFavoriteRecipe(recipeId: number) {
  const user = auth();

  if (!user.userId) throw new Error('Not authenticated');

  await db.delete(FavoritesTable).where(and(eq(FavoritesTable.userId, user.userId), eq(FavoritesTable.recipeId, recipeId)));

  revalidatePath('/', 'layout');
  revalidatePath('/recipe/[slug]', 'page');
}

// Tags queries

export async function getAllTagNames() {
  const tags = await db.query.TagsTable.findMany({
    orderBy: (model, { desc }) => desc(model.name),
    columns: {
      id: true,
      name: true,
    },
  });
  return tags;
}

export async function getAllTagsForRecipe(recipeId: number) {
  const tags = await db.query.RecipesToTagsTable.findMany({
    where: (model, { eq }) => eq(model.recipeId, recipeId),
    with: {
      tag: true,
    },
  });

  return tags.map(tag => tag.tag);
}

type newTag = typeof TagsTable.$inferInsert;

export const createNewTag = async (tag: newTag) => {
  // TODO: Only admins should be able to create tags
  const user = auth();

  if (!user.userId) throw new Error('Not authenticated');

  await db.insert(TagsTable).values(tag);
}

export async function assignTagsToRecipe(recipeId: number, tagIds: number[]) {
  const user = auth();

  if (!user.userId) throw new Error('Not authenticated');

  await db.insert(RecipesToTagsTable).values(tagIds.map(tagId => ({
    recipeId,
    tagId,
  })));

  revalidatePath('/', 'layout');
  revalidatePath('/recipe/[slug]', 'page');
}

export async function removeAllTagsFromRecipe(recipeId: number) {
  const user = auth();

  if (!user.userId) throw new Error('Not authenticated');

  await db.delete(RecipesToTagsTable).where(eq(RecipesToTagsTable.recipeId, recipeId));

  revalidatePath('/', 'layout');
  revalidatePath('/recipe/[slug]', 'page');
}

// Ingredient queries

export async function getAllIngredients() {
  const ingredients = await db.query.IngredientsTable.findMany();
  return ingredients;
}

export async function getIngredientsForRecipe(recipeId: number) {
  const ingredients = await db.query.RecipeIngredientsTable.findMany({
    where: (model, { eq }) => eq(model.recipeId, recipeId),
    with: {
      ingredient: true,
    },
  });

  return ingredients;
}

export async function createIngredientForRecipe(recipeId: number, ingredientId: number, quantity: string) {
  const user = auth();

  if (!user.userId) throw new Error('Not authenticated');

  await db.insert(RecipeIngredientsTable).values({
    recipeId,
    ingredientId,
    quantity,
  });

  revalidatePath('/', 'layout');
  revalidatePath('/recipe/[slug]', 'page');
}