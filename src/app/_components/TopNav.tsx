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
import { LayoutDashboard, PlusCircle, Trophy, Zap } from "lucide-react";

export default function TopNav() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

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
            <Link
              href="/kitchen-journey"
              className="group relative flex h-9 w-9 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(rgb(34 197 94) 24%, rgb(226 232 240) 24%)`,
              }}
            >
              <div className="absolute inset-[2px] flex items-center justify-center rounded-full bg-white transition-transform dark:bg-slate-950">
                <Trophy className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              </div>
            </Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-500">
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </nav>
    </div>
  );
}
