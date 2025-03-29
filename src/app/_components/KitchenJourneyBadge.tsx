"use client";

import { Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUserProgress } from "../_actions/gamification";

export default function KitchenJourneyBadge() {
  const { user } = useUser();
  const [progress, setProgress] = useState({
    xp: 0,
    level: 1,
    nextLevelXp: 100,
    percentage: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchUserProgress()
        .then((data) => {
          const percentage = Math.min(
            100,
            Math.max(0, Math.round((data.xp / data.nextLevelXp) * 100)),
          );
          setProgress({
            ...data,
            percentage,
          });
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
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/kitchen-journey" className="flex items-center gap-1.5">
            <div
              className="group relative flex h-9 w-9 items-center justify-center rounded-full"
              style={{
                background: isLoading
                  ? "rgb(226 232 240)"
                  : `conic-gradient(rgb(34 197 94) ${progress.percentage}%, rgb(226 232 240) ${progress.percentage}%)`,
              }}
            >
              <div className="absolute inset-[2px] flex items-center justify-center rounded-full bg-white transition-transform dark:bg-slate-950">
                <Trophy className="h-5 w-5 fill-yellow-300 dark:fill-yellow-300" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-4 w-10" />
            ) : (
              <span className="text-sm font-semibold">
                Lvl {progress.level}
              </span>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="py-2 text-center">
          <div className="space-y-1">
            {isLoading ? (
              <>
                <Skeleton className="mx-auto h-4 w-20" />
                <Skeleton className="mx-auto h-3 w-16" />
                <Skeleton className="h-1.5 w-full" />
              </>
            ) : (
              <>
                <p className="text-sm font-semibold">Level {progress.level}</p>
                <p className="-mt-0.5 text-xs text-muted-foreground">
                  {progress.xp}/{progress.nextLevelXp} XP
                </p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
