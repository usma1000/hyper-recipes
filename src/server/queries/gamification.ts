import "server-only";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { PointsTable, AchievementsTable, BadgesTable } from "../db/schemas";

// Calculate required XP for a given level
function calculateRequiredXp(level: number): number {
  // Simple exponential curve: 100 * level^1.5
  return Math.floor(100 * Math.pow(level, 1.5));
}

// Points queries
export async function getUserPoints(userId: string) {
  // First check if user entry exists
  const points = await db.query.PointsTable.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
    columns: { points: true }, // Only select the points column
  });
  return points?.points ?? 0;
}

export async function getUserProgress(userId: string) {
  // Get user progress entry
  const progress = await db.query.PointsTable.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  if (!progress) {
    // Return default values for new users
    return {
      xp: 0,
      level: 1,
      nextLevelXp: 100,
    };
  }

  return {
    xp: progress.xpForCurrentLevel,
    level: progress.level,
    nextLevelXp: progress.nextLevelXp,
  };
}

export async function addUserPoints(userId: string, pointsToAdd: number) {
  const existingEntry = await db.query.PointsTable.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  if (existingEntry) {
    // Update logic with level progression
    let { points, level, xpForCurrentLevel, nextLevelXp } = existingEntry;
    points += pointsToAdd;
    xpForCurrentLevel += pointsToAdd;

    // Check if user leveled up
    while (xpForCurrentLevel >= nextLevelXp) {
      xpForCurrentLevel -= nextLevelXp;
      level += 1;
      nextLevelXp = calculateRequiredXp(level);
    }

    // Update with new values
    await db
      .update(PointsTable)
      .set({
        points,
        level,
        xpForCurrentLevel,
        nextLevelXp,
      })
      .where(eq(PointsTable.userId, userId));
  } else {
    // Create new entry
    await db.insert(PointsTable).values({
      userId,
      points: pointsToAdd,
      level: 1,
      xpForCurrentLevel: pointsToAdd,
      nextLevelXp: 100,
    });
  }

  // Consider selective path revalidation if this changes UI
  revalidatePath("/profile", "page");
  revalidatePath("/", "layout"); // For the badge in the layout
}

// Achievements queries
export async function getUserAchievements(userId: string) {
  return await db.query.AchievementsTable.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
    orderBy: (model, { desc }) => desc(model.earnedAt),
  });
}

export async function addUserAchievement(
  userId: string,
  title: string,
  description?: string,
) {
  await db.insert(AchievementsTable).values({
    userId,
    title,
    description,
  });

  // Consider selective path revalidation
  revalidatePath("/profile", "page");
}

// Badges queries
export async function getUserBadges(userId: string) {
  return await db.query.BadgesTable.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
    orderBy: (model, { desc }) => desc(model.earnedAt),
  });
}

export async function addUserBadge(userId: string, badgeName: string) {
  // Check if badge already exists to avoid duplicates
  const existingBadge = await db.query.BadgesTable.findFirst({
    where: (model, { and, eq }) =>
      and(eq(model.userId, userId), eq(model.badgeName, badgeName)),
  });

  if (!existingBadge) {
    await db.insert(BadgesTable).values({
      userId,
      badgeName,
    });

    // Consider selective path revalidation
    revalidatePath("/profile", "page");
  }
}

// Add a combined query for profile data to reduce multiple DB calls
export async function getUserGamificationProfile(userId: string) {
  const [points, achievements, badges] = await Promise.all([
    getUserPoints(userId),
    getUserAchievements(userId),
    getUserBadges(userId),
  ]);

  return {
    points,
    achievements,
    badges,
  };
}
