"use server";

import { auth } from "@clerk/nextjs/server";
import {
  getCookingHistoryByRecipeId,
  saveCookingSession,
  updateCookingSessionRating,
} from "~/server/queries/cookingHistory";

/**
 * Fetches cooking history for a specific recipe for the current user.
 * @param recipeId - The recipe ID
 * @returns Array of cooking sessions ordered by cookedAt descending
 */
export async function fetchCookingHistory(recipeId: number) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return await getCookingHistoryByRecipeId(recipeId, userId);
}

/**
 * Saves a new cooking session for a recipe.
 * @param recipeId - The recipe ID
 * @param rating - The rating (0-5, supports half stars)
 * @param timeMinutes - The cooking time in minutes
 * @param notes - Optional notes about the cooking session
 */
export async function saveCookingSessionAction(
  recipeId: number,
  rating: number,
  timeMinutes: number,
  notes?: string,
): Promise<void> {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  await saveCookingSession(recipeId, userId, rating, timeMinutes, notes);
}

/**
 * Updates the rating for an existing cooking session.
 * @param sessionId - The cooking session ID
 * @param rating - The new rating (0-5, supports half stars)
 */
export async function updateCookingSessionRatingAction(
  sessionId: number,
  rating: number,
): Promise<void> {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  await updateCookingSessionRating(sessionId, userId, rating);
}
