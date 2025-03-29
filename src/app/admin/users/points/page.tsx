"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminSetUserPoints } from "~/app/_actions/gamification";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

export default function AdminUserPointsPage() {
  const [userId, setUserId] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recentUsers, setRecentUsers] = useState<string[]>([]);
  const router = useRouter();

  // Load recent users from local storage
  useEffect(() => {
    const savedRecentUsers = localStorage.getItem("recentUserIds");
    if (savedRecentUsers) {
      setRecentUsers(JSON.parse(savedRecentUsers));
    }
  }, []);

  // Save a user ID to the recent users list
  const saveToRecentUsers = (id: string) => {
    // Don't add if it's already in the list or empty
    if (!id || recentUsers.includes(id)) return;

    const updatedRecentUsers = [id, ...recentUsers.slice(0, 4)]; // Keep max 5 users
    setRecentUsers(updatedRecentUsers);
    localStorage.setItem("recentUserIds", JSON.stringify(updatedRecentUsers));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId.trim()) {
      toast.error("Please enter a user ID");
      return;
    }

    try {
      setIsLoading(true);
      await adminSetUserPoints(userId, points);
      toast.success(`Updated points for user ${userId} to ${points}`);
      saveToRecentUsers(userId);
    } catch (error) {
      toast.error(`Failed to update points: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRecentUser = (id: string) => {
    setUserId(id);
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold">Manage User Points</h1>

      <div className="mb-6 rounded-lg bg-amber-50 p-4">
        <h2 className="font-semibold text-amber-800">Admin Only Feature</h2>
        <p className="text-sm text-amber-700">
          This page allows administrators to manually adjust user points. Use
          with caution as this directly impacts gamification progress.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="userId" className="block text-sm font-medium">
            User ID
          </label>
          <Input
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
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
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
            placeholder="Enter new point value"
            required
          />
          <p className="text-xs text-gray-500">
            This sets the user's total points to the specified value. Level will
            be automatically calculated.
          </p>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Updating..." : "Update User Points"}
        </Button>
      </form>

      {recentUsers.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-2 font-medium">Recent Users</h2>
          <div className="flex flex-wrap gap-2">
            {recentUsers.map((id) => (
              <button
                key={id}
                onClick={() => handleSelectRecentUser(id)}
                className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
