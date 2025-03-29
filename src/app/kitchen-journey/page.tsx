"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  fetchUserProgress,
  adminSetUserPoints,
} from "~/app/_actions/gamification";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

const KitchenJourney = () => {
  // User progress state
  const [userProgress, setUserProgress] = useState({
    xp: 0,
    level: 1,
    nextLevelXp: 100,
  });
  const [badges, setBadges] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Admin form state
  const [isAdmin, setIsAdmin] = useState(false);
  const [targetUserId, setTargetUserId] = useState("");
  const [pointsToSet, setPointsToSet] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [recentUsers, setRecentUsers] = useState<string[]>([]);

  const { user } = useUser();

  useEffect(() => {
    async function loadUserProgress() {
      try {
        // Load progress from API
        const progress = await fetchUserProgress();
        setUserProgress(progress);

        // Fetch badges and activity (placeholder)
        const savedBadges = JSON.parse(localStorage.getItem("badges") || "[]");
        const savedActivity = JSON.parse(
          localStorage.getItem("recentActivity") || "[]",
        );

        setBadges(savedBadges);
        setRecentActivity(savedActivity);

        // Check if user is admin directly from publicMetadata
        if (user?.publicMetadata?.role === "admin") {
          setIsAdmin(true);

          // Set current user ID in the form
          if (user?.id) {
            setTargetUserId(user.id);
            // Pre-fill with current points
            setPointsToSet(progress.xp);
          }

          // Load recent users from localStorage
          const savedRecentUsers = localStorage.getItem("recentUserIds");
          if (savedRecentUsers) {
            setRecentUsers(JSON.parse(savedRecentUsers));
          }
        }
      } catch (error) {
        console.error("Error loading user progress:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      loadUserProgress();
    }
  }, [user]);

  // Admin handler to update points - update to refresh TopNav
  const handleSetPoints = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetUserId.trim()) {
      toast.error("Please enter a user ID");
      return;
    }

    try {
      setIsUpdating(true);
      await adminSetUserPoints(targetUserId, pointsToSet);
      toast.success(
        `Updated points for user ${targetUserId} to ${pointsToSet}`,
      );

      // If updating own points, refresh the display
      if (targetUserId === user?.id) {
        const progress = await fetchUserProgress();
        setUserProgress(progress);
      }

      // Save to recent users
      saveToRecentUsers(targetUserId);
    } catch (error) {
      toast.error(`Failed to update points: ${(error as Error).message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Save a user ID to the recent users list
  const saveToRecentUsers = (id: string) => {
    if (!id || recentUsers.includes(id)) return;

    const updatedRecentUsers = [
      id,
      ...recentUsers.filter((uid) => uid !== id).slice(0, 3),
    ]; // Keep max 4 users
    setRecentUsers(updatedRecentUsers);
    localStorage.setItem("recentUserIds", JSON.stringify(updatedRecentUsers));
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading your journey...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-10">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Your Kitchen Journey</h1>

        {/* User Overview */}
        <div className="mb-6 rounded-lg bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">
            🏆 Level: {userProgress.level}
          </h2>
          <p className="text-sm text-gray-600">
            XP: {userProgress.xp}/{userProgress.nextLevelXp}
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-green-500"
              style={{
                width: `${Math.min(100, (userProgress.xp / userProgress.nextLevelXp) * 100)}%`,
              }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Rank:{" "}
            {userProgress.level >= 5
              ? "Culinary Legend"
              : userProgress.level >= 3
                ? "Kitchen Warrior"
                : "Aspiring Chef"}
          </p>
        </div>

        {/* Recent Activity */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold">📜 Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <ul className="list-disc pl-5">
              {recentActivity.map((item, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              No recent activity yet. Try a recipe!
            </p>
          )}
        </div>

        {/* Badges & Achievements */}
        <div>
          <h2 className="text-lg font-semibold">🎖 Badges Earned</h2>
          <Link href="/kitchen-journey/badges">View all badges</Link>
          {badges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className="rounded-full bg-yellow-300 px-3 py-1 text-sm font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No badges yet. Start cooking!
            </p>
          )}
        </div>
      </div>

      {/* Admin Points Management (only visible to admins) */}
      {isAdmin && (
        <div className="rounded-lg border-2 border-amber-200 bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
              ADMIN
            </span>
            <h2 className="text-xl font-bold">Manage User Points</h2>
          </div>

          <form onSubmit={handleSetPoints} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="userId" className="block text-sm font-medium">
                User ID
              </label>
              <Input
                id="userId"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                placeholder="Enter user ID"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="points" className="block text-sm font-medium">
                Total Points (New Value)
              </label>
              <Input
                id="points"
                type="number"
                min="0"
                value={pointsToSet}
                onChange={(e) => setPointsToSet(parseInt(e.target.value) || 0)}
                placeholder="Enter new point value"
                required
              />
              <p className="text-xs text-gray-500">
                This sets the user's total points to the specified value. Level
                will be automatically calculated.
              </p>
            </div>

            <Button type="submit" disabled={isUpdating} className="w-full">
              {isUpdating ? "Updating..." : "Update User Points"}
            </Button>
          </form>

          {recentUsers.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium">Recent Users</h3>
              <div className="flex flex-wrap gap-2">
                {recentUsers.map((id) => (
                  <button
                    key={id}
                    onClick={() => setTargetUserId(id)}
                    className="rounded bg-gray-100 px-3 py-1 text-xs hover:bg-gray-200"
                  >
                    {id === user?.id ? "Me" : id}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KitchenJourney;
