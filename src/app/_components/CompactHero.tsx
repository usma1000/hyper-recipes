"use client";

import Image from "next/image";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Utensils } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type HeroProps = {
  featuredRecipe?: Recipe;
};

/**
 * Two-column hero section for anonymous users.
 * Left side: value proposition and CTAs. Right side: featured recipe preview.
 * @param featuredRecipe - Optional recipe to display in the preview card
 */
export function CompactHero({ featuredRecipe }: HeroProps): JSX.Element {
  const scrollToPreview = (): void => {
    const previewSection = document.getElementById("recipe-preview");
    if (previewSection) {
      previewSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-neutral-50 dark:bg-neutral-900">
      <div 
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-100/10 blur-3xl dark:from-amber-500/10 dark:to-orange-500/5" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-gradient-to-tl from-orange-200/15 to-amber-100/10 blur-3xl dark:from-orange-500/10 dark:to-amber-500/5" />

      <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <h1 className="mb-6 text-balance text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-[3.25rem]">
              Recipes that adapt to how you cook.
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
              Hyper Recipes aren&apos;t static blog posts. Each recipe adjusts to your time, ingredients, and skill level—so you can cook with confidence, not guesswork.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button 
                size="lg" 
                onClick={scrollToPreview}
                className="h-12 rounded-xl bg-neutral-900 px-8 text-[15px] font-medium shadow-lg shadow-neutral-900/10 transition-all hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/15 dark:bg-white dark:text-neutral-900 dark:shadow-white/5 dark:hover:bg-neutral-100"
              >
                Try a smart recipe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block">
                      <SignInButton mode="modal">
                        <button className="group flex items-center gap-1 text-[15px] font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                          Or unlock smart recipes for free
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </SignInButton>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign in with Google - it&apos;s free</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {featuredRecipe && (
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-xl shadow-neutral-200/40 transition-all dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-neutral-950/40">
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  {featuredRecipe.heroImage?.url ? (
                    <Image
                      src={featuredRecipe.heroImage.url}
                      alt={featuredRecipe.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Utensils className="h-16 w-16 text-neutral-300 dark:text-neutral-600" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="mb-2 text-[12px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                    Featured Recipe
                  </p>
                  <h3 className="mb-2 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                    {featuredRecipe.name}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {featuredRecipe.description}
                  </p>
                  <div className="flex items-center gap-4 text-[13px] text-neutral-500 dark:text-neutral-400">
                    {(featuredRecipe.prepTime ?? featuredRecipe.cookTime) && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {(featuredRecipe.prepTime ?? 0) + (featuredRecipe.cookTime ?? 0)} min
                      </span>
                    )}
                    {featuredRecipe.difficulty && (
                      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[12px] font-medium dark:bg-neutral-800">
                        {featuredRecipe.difficulty}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/recipe/${featuredRecipe.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-neutral-900 transition-colors hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
                  >
                    View recipe
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
