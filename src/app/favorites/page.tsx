import { Suspense } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { fetchMyFavoriteRecipes } from "../_actions/favorites";
import { fetchAllTagsByType, fetchRecipesByTag } from "../_actions/tags";
import { RecipeGridSkeleton } from "../_components/RecipeGrid";
import { FilterableFavoritesSection } from "./_components/FilterableFavoritesSection";

/**
 * Favorites page displaying all user's favorite recipes with tag filtering.
 * Redirects to home if user is not signed in.
 */
export default async function FavoritesPage(): Promise<JSX.Element> {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const [favorites, tags] = await Promise.all([
    fetchMyFavoriteRecipes(),
    fetchAllTagsByType(),
  ]);

  const favoriteIds = new Set(favorites.map((f) => f.id));

  const tagRecipeResults = await Promise.all(
    tags.map(async (tag) => {
      const recipes = await fetchRecipesByTag(tag.id);
      const favoriteRecipes = recipes.filter((recipe) =>
        favoriteIds.has(recipe.id),
      );
      return {
        tagId: tag.id,
        favorites: favoriteRecipes,
      };
    }),
  );

  const favoritesByTag: Record<
    number,
    Awaited<ReturnType<typeof fetchMyFavoriteRecipes>>
  > = {};
  for (const result of tagRecipeResults) {
    favoritesByTag[result.tagId] = result.favorites;
  }

  return (
    <>
      <SignedOut>
        <div className="container py-8">
          <p className="text-center text-muted-foreground">
            Please sign in to view your favorites.
          </p>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground dark:text-foreground">
              Your Favorites
            </h1>
            <p className="mt-2 text-[15px] text-muted-foreground dark:text-muted-foreground">
              {favorites.length === 0
                ? "You haven't favorited any recipes yet."
                : `${favorites.length} ${favorites.length === 1 ? "recipe" : "recipes"} saved`}
            </p>
          </div>

          {favorites.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/50 dark:border-border dark:bg-card/50">
              <p className="text-[15px] text-muted-foreground dark:text-muted-foreground">
                No favorites yet
              </p>
            </div>
          ) : (
            <Suspense fallback={<RecipeGridSkeleton count={9} />}>
              <FilterableFavoritesSection
                favorites={favorites}
                tags={tags}
                favoritesByTag={favoritesByTag}
              />
            </Suspense>
          )}
        </div>
      </SignedIn>
    </>
  );
}
