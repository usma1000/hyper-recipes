"use client";

import { useState, Suspense } from "react";
import RecipesCarousel from "./RecipesCarousel";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecipeCardSkeleton from "./RecipeCardSkeleton";

type TaggedRecipesProps = {
  tags: {
    id: number;
    name: string;
    tagType: "Cuisine" | "Meal" | "Diet";
  }[];
  recipesByTag: Record<number, Recipe[]>;
};

export default function TaggedRecipes({
  tags,
  recipesByTag,
}: TaggedRecipesProps) {
  const [activeTagId, setActiveTagId] = useState<number | null>(null);
  const tagTypes = ["Cuisine", "Meal", "Diet"] as const;

  const hasRecipes =
    activeTagId &&
    recipesByTag &&
    recipesByTag[activeTagId] &&
    recipesByTag[activeTagId].length > 0;

  return (
    <Tabs defaultValue="Cuisine" className="w-full">
      <TabsList>
        {tagTypes.map((type) => (
          <TabsTrigger key={type} value={type}>
            {type}
          </TabsTrigger>
        ))}
      </TabsList>
      {tagTypes.map((type) => (
        <TabsContent key={type} value={type} className="mt-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {tags
              .filter((tag) => tag.tagType === type)
              .map((tag) => (
                <Badge
                  key={tag.id}
                  variant={activeTagId === tag.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setActiveTagId(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            {hasRecipes ? (
              <RecipesCarousel recipes={recipesByTag[activeTagId!]} />
            ) : (
              <p className="text-sm text-slate-500">
                {activeTagId
                  ? "No recipes found for this tag"
                  : "Select a tag to see recipes"}
              </p>
            )}
          </Suspense>
        </TabsContent>
      ))}
    </Tabs>
  );
}
