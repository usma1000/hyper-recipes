"use client";

import { useState, useMemo } from "react";
import { CategoryPills } from "../../_components/CategoryPills";
import { RecipeGrid } from "../../_components/RecipeGrid";

type Tag = {
  id: number;
  name: string;
  tagType: "Cuisine" | "Meal" | "Diet";
};

type FilterableFavoritesSectionProps = {
  favorites: Recipe[];
  tags: Tag[];
  favoritesByTag: Record<number, Recipe[]>;
};

/**
 * Favorites section with category pill filtering.
 * Handles client-side filtering without page reload.
 * @param favorites - All favorite recipes for the "All" filter
 * @param tags - Tags to display as filter pills
 * @param favoritesByTag - Pre-filtered favorites grouped by tag ID
 */
export function FilterableFavoritesSection({
  favorites,
  tags,
  favoritesByTag,
}: FilterableFavoritesSectionProps): JSX.Element {
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  const tagsWithFavorites = useMemo(() => {
    return tags.filter((tag) => {
      const tagFavorites = favoritesByTag[tag.id];
      return tagFavorites && tagFavorites.length > 0;
    });
  }, [tags, favoritesByTag]);

  const displayedFavorites = useMemo(() => {
    if (selectedTagId === null) {
      return favorites;
    }
    return favoritesByTag[selectedTagId] ?? [];
  }, [selectedTagId, favorites, favoritesByTag]);

  return (
    <div>
      <div className="mb-6">
        <CategoryPills
          tags={tagsWithFavorites}
          onSelect={setSelectedTagId}
          selectedTagId={selectedTagId}
        />
      </div>

      <RecipeGrid recipes={displayedFavorites} />
    </div>
  );
}
