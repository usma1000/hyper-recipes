import "server-only";
import { db } from "../db";
import { auth } from "@clerk/nextjs/server";
import { and, eq, inArray } from "drizzle-orm";
import { FavoritesTable, RecipesTable } from "../db/schemas";
import { revalidateRecipePaths } from "./utils";

export async function getMyFavoriteRecipes() {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  const favoriteRecipes = await db.query.FavoritesTable.findMany({
    where: (model, { and, eq }) =>
      and(
        eq(model.userId, user.userId),
        inArray(
          model.recipeId,
          db
            .select({ recipeId: RecipesTable.id })
            .from(RecipesTable)
            .where(eq(RecipesTable.published, true)),
        ),
      ),
    with: {
      favoritedRecipe: {
        with: {
          heroImage: true,
        },
      },
    },
  });
  const recipes = favoriteRecipes.map((favorite) => favorite.favoritedRecipe);
  return recipes;
}

export async function isFavoriteRecipe(recipeId: number) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  const favoriteRecipe = await db.query.FavoritesTable.findFirst({
    where: (model, { and, eq }) =>
      and(eq(model.userId, user.userId), eq(model.recipeId, recipeId)),
  });

  return !!favoriteRecipe;
}

export async function createFavoriteRecipe(recipeId: number) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db.insert(FavoritesTable).values({
    userId: user.userId,
    recipeId,
  });

  revalidateRecipePaths();
}

export async function removeFavoriteRecipe(recipeId: number) {
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
