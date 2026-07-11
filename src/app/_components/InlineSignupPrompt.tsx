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
    <div className="col-span-full flex items-center justify-between gap-6 rounded-2xl border border-border/80 bg-gradient-to-r from-muted to-card px-6 py-5 dark:border-border dark:from-card dark:to-muted/50">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary dark:bg-card">
          <Sparkles className="h-5 w-5 text-white dark:text-foreground" />
        </div>
        <div>
          <p className="text-[15px] font-medium text-foreground dark:text-foreground">Save recipes to your collection</p>
          <p className="text-[14px] text-muted-foreground dark:text-muted-foreground">Sign in to favorite, track, and organize your recipes</p>
        </div>
      </div>
      <Button 
        className="shrink-0 rounded-xl bg-primary px-5 text-[14px] font-medium shadow-sm transition-all hover:bg-muted hover:shadow-md dark:bg-card dark:text-foreground dark:hover:bg-muted"
      >
        <SignInButton mode="modal">
          Sign in
        </SignInButton>
      </Button>
    </div>
  );
}
