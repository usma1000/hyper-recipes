import { Suspense } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import RecipesCarousel from "./_components/RecipesCarousel";
import { fetchSliderRecipes } from "./_actions/recipes";
import { fetchAllTagsByType, fetchRecipesByTag } from "./_actions/tags";
import { fetchMyFavoriteRecipes } from "./_actions/favorites";
import { auth } from "@clerk/nextjs/server";
import TaggedRecipes from "./_components/TaggedRecipes";
import RecipeCardSkeleton from "./_components/RecipeCardSkeleton";

export default async function HomePage() {
  const { userId } = auth();

  const [allRecipes, tags, myFavoriteRecipes] = await Promise.all([
    fetchSliderRecipes(),
    fetchAllTagsByType(),
    userId ? fetchMyFavoriteRecipes() : Promise.resolve([]),
  ]);

  // Fetch recipes for each tag
  const recipesByTag: Record<
    number,
    Awaited<ReturnType<typeof fetchRecipesByTag>>
  > = {};
  for (const tag of tags) {
    recipesByTag[tag.id] = await fetchRecipesByTag(tag.id);
  }

  return (
    <div className="flex flex-col gap-8">
      <SignedOut>
        <div className="h-full w-full rounded-lg bg-yellow-50 p-6 text-center text-xl font-semibold text-yellow-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50">
          Sign in to start saving recipes to your book.
        </div>
      </SignedOut>
      <h1>Browse Recipes</h1>
      <SignedIn>
        <section>
          <h2>My favorites</h2>
          <p className="text-sm text-slate-500">
            You can save any recipe to your favorites by clicking the star icon.
          </p>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            {myFavoriteRecipes?.length ? (
              <RecipesCarousel recipes={myFavoriteRecipes} />
            ) : (
              <div className="mt-4 h-full w-full rounded-lg border border-slate-200 bg-white p-6 text-center text-xl font-semibold text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50">
                <p className="text-slate-500">
                  You haven&apos;t favorited any recipes yet.
                </p>
              </div>
            )}
          </Suspense>
        </section>
      </SignedIn>
      <section>
        <h2>Browse by Tag</h2>
        <p className="text-sm text-slate-500">
          Discover recipes by cuisine, meal type, or dietary preference.
        </p>
        <div className="mt-4">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <TaggedRecipes tags={tags} recipesByTag={recipesByTag} />
          </Suspense>
        </div>
      </section>
      <section>
        <h2>Featured</h2>
        <p className="text-sm text-slate-500">
          Some of our favorites, hand picked for you.
        </p>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <RecipesCarousel recipes={allRecipes} />
        </Suspense>
      </section>
    </div>
  );
}
