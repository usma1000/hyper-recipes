"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

/**
 * Compact hero section for anonymous users.
 * Height capped at 280px with clear value proposition and single CTA.
 */
export function CompactHero(): JSX.Element {
  const scrollToRecipes = (): void => {
    const recipesSection = document.getElementById("recipes");
    if (recipesSection) {
      recipesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative flex min-h-[280px] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 px-4 py-12">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.2),transparent_50%)]" />
      </div>
      
      <div className="container relative z-10 mx-auto max-w-2xl text-center">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
          Your Kitchen, Supercharged
        </h1>
        <p className="mb-6 text-base text-slate-600 md:text-lg">
          Discover, save, and master recipes from our curated collection
        </p>
        
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="bg-slate-900 px-8 hover:bg-slate-800">
            <SignInButton mode="modal">
              Continue with Google
            </SignInButton>
          </Button>
          <button
            onClick={scrollToRecipes}
            className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Browse as Guest
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

