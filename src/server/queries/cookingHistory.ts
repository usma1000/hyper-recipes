import "server-only";
import { db } from "../db";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { CookingSessionsTable } from "../db/schemas";
import { revalidatePath } from "next/cache";

/**
 * Fetches cooking history for a specific recipe and user.
 * @param recipeId - The recipe ID
 * @param userId - The user ID
 * @returns Array of cooking sessions ordered by cookedAt descending
 */
export async function getCookingHistoryByRecipeId(
  recipeId: number,
  userId: string,
) {
  const sessions = await db.query.CookingSessionsTable.findMany({
    where: (model, { and, eq }) =>
      and(eq(model.recipeId, recipeId), eq(model.userId, userId)),
    orderBy: (model, { desc }) => desc(model.cookedAt),
  });

  return sessions;
}

/**
 * Saves a new cooking session for a recipe.
 * @param recipeId - The recipe ID
 * @param userId - The user ID
 * @param rating - The rating (0-5, supports half stars)
 * @param timeMinutes - The cooking time in minutes
 * @param notes - Optional notes about the cooking session
 */
export async function saveCookingSession(
  recipeId: number,
  userId: string,
  rating: number,
  timeMinutes: number,
  notes?: string,
): Promise<void> {
  await db.insert(CookingSessionsTable).values({
    recipeId,
    userId,
    rating,
    timeMinutes,
    notes: notes || null,
  });

  revalidatePath(`/recipe/[slug]`, "page");
}

