import "server-only";
import { db } from "../db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { IngredientsTable, RecipeIngredientsTable } from "../db/schemas";
import { revalidateRecipePaths } from "./utils";

type newIngredient = typeof IngredientsTable.$inferInsert;

export async function createNewIngredient(ingredient: newIngredient) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db.insert(IngredientsTable).values(ingredient);

  revalidatePath("/dashboard", "page");
}

export async function getAllIngredients() {
  const ingredients = await db.query.IngredientsTable.findMany();
  return ingredients;
}

export async function getAllIngredientNames() {
  const ingredients = await db.query.IngredientsTable.findMany({
    columns: {
      name: true,
    },
  });
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

export async function createIngredientForRecipe(
  recipeId: number,
  ingredientId: number,
  quantity: string,
) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  try {
    await db.insert(RecipeIngredientsTable).values({
      recipeId,
      ingredientId,
      quantity,
    });

    revalidateRecipePaths();
    return { success: true };
  } catch (error) {
    console.error("Failed to create ingredient for recipe:", error);
    throw new Error("Failed to add ingredient to recipe");
  }
}

export async function removeIngredientFromRecipe(
  recipeId: number,
  ingredientId: number,
) {
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
    return { success: true };
  } catch (error) {
    console.error("Failed to remove ingredient from recipe:", error);
    throw new Error("Failed to remove ingredient from recipe");
  }
}

/**
 * Batch add multiple ingredients to a recipe in a single transaction
 */
export async function batchAddIngredientsToRecipe(
  recipeId: number,
  ingredients: { ingredientId: number; quantity: string }[],
) {
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
    return { success: true, count: ingredients.length };
  } catch (error) {
    console.error("Failed to batch add ingredients:", error);
    throw new Error("Failed to add ingredients to recipe");
  }
}
