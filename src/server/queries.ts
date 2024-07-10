import 'server-only';
import { db } from './db';
import { auth } from '@clerk/nextjs/server';

export async function getAllImages() {
  const images = await db.query.images.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });
  return images;
}

export async function getMyImages() {
  const user = auth();

  if (!user.userId) throw new Error('Not authenticated');

  const images = await db.query.images.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.id),
  });
  return images;
}

export async function getImage(id: number) {
  const user = auth();

  if (!user.userId) throw new Error('Not authenticated');

  const image = await db.query.images.findFirst({ 
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!image) throw new Error('Image not found');

  return image;
}

export async function getRecipe(id: number) {
  const recipe = await db.query.recipe.findFirst({ 
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!recipe) throw new Error('Recipe not found');

  return recipe;
}