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
    <div className="col-span-full my-2 flex items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
          <Sparkles className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <p className="font-medium text-slate-900">Save recipes to your collection</p>
          <p className="text-sm text-slate-600">Sign in to favorite, track, and organize your recipes</p>
        </div>
      </div>
      <Button className="shrink-0 bg-slate-900 hover:bg-slate-800">
        <SignInButton mode="modal">
          Continue with Google
        </SignInButton>
      </Button>
    </div>
  );
}

