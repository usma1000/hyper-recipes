import "server-only";
import { db } from "../db";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { FavoritesTable } from "../db/schemas";
import { revalidateRecipePaths } from "./utils";

/**
 * Fetches all favorite recipes for the current user.
 * Uses eager loading with relation and filters published recipes in application code.
 * This is more efficient than the subquery approach as it uses indexes better.
 */
export async function getMyFavoriteRecipes() {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  // Fetch favorites with recipes eagerly loaded using the relation
  const favoriteRecipes = await db.query.FavoritesTable.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    with: {
      favoritedRecipe: {
        with: {
          heroImage: true,
        },
      },
    },
  });

  // Filter to only include published recipes and extract the recipe objects
  const recipes = favoriteRecipes
    .filter((favorite) => favorite.favoritedRecipe?.published === true)
    .map((favorite) => favorite.favoritedRecipe);

  return recipes;
}

/**
 * Checks if a recipe is favorited by the current user.
 * @param recipeId - The recipe ID to check
 * @returns True if the recipe is favorited, false otherwise
 */
export async function isFavoriteRecipe(recipeId: number): Promise<boolean> {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  const favoriteRecipe = await db.query.FavoritesTable.findFirst({
    where: (model, { and, eq }) =>
      and(eq(model.userId, user.userId), eq(model.recipeId, recipeId)),
  });

  return !!favoriteRecipe;
}

/**
 * Adds a recipe to the current user's favorites.
 * @param recipeId - The recipe ID to favorite
 */
export async function createFavoriteRecipe(recipeId: number): Promise<void> {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db.insert(FavoritesTable).values({
    userId: user.userId,
    recipeId,
  });

  revalidateRecipePaths();
}

/**
 * Removes a recipe from the current user's favorites.
 * @param recipeId - The recipe ID to unfavorite
 */
export async function removeFavoriteRecipe(recipeId: number): Promise<void> {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db
    .delete(FavoritesTable)
    .where(
      and(
        eq(FavoritesTable.userId, user.userId),
        eq(FavoritesTable.recipeId, recipeId),
      ),
    );

  revalidateRecipePaths();
}
