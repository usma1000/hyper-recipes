import "server-only";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { PointsTable, AchievementsTable, BadgesTable } from "../db/schemas";

// Points queries
export async function getUserPoints(userId: string) {
  // First check if user entry exists
  const points = await db.query.PointsTable.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
    columns: { points: true }, // Only select the points column
  });
  return points?.points ?? 0;
}

export async function addUserPoints(userId: string, pointsToAdd: number) {
  const existingEntry = await db.query.PointsTable.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  if (existingEntry) {
    // Update existing entry
    await db
      .update(PointsTable)
      .set({ points: existingEntry.points + pointsToAdd })
      .where(eq(PointsTable.userId, userId));
  } else {
    // Create new entry
    await db.insert(PointsTable).values({
      userId,
      points: pointsToAdd,
    });
  }

  // Consider selective path revalidation if this changes UI
  revalidatePath("/profile", "page");
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
