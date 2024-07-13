import 'server-only';
import { db } from './db';
import { auth } from '@clerk/nextjs/server';

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

export async function getAllRecipes() {
  const recipes = await db.query.RecipesTable.findMany({
    orderBy: (model, { desc }) => desc(model.id),
    with: {
      heroImage: true,
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