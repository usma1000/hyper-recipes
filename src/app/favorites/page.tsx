import { Suspense } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { fetchMyFavoriteRecipes } from "../_actions/favorites";
import { RecipeGrid, RecipeGridSkeleton } from "../_components/RecipeGrid";

/**
 * Favorites page displaying all user's favorite recipes.
 * Redirects to home if user is not signed in.
 */
export default async function FavoritesPage(): Promise<JSX.Element> {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const favorites = await fetchMyFavoriteRecipes();

  return (
    <>
      <SignedOut>
        <div className="container py-8">
          <p className="text-center text-neutral-500">
            Please sign in to view your favorites.
          </p>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Your Favorites
            </h1>
            <p className="mt-2 text-[15px] text-neutral-500 dark:text-neutral-400">
              {favorites.length === 0
                ? "You haven't favorited any recipes yet."
                : `${favorites.length} ${favorites.length === 1 ? "recipe" : "recipes"} saved`}
            </p>
          </div>

          <Suspense fallback={<RecipeGridSkeleton count={9} />}>
            <RecipeGrid recipes={favorites} />
          </Suspense>
        </div>
      </SignedIn>
    </>
  );
}
