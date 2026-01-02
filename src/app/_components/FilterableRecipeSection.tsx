"use client";

import { useState, useMemo } from "react";
import { CategoryPills } from "./CategoryPills";
import { RecipeGrid } from "./RecipeGrid";
import { InlineSignupPrompt } from "./InlineSignupPrompt";
import { SignedOut } from "@clerk/nextjs";

type Tag = {
  id: number;
  name: string;
  tagType: "Cuisine" | "Meal" | "Diet";
};

type FilterableRecipeSectionProps = {
  recipes: Recipe[];
  tags: Tag[];
  recipesByTag: Record<number, Recipe[]>;
  showSignupPrompt?: boolean;
};

/**
 * Combined recipe grid with category pill filtering.
 * Handles client-side filtering without page reload.
 * @param recipes - All recipes for the "All" filter
 * @param tags - Tags to display as filter pills
 * @param recipesByTag - Pre-fetched recipes grouped by tag ID
 * @param showSignupPrompt - Whether to show inline signup prompt (default: true)
 */
export function FilterableRecipeSection({
  recipes,
  tags,
  recipesByTag,
  showSignupPrompt = true,
}: FilterableRecipeSectionProps): JSX.Element {
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  const tagsWithRecipes = useMemo(() => {
    return tags.filter((tag) => {
      const tagRecipes = recipesByTag[tag.id];
      return tagRecipes && tagRecipes.length > 0;
    });
  }, [tags, recipesByTag]);

  const displayedRecipes = useMemo(() => {
    if (selectedTagId === null) {
      return recipes;
    }
    return recipesByTag[selectedTagId] ?? [];
  }, [selectedTagId, recipes, recipesByTag]);

  const firstHalf = displayedRecipes.slice(0, 6);
  const secondHalf = displayedRecipes.slice(6);

  return (
    <section id="recipes" className="scroll-mt-8">
      <div className="mb-8">
        <h2 className="mb-1 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Browse Recipes
        </h2>
        <p className="mb-5 text-[15px] text-neutral-500 dark:text-neutral-400">
          Explore our collection of curated recipes
        </p>
        <CategoryPills
          tags={tagsWithRecipes}
          onSelect={setSelectedTagId}
          selectedTagId={selectedTagId}
        />
      </div>

      <div className="space-y-6">
        <RecipeGrid recipes={firstHalf} />

        {showSignupPrompt && firstHalf.length >= 6 && (
          <SignedOut>
            <InlineSignupPrompt />
          </SignedOut>
        )}

        {secondHalf.length > 0 && <RecipeGrid recipes={secondHalf} />}
      </div>
    </section>
  );
}
