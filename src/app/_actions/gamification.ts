"use server";

import { auth } from "@clerk/nextjs/server";
import { checkRole } from "~/utils/roles";
import {
  getUserProgress,
  addUserPoints,
  initializeUserPoints,
  setUserPoints,
  getUserGamificationProfile,
  getUserBadges,
} from "~/server/queries/gamification";
import { getUserCheckInCount } from "~/server/queries/cookingHistory";
import { BADGE_DEFINITIONS } from "~/server/gamification/badgeDefinitions";

export async function initializeUser() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return await initializeUserPoints(userId);
}

export async function fetchUserProgress() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return await getUserProgress(userId);
}

/**
 * Fetches progress, badges, achievements, and check-in count for Kitchen Journey.
 */
export async function fetchKitchenJourneyData() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const [profile, progress, checkInCount] = await Promise.all([
    getUserGamificationProfile(userId),
    getUserProgress(userId),
    getUserCheckInCount(userId),
  ]);

  return {
    progress,
    points: profile.points,
    badges: profile.badges,
    achievements: profile.achievements,
    checkInCount,
  };
}

/**
 * Returns badge catalog with earned state for the current user.
 */
export async function fetchBadgeCatalog() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const earned = await getUserBadges(userId);
  const earnedNames = new Set(earned.map((b) => b.badgeName));

  return BADGE_DEFINITIONS.map((badge) => ({
    name: badge.name,
    description: badge.description,
    category: badge.category,
    imagePath: badge.imagePath,
    isEarned: earnedNames.has(badge.name),
    earnedAt:
      earned.find((b) => b.badgeName === badge.name)?.earnedAt ?? null,
  }));
}

export async function awardUserPoints(points: number) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  await addUserPoints(userId, points);
}

// Admin-only action to set a user's points to a specific value
export async function adminSetUserPoints(targetUserId: string, points: number) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const isAdmin = await checkRole("admin");

  if (!isAdmin) {
    throw new Error("Not authorized. Admin privileges required.");
  }

  await setUserPoints(targetUserId, points);
}
