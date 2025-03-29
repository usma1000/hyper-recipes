"use server";

import { auth } from "@clerk/nextjs/server";
import { checkRole } from "~/utils/roles";
import {
  getUserProgress,
  addUserPoints,
  initializeUserPoints,
  setUserPoints,
} from "~/server/queries/gamification";

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

  // Check if the current user is an admin using the utility function
  const isAdmin = await checkRole("admin");

  if (!isAdmin) {
    throw new Error("Not authorized. Admin privileges required.");
  }

  await setUserPoints(targetUserId, points);
}

// No need for a separate checkIfUserIsAdmin function as we're using checkRole directly
