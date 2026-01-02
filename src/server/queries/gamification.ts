import "server-only";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { PointsTable, AchievementsTable, BadgesTable } from "../db/schemas";

// Calculate required XP for a given level
function calculateRequiredXp(level: number): number {
  // Simple exponential curve: 100 * level^1.5
  return Math.floor(100 * Math.pow(level, 1.5));
}

// Initialize a user in the points table if they don't exist
export async function initializeUserPoints(userId: string) {
  const existingEntry = await db.query.PointsTable.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  if (!existingEntry) {
    // Create new entry with 0 points, level 1
    await db.insert(PointsTable).values({
      userId,
      points: 0,
      level: 1,
      xpForCurrentLevel: 0,
      nextLevelXp: 100,
    });
    return true; // Indicates a new entry was created
  }

  return false; // No new entry was needed
}

// Points queries
export async function getUserPoints(userId: string) {
  // Make sure user exists in points table
  await initializeUserPoints(userId);

  // Then get their points
  const points = await db.query.PointsTable.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
    columns: { points: true }, // Only select the points column
  });
  return points?.points ?? 0;
}

export async function getUserProgress(userId: string) {
  // Make sure user exists in points table
  await initializeUserPoints(userId);

  // Get user progress entry
  const progress = await db.query.PointsTable.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  // This should never be null now, but keeping the check for safety
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

// Admin function to manually set a user's points
export async function setUserPoints(userId: string, newPointsTotal: number) {
  // Make sure user exists in points table
  await initializeUserPoints(userId);

  // Get current user data to calculate level
  const user = await db.query.PointsTable.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  if (!user) return; // Should never happen due to initializeUserPoints

  // Calculate new level and xp
  let level = 1;
  let remainingPoints = newPointsTotal;
  let nextLevelXp = calculateRequiredXp(level);

  // Find the appropriate level based on total points
  while (remainingPoints >= nextLevelXp) {
    remainingPoints -= nextLevelXp;
    level += 1;
    nextLevelXp = calculateRequiredXp(level);
  }

  // Update with new values
  await db
    .update(PointsTable)
    .set({
      points: newPointsTotal,
      level,
      xpForCurrentLevel: remainingPoints,
      nextLevelXp,
    })
    .where(eq(PointsTable.userId, userId));

  // Revalidate paths
  revalidatePath("/profile", "page");
  revalidatePath("/kitchen-journey", "page");
  revalidatePath("/", "layout"); // For the badge in the layout
  revalidatePath("/", "page"); // Ensure the top nav is refreshed
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
