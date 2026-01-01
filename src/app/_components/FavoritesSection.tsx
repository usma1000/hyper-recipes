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
        <p className="text-sm text-slate-500">
          No favorites yet — browse below to find recipes you love
        </p>
      </section>
    );
  }

  return (
    <section id="favorites" className="py-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Your Favorites</h2>
        <Link
          href="/favorites"
          className="flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
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
        <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
        <div className="h-5 w-16 animate-pulse rounded bg-slate-200" />
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

