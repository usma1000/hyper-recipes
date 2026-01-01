"use client";

import { useUser } from "@clerk/nextjs";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchUserProgress } from "../_actions/gamification";

/**
 * Returns a time-aware greeting based on the current hour.
 */
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/**
 * Compact greeting bar for logged-in users.
 * Displays personalized greeting with Kitchen Journey progress.
 */
export function GreetingBar(): JSX.Element {
  const { user } = useUser();
  const [progress, setProgress] = useState({ level: 1, percentage: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const displayName = user?.firstName || user?.username || "Chef";
  const greeting = getTimeBasedGreeting();

  useEffect(() => {
    if (user) {
      fetchUserProgress()
        .then((data) => {
          const percentage = Math.min(
            100,
            Math.max(0, Math.round((data.xp / data.nextLevelXp) * 100))
          );
          setProgress({ level: data.level, percentage });
        })
        .catch((error) => {
          console.error("Failed to fetch user progress:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user]);

  return (
    <div className="flex items-center justify-between py-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          {greeting}, {displayName}
        </h1>
        <p className="mt-1 text-slate-500">What are you cooking today?</p>
      </div>
      
      <Link 
        href="/kitchen-journey" 
        className="flex items-center gap-3 rounded-full bg-slate-50 px-4 py-2 transition-colors hover:bg-slate-100"
      >
        <div
          className="relative flex h-10 w-10 items-center justify-center rounded-full"
          style={{
            background: isLoading
              ? "rgb(226 232 240)"
              : `conic-gradient(rgb(34 197 94) ${progress.percentage}%, rgb(226 232 240) ${progress.percentage}%)`,
          }}
        >
          <div className="absolute inset-[2px] flex items-center justify-center rounded-full bg-white">
            <Trophy className="h-5 w-5 fill-yellow-300" />
          </div>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-slate-900">Level {progress.level}</p>
          <p className="text-xs text-slate-500">Kitchen Journey</p>
        </div>
      </Link>
    </div>
  );
}

