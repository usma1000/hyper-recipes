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
import KitchenJourneyBadge from "./KitchenJourneyBadge";
import { fetchUserProgress } from "~/app/_actions/gamification";

export default function TopNav() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const [progress, setProgress] = useState({
    xp: 0,
    level: 1,
    nextLevelXp: 100,
    percentage: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

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
          console.error("Error fetching user progress:", error);
        })
        .finally(() => {
          setIsLoading(false);
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
            <KitchenJourneyBadge />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-500">
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </nav>
    </div>
  );
}
