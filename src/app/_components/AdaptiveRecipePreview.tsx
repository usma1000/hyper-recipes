"use client";

import Image from "next/image";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Users,
  Leaf,
  Gauge,
  Lock,
  ArrowRight,
  Utensils,
} from "lucide-react";

type AdaptiveRecipePreviewProps = {
  recipe: Recipe;
};

type TimeOption = {
  value: number;
  label: string;
  isSelected: boolean;
};

type ServingsOption = {
  value: number;
  isSelected: boolean;
};

const TIME_OPTIONS: TimeOption[] = [
  { value: 20, label: "20 min", isSelected: false },
  { value: 30, label: "30 min", isSelected: true },
  { value: 45, label: "45 min", isSelected: false },
];

const SERVINGS_OPTIONS: ServingsOption[] = [
  { value: 1, isSelected: false },
  { value: 2, isSelected: true },
  { value: 4, isSelected: false },
];

/**
 * Core differentiator section showing the adaptive recipe system.
 * Displays recipe card with locked adaptation controls to demonstrate value.
 * @param recipe - The featured recipe to display
 */
export function AdaptiveRecipePreview({
  recipe,
}: AdaptiveRecipePreviewProps): JSX.Element {
  return (
    <section id="recipe-preview" className="scroll-mt-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-sm transition-all dark:border-neutral-800 dark:bg-neutral-900">
          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            {recipe.heroImage?.url ? (
              <Image
                src={recipe.heroImage.url}
                alt={recipe.name}
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
            <h3 className="mb-2 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              {recipe.name}
            </h3>
            <p className="mb-4 line-clamp-2 text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              {recipe.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-neutral-500 dark:text-neutral-400">
              {(recipe.prepTime ?? recipe.cookTime) && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Prep: {recipe.prepTime ?? 15} min | Cook: {recipe.cookTime ?? 25} min
                </span>
              )}
              {!recipe.prepTime && !recipe.cookTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Prep: 15 min | Cook: 25 min
                </span>
              )}
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[12px] font-medium dark:bg-neutral-800">
                {recipe.difficulty ?? "Medium"}
              </span>
            </div>
            <Link
              href={`/recipe/${recipe.slug}`}
              className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-neutral-900 transition-colors hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
            >
              View full recipe
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex-1 rounded-2xl border border-neutral-200/60 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                Adapt This Recipe
              </h4>
              <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                <Lock className="h-3 w-3" />
                Preview
              </span>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <div className="absolute -right-1 -top-1 z-10">
                  <Lock className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <label className="mb-2.5 flex items-center gap-2 text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
                  <Clock className="h-4 w-4" />
                  Total Time
                </label>
                <div className="flex gap-2">
                  {TIME_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      disabled
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-[13px] font-medium transition-all ${
                        option.isSelected
                          ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                          : "border-neutral-200 bg-white text-neutral-600 opacity-60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -right-1 -top-1 z-10">
                  <Lock className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <label className="mb-2.5 flex items-center gap-2 text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
                  <Users className="h-4 w-4" />
                  Servings
                </label>
                <div className="flex gap-2">
                  {SERVINGS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      disabled
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-[13px] font-medium transition-all ${
                        option.isSelected
                          ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                          : "border-neutral-200 bg-white text-neutral-600 opacity-60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {option.value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -right-1 -top-1 z-10">
                  <Lock className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <label className="mb-2.5 flex items-center gap-2 text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
                  <Leaf className="h-4 w-4" />
                  Ingredient Swaps
                </label>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] text-neutral-500 opacity-75 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                  3 alternatives available
                </div>
              </div>

              <div className="relative">
                <div className="absolute -right-1 -top-1 z-10">
                  <Lock className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <label className="mb-2.5 flex items-center gap-2 text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
                  <Gauge className="h-4 w-4" />
                  Difficulty
                </label>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] text-neutral-500 opacity-75 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                  Beginner-friendly
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <p className="mb-3 text-center text-[14px] text-neutral-600 dark:text-neutral-400">
                Create a free account to adapt recipes instantly.
              </p>
              <SignInButton mode="modal">
                <Button className="w-full rounded-xl bg-neutral-900 text-[14px] font-medium shadow-sm transition-all hover:bg-neutral-800 hover:shadow-md dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100">
                  Unlock Adaptations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

