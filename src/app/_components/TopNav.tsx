"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { CommandSearch } from "./CommandSearch";
import { Button, buttonVariants } from "@/components/ui/button";
import { LayoutDashboard, PlusCircle, Zap } from "lucide-react";
import KitchenJourneyBadge from "./KitchenJourneyBadge";

/**
 * Top navigation component.
 * Note: Gamification progress is fetched by KitchenJourneyBadge component
 * to avoid duplicate API calls.
 */
export default function TopNav(): JSX.Element {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <div className="border-b border-slate-200 bg-white py-3 text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 md:py-4">
      <nav className="container flex items-center justify-between gap-2 font-semibold md:gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-1 text-base font-semibold md:text-xl">
          <Zap size={16} className="fill-yellow-300" />
          <span className="hidden sm:inline">Hyper Recipe</span>
          <span className="sm:hidden">Hyper</span>
        </Link>

        <div className="flex flex-1 justify-center">
          <CommandSearch />
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <SignedOut>
            <Button size="sm">
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
                    className: "hidden md:flex",
                  })}
                >
                  <PlusCircle size={16} className="mr-2" />
                  New Recipe
                </Link>
                <Link
                  href="/new-recipe"
                  className={buttonVariants({
                    variant: "default",
                    size: "icon",
                    className: "h-8 w-8 md:hidden",
                  })}
                  aria-label="New Recipe"
                >
                  <PlusCircle size={16} />
                </Link>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8",
                  })}
                  aria-label="Dashboard"
                >
                  <LayoutDashboard size={20} />
                </Link>
              </>
            )}
            <div className="hidden md:block">
              <KitchenJourneyBadge />
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-500 md:h-9 md:w-9">
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </nav>
    </div>
  );
}
