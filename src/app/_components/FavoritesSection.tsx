import { Suspense } from "react";
import Link from "next/link";
import RecipeCard from "./RecipeCard";
import RecipeCardSkeleton from "./RecipeCardSkeleton";
import { ArrowRight } from "lucide-react";

type FavoritesSectionProps = {
  favorites: Recipe[];
};

/**
 * Compact favorites section for logged-in users.
 * Shows horizontal scroll of favorites or minimal empty state.
 * @param favorites - Array of user's favorite recipes
 */
export function FavoritesSection({ favorites }: FavoritesSectionProps): JSX.Element {
  if (!favorites || favorites.length === 0) {
    return (
      <section id="favorites" className="py-4">
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 py-8 dark:border-neutral-800 dark:bg-neutral-900/50">
          <p className="text-[15px] text-neutral-500 dark:text-neutral-400">
            No favorites yet — browse below to find recipes you love
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="favorites" className="py-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">Your Favorites</h2>
        <Link
          href="/favorites"
          className="flex items-center gap-1 text-[14px] font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          See all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {favorites.slice(0, 5).map((recipe) => (
          <div key={recipe.id} className="w-[280px] shrink-0">
            <Suspense fallback={<RecipeCardSkeleton />}>
              <RecipeCard recipe={recipe} />
            </Suspense>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Skeleton loader for favorites section.
 */
export function FavoritesSectionSkeleton(): JSX.Element {
  return (
    <section className="py-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-32 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800" />
        <div className="h-5 w-16 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-[280px] shrink-0">
            <RecipeCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}
