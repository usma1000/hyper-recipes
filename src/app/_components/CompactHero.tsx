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
    <section className="relative flex min-h-[300px] w-full items-center justify-center overflow-hidden bg-neutral-50 px-4 py-16 dark:bg-neutral-900">
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Soft gradient orbs */}
      <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-200/30 to-orange-100/20 blur-3xl dark:from-amber-500/10 dark:to-orange-500/5" />
      <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tl from-orange-200/25 to-amber-100/15 blur-3xl dark:from-orange-500/10 dark:to-amber-500/5" />
      
      <div className="container relative z-10 mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-balance text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
          Your Kitchen, Supercharged
        </h1>
        <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-lg">
          Discover, save, and master recipes from our curated collection
        </p>
        
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button 
            size="lg" 
            className="h-12 rounded-xl bg-neutral-900 px-8 text-[15px] font-medium shadow-lg shadow-neutral-900/10 transition-all hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/15 dark:bg-white dark:text-neutral-900 dark:shadow-white/5 dark:hover:bg-neutral-100"
          >
            <SignInButton mode="modal">
              Continue with Google
            </SignInButton>
          </Button>
          <button
            onClick={scrollToRecipes}
            className="group flex items-center gap-1.5 text-[15px] font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            Browse as Guest
            <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
