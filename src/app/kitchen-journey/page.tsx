"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const KitchenJourney = () => {
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Simulated data fetch from localStorage (replace with API call later)
    const savedPoints = parseInt(localStorage.getItem("points") || "0", 10);
    const savedBadges = JSON.parse(localStorage.getItem("badges") || "[]");
    const savedActivity = JSON.parse(
      localStorage.getItem("recentActivity") || "[]",
    );

    setPoints(savedPoints);
    setBadges(savedBadges);
    setRecentActivity(savedActivity);
  }, []);

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Your Kitchen Journey</h1>

      {/* User Overview */}
      <div className="mb-6 rounded-lg bg-gray-100 p-4">
        <h2 className="text-lg font-semibold">🏆 Total Points: {points}</h2>
        <p className="text-sm text-gray-600">
          Rank:{" "}
          {points >= 50
            ? "Culinary Legend"
            : points >= 25
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
          <p className="text-sm text-gray-500">No badges yet. Start cooking!</p>
        )}
      </div>
    </div>
  );
};

export default KitchenJourney;
