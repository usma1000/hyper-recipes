"use server";

import { auth } from "@clerk/nextjs/server";
import {
  getCookingHistoryByRecipeId,
  getPublicCheckIns,
  getRecipeCookStats,
  getRecentCookingSessionsForUser,
  saveCookingSession,
  updateCookingSessionRating,
  type PublicCheckIn,
  type RecipeCookStats,
  type SaveCookingSessionResult,
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
 * Saves a new cooking session for a recipe and returns reward payload.
 * @param recipeId - The recipe ID
 * @param rating - The rating (0-5, supports half stars)
 * @param timeMinutes - The cooking time in minutes
 * @param notes - Optional notes about the cooking session
 * @param isPublic - Whether to share with the community (default true)
 * @returns Session id and gamification rewards
 */
export async function saveCookingSessionAction(
  recipeId: number,
  rating: number,
  timeMinutes: number,
  notes?: string,
  isPublic = true,
): Promise<SaveCookingSessionResult> {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (rating < 0.5 || rating > 5) {
    throw new Error("Rating must be between 0.5 and 5");
  }

  if (timeMinutes < 1) {
    throw new Error("Cooking time must be at least 1 minute");
  }

  return await saveCookingSession(
    recipeId,
    userId,
    rating,
    timeMinutes,
    notes,
    isPublic,
  );
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

/**
 * Fetches public cook stats for a recipe (no auth required).
 * @param recipeId - The recipe ID
 * @returns Cook count and average rating
 */
export async function fetchRecipeCookStats(
  recipeId: number,
): Promise<RecipeCookStats> {
  return await getRecipeCookStats(recipeId);
}

/**
 * Fetches public check-ins for a recipe (no auth required).
 * @param recipeId - The recipe ID
 * @param limit - Max check-ins to return
 * @returns Public check-ins with display names
 */
export async function fetchPublicCheckIns(
  recipeId: number,
  limit = 20,
): Promise<PublicCheckIn[]> {
  return await getPublicCheckIns(recipeId, limit);
}

/**
 * Fetches the current user's recent cooking sessions across recipes.
 * @param limit - Max sessions to return
 * @returns Recent sessions with recipe metadata
 */
export async function fetchMyRecentCookingSessions(limit = 10) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return await getRecentCookingSessionsForUser(userId, limit);
}
