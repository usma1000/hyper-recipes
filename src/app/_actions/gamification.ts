"use server";

import { auth } from "@clerk/nextjs/server";
import { getUserProgress, addUserPoints } from "~/server/queries/gamification";

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
