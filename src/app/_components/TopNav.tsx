"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CommandSearch } from "./CommandSearch";
import { Button, buttonVariants } from "@/components/ui/button";
import { LayoutDashboard, PlusCircle, Trophy, Zap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// This would typically come from your API
async function fetchUserProgress() {
  // Replace with actual API call
  // Example: return await fetch('/api/user-progress').then(res => res.json());

  // Mocked response for now
  return new Promise<{ xp: number; level: number; nextLevelXp: number }>(
    (resolve) => {
      setTimeout(() => {
        resolve({
          xp: 240,
          level: 5,
          nextLevelXp: 1000,
        });
      }, 500);
    },
  );
}

export default function TopNav() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const [progress, setProgress] = useState({
    xp: 0,
    level: 1,
    nextLevelXp: 100,
    percentage: 0,
  });

  useEffect(() => {
    if (user) {
      fetchUserProgress().then((data) => {
        const percentage = Math.min(
          100,
          Math.max(0, Math.round((data.xp / data.nextLevelXp) * 100)),
        );
        setProgress({
          ...data,
          percentage,
        });
      });
    }
  }, [user]);

  return (
    <div className="border-b border-slate-200 bg-white py-4 text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50">
      <nav className="container flex items-center justify-between font-semibold">
        <Link href="/" className="flex align-middle text-xl font-semibold">
          <Zap size={16} className="fill-yellow-300" />
          Hyper Recipe
        </Link>

        <CommandSearch />

        <div className="flex items-center gap-4">
          <SignedOut>
            <Button>
              <SignInButton mode="modal" />
            </Button>
          </SignedOut>
          <SignedIn>
            {isAdmin && (
              <>
                <Link
                  href="/new-recipe"
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                  })}
                >
                  <PlusCircle size={16} className="mr-2" />
                  New Recipe
                </Link>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  <LayoutDashboard size={24} />
                </Link>
              </>
            )}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/kitchen-journey"
                    className="flex items-center gap-1.5"
                  >
                    <div
                      className="group relative flex h-9 w-9 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(rgb(34 197 94) ${progress.percentage}%, rgb(226 232 240) ${progress.percentage}%)`,
                      }}
                    >
                      <div className="absolute inset-[2px] flex items-center justify-center rounded-full bg-white transition-transform dark:bg-slate-950">
                        <Trophy className="h-5 w-5 fill-yellow-300 dark:fill-yellow-300" />
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      Lvl {progress.level}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="py-2 text-center">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">
                      Level {progress.level}
                    </p>
                    <p className="-mt-0.5 text-xs text-muted-foreground">
                      {progress.xp}/{progress.nextLevelXp} XP
                    </p>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-500">
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </nav>
    </div>
  );
}
