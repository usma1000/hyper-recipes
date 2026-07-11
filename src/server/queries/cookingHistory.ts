import "server-only";
import { db } from "../db";
import { and, avg, count, desc, eq } from "drizzle-orm";
import { CookingSessionsTable, RecipesTable } from "../db/schemas";
import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import {
  awardCheckInRewards,
  type CheckInRewardResult,
} from "./gamification";

export interface RecipeCookStats {
  cookCount: number;
  avgRating: number | null;
}

export interface PublicCheckIn {
  id: number;
  rating: number;
  timeMinutes: number;
  notes: string | null;
  cookedAt: Date;
  displayName: string;
}

export interface SaveCookingSessionResult {
  sessionId: number;
  rewards: CheckInRewardResult;
}

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
 * Returns aggregate cook count and average rating for a recipe.
 * @param recipeId - The recipe ID
 * @returns Cook stats including count and average rating
 */
export async function getRecipeCookStats(
  recipeId: number,
): Promise<RecipeCookStats> {
  const [row] = await db
    .select({
      cookCount: count(),
      avgRating: avg(CookingSessionsTable.rating),
    })
    .from(CookingSessionsTable)
    .where(eq(CookingSessionsTable.recipeId, recipeId));

  const cookCount = Number(row?.cookCount ?? 0);
  const avgRaw = row?.avgRating;
  const avgRating =
    avgRaw == null ? null : Math.round(Number(avgRaw) * 10) / 10;

  return { cookCount, avgRating };
}

/**
 * Resolves Clerk display names for a set of user IDs.
 * @param userIds - Unique Clerk user IDs
 * @returns Map of userId to display name
 */
async function resolveDisplayNames(
  userIds: string[],
): Promise<Map<string, string>> {
  const names = new Map<string, string>();
  if (userIds.length === 0) {
    return names;
  }

  await Promise.all(
    userIds.map(async (userId) => {
      try {
        const user = await clerkClient.users.getUser(userId);
        const fullName = [user.firstName, user.lastName]
          .filter(Boolean)
          .join(" ");
        names.set(
          userId,
          (fullName.length > 0 ? fullName : null) ??
            user.username ??
            user.emailAddresses[0]?.emailAddress ??
            "Cook",
        );
      } catch {
        names.set(userId, "Cook");
      }
    }),
  );

  return names;
}

/**
 * Fetches public check-ins for a recipe with display names.
 * @param recipeId - The recipe ID
 * @param limit - Max number of check-ins to return
 * @returns Public check-ins ordered by cookedAt descending
 */
export async function getPublicCheckIns(
  recipeId: number,
  limit = 20,
): Promise<PublicCheckIn[]> {
  const sessions = await db.query.CookingSessionsTable.findMany({
    where: (model, { and, eq }) =>
      and(eq(model.recipeId, recipeId), eq(model.isPublic, true)),
    orderBy: (model, { desc }) => desc(model.cookedAt),
    limit,
  });

  const uniqueUserIds = [...new Set(sessions.map((s) => s.userId))];
  const displayNames = await resolveDisplayNames(uniqueUserIds);

  return sessions.map((session) => ({
    id: session.id,
    rating: session.rating,
    timeMinutes: session.timeMinutes,
    notes: session.notes,
    cookedAt: session.cookedAt,
    displayName: displayNames.get(session.userId) ?? "Cook",
  }));
}

/**
 * Fetches recent cooking sessions for a user across all recipes.
 * @param userId - The user ID
 * @param limit - Max sessions to return
 * @returns Recent sessions with recipe name and slug
 */
export async function getRecentCookingSessionsForUser(
  userId: string,
  limit = 10,
) {
  const sessions = await db
    .select({
      id: CookingSessionsTable.id,
      rating: CookingSessionsTable.rating,
      timeMinutes: CookingSessionsTable.timeMinutes,
      notes: CookingSessionsTable.notes,
      cookedAt: CookingSessionsTable.cookedAt,
      recipeId: CookingSessionsTable.recipeId,
      recipeName: RecipesTable.name,
      recipeSlug: RecipesTable.slug,
    })
    .from(CookingSessionsTable)
    .innerJoin(
      RecipesTable,
      eq(CookingSessionsTable.recipeId, RecipesTable.id),
    )
    .where(eq(CookingSessionsTable.userId, userId))
    .orderBy(desc(CookingSessionsTable.cookedAt))
    .limit(limit);

  return sessions;
}

/**
 * Counts total cooking sessions for a user.
 * @param userId - The user ID
 * @returns Total check-in count
 */
export async function getUserCheckInCount(userId: string): Promise<number> {
  const [row] = await db
    .select({ total: count() })
    .from(CookingSessionsTable)
    .where(eq(CookingSessionsTable.userId, userId));

  return Number(row?.total ?? 0);
}

/**
 * Saves a new cooking session and awards check-in rewards.
 * @param recipeId - The recipe ID
 * @param userId - The user ID
 * @param rating - The rating (0-5, supports half stars)
 * @param timeMinutes - The cooking time in minutes
 * @param notes - Optional notes about the cooking session
 * @param isPublic - Whether to share with the community
 * @returns Session id and reward payload
 */
export async function saveCookingSession(
  recipeId: number,
  userId: string,
  rating: number,
  timeMinutes: number,
  notes?: string,
  isPublic = true,
): Promise<SaveCookingSessionResult> {
  const [inserted] = await db
    .insert(CookingSessionsTable)
    .values({
      recipeId,
      userId,
      rating,
      timeMinutes,
      notes: notes ?? null,
      isPublic,
    })
    .returning({ id: CookingSessionsTable.id });

  const checkInCount = await getUserCheckInCount(userId);
  const rewards = await awardCheckInRewards(userId, checkInCount);

  const recipe = await db.query.RecipesTable.findFirst({
    where: (model, { eq }) => eq(model.id, recipeId),
    columns: { slug: true },
  });

  if (recipe?.slug) {
    revalidatePath(`/recipe/${recipe.slug}`);
  }
  revalidatePath("/kitchen-journey");
  revalidatePath("/kitchen-journey/badges");

  return {
    sessionId: inserted!.id,
    rewards,
  };
}

/**
 * Updates the rating for an existing cooking session.
 * @param sessionId - The cooking session ID
 * @param userId - The user ID (for authorization)
 * @param rating - The new rating (0-5, supports half stars)
 */
export async function updateCookingSessionRating(
  sessionId: number,
  userId: string,
  rating: number,
): Promise<void> {
  await db
    .update(CookingSessionsTable)
    .set({ rating })
    .where(
      and(
        eq(CookingSessionsTable.id, sessionId),
        eq(CookingSessionsTable.userId, userId),
      ),
    );

  revalidatePath(`/recipe/[slug]`, "page");
}
