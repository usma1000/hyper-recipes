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
    <section className="relative w-full overflow-hidden border-b border-border/60 bg-background">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-herb-muted/40 to-transparent" />

      <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-rise max-w-xl">
            <p className="mb-4 font-display text-2xl tracking-tight text-foreground md:text-3xl">
              Hyper Recipes
            </p>
            <h1 className="mb-6 text-balance font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Recipes that adapt to how you cook.
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              Not static blog posts. Each recipe adjusts to your time,
              ingredients, and skill—so you cook with confidence, not guesswork.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                size="lg"
                onClick={scrollToPreview}
                className="h-12 px-8 text-[15px]"
              >
                Try a smart recipe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block">
                      <SignInButton mode="modal">
                        <button className="group flex items-center gap-1 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground">
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
            <div className="animate-rise relative" style={{ animationDelay: "120ms" }}>
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lift transition-shadow hover:shadow-lift">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {featuredRecipe.heroImage?.url ? (
                    <Image
                      src={featuredRecipe.heroImage.url}
                      alt={featuredRecipe.name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Utensils className="h-16 w-16 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="mb-2 text-[12px] font-semibold uppercase tracking-widest text-accent">
                    Featured Recipe
                  </p>
                  <h3 className="mb-2 font-display text-xl font-semibold tracking-tight text-foreground">
                    {featuredRecipe.name}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-[14px] leading-relaxed text-muted-foreground">
                    {featuredRecipe.description}
                  </p>
                  <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
                    {(featuredRecipe.prepTime ?? featuredRecipe.cookTime) && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {(featuredRecipe.prepTime ?? 0) +
                          (featuredRecipe.cookTime ?? 0)}{" "}
                        min
                      </span>
                    )}
                    {featuredRecipe.difficulty && (
                      <span className="rounded-md bg-herb-muted px-2.5 py-0.5 text-[12px] font-medium text-herb">
                        {featuredRecipe.difficulty}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/recipe/${featuredRecipe.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-accent"
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
