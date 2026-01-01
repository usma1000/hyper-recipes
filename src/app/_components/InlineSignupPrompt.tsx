"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

/**
 * Contextual inline sign-up prompt that appears within the recipe grid.
 * Uses soft persuasion to encourage sign-up without being intrusive.
 */
export function InlineSignupPrompt(): JSX.Element {
  return (
    <div className="col-span-full flex items-center justify-between gap-6 rounded-2xl border border-neutral-200/80 bg-gradient-to-r from-neutral-50 to-white px-6 py-5 dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-900/50">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 dark:bg-white">
          <Sparkles className="h-5 w-5 text-white dark:text-neutral-900" />
        </div>
        <div>
          <p className="text-[15px] font-medium text-neutral-900 dark:text-white">Save recipes to your collection</p>
          <p className="text-[14px] text-neutral-500 dark:text-neutral-400">Sign in to favorite, track, and organize your recipes</p>
        </div>
      </div>
      <Button 
        className="shrink-0 rounded-xl bg-neutral-900 px-5 text-[14px] font-medium shadow-sm transition-all hover:bg-neutral-800 hover:shadow-md dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
      >
        <SignInButton mode="modal">
          Sign in
        </SignInButton>
      </Button>
    </div>
  );
}
