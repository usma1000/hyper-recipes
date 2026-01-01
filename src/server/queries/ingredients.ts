import "server-only";
import { db } from "../db";
import { auth } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";
import { and, eq } from "drizzle-orm";
import { IngredientsTable, RecipeIngredientsTable } from "../db/schemas";
import { revalidateRecipePaths, revalidateIngredientCache } from "./utils";

type newIngredient = typeof IngredientsTable.$inferInsert;

export async function createNewIngredient(ingredient: newIngredient): Promise<void> {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db.insert(IngredientsTable).values(ingredient);

  revalidateIngredientCache();
}

/**
 * Fetches all ingredients for admin dropdowns.
 * Cached for 5 minutes, invalidated via "ingredients" tag.
 */
export const getAllIngredients = unstable_cache(
  async () => {
    const ingredients = await db.query.IngredientsTable.findMany();
    return ingredients;
  },
  ["all-ingredients"],
  { revalidate: 300, tags: ["ingredients"] }
);

/**
 * Fetches all ingredient names for search/autocomplete.
 * Cached for 5 minutes, invalidated via "ingredients" tag.
 */
export const getAllIngredientNames = unstable_cache(
  async () => {
    const ingredients = await db.query.IngredientsTable.findMany({
      columns: {
        name: true,
      },
    });
    return ingredients;
  },
  ["all-ingredient-names"],
  { revalidate: 300, tags: ["ingredients"] }
);

/**
 * Fetches ingredients for a specific recipe.
 * Cached for 60 seconds, invalidated via "ingredients" tag.
 * @param recipeId - The recipe ID
 */
export const getIngredientsForRecipe = unstable_cache(
  async (recipeId: number) => {
    const ingredients = await db.query.RecipeIngredientsTable.findMany({
      where: (model, { eq }) => eq(model.recipeId, recipeId),
      with: {
        ingredient: true,
      },
    });

    return ingredients;
  },
  ["ingredients-for-recipe"],
  { revalidate: 60, tags: ["ingredients"] }
);

export async function createIngredientForRecipe(
  recipeId: number,
  ingredientId: number,
  quantity: string,
): Promise<{ success: boolean }> {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  try {
    await db.insert(RecipeIngredientsTable).values({
      recipeId,
      ingredientId,
      quantity,
    });

    revalidateRecipePaths();
    revalidateIngredientCache();
    return { success: true };
  } catch (error) {
    console.error("Failed to create ingredient for recipe:", error);
    throw new Error("Failed to add ingredient to recipe");
  }
}

export async function removeIngredientFromRecipe(
  recipeId: number,
  ingredientId: number,
): Promise<{ success: boolean }> {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  try {
    await db
      .delete(RecipeIngredientsTable)
      .where(
        and(
          eq(RecipeIngredientsTable.recipeId, recipeId),
          eq(RecipeIngredientsTable.ingredientId, ingredientId),
        ),
      );

    revalidateRecipePaths();
    revalidateIngredientCache();
    return { success: true };
  } catch (error) {
    console.error("Failed to remove ingredient from recipe:", error);
    throw new Error("Failed to remove ingredient from recipe");
  }
}

/**
 * Batch add multiple ingredients to a recipe in a single transaction.
 * @param recipeId - The recipe ID
 * @param ingredients - Array of ingredients with IDs and quantities
 */
export async function batchAddIngredientsToRecipe(
  recipeId: number,
  ingredients: { ingredientId: number; quantity: string }[],
): Promise<{ success: boolean; count: number }> {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  if (!ingredients.length) return { success: true, count: 0 };

  try {
    await db.transaction(async (tx) => {
      await tx.insert(RecipeIngredientsTable).values(
        ingredients.map(({ ingredientId, quantity }) => ({
          recipeId,
          ingredientId,
          quantity,
        })),
      );
    });

    revalidateRecipePaths();
    revalidateIngredientCache();
    return { success: true, count: ingredients.length };
  } catch (error) {
    console.error("Failed to batch add ingredients:", error);
    throw new Error("Failed to add ingredients to recipe");
  }
}
