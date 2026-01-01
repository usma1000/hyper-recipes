"use client";

import { useState } from "react";
import { cn } from "~/lib/utils";
import { Globe, UtensilsCrossed, Leaf } from "lucide-react";

type Tag = {
  id: number;
  name: string;
  tagType: "Cuisine" | "Meal" | "Diet";
};

type CategoryPillsProps = {
  tags: Tag[];
  onSelect: (tagId: number | null) => void;
  selectedTagId?: number | null;
  showAllOption?: boolean;
};

/**
 * Horizontal scrollable row of category pills for filtering recipes.
 * Replaces the dropdown category selector for better discoverability.
 * @param tags - Array of tags to display as pills
 * @param onSelect - Callback when a tag is selected
 * @param selectedTagId - Currently selected tag ID
 * @param showAllOption - Whether to show an "All" pill (default: true)
 */
export function CategoryPills({
  tags,
  onSelect,
  selectedTagId = null,
  showAllOption = true,
}: CategoryPillsProps): JSX.Element {
  const getTagIcon = (tagType: string): JSX.Element | null => {
    switch (tagType) {
      case "Cuisine":
        return <Globe className="h-3.5 w-3.5" />;
      case "Meal":
        return <UtensilsCrossed className="h-3.5 w-3.5" />;
      case "Diet":
        return <Leaf className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {showAllOption && (
          <button
            onClick={() => onSelect(null)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              selectedTagId === null
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            All Recipes
          </button>
        )}
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onSelect(tag.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              selectedTagId === tag.id
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            {getTagIcon(tag.tagType)}
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton loader for category pills.
 */
export function CategoryPillsSkeleton(): JSX.Element {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-slate-100"
        />
      ))}
    </div>
  );
}

