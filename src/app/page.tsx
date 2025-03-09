import { SignedIn, SignedOut } from "@clerk/nextjs";
import RecipesCarousel from "./_components/RecipesCarousel";

import { getSliderRecipes, getMyFavoriteRecipes } from "~/server/queries";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = auth();

  const allRecipes = await getSliderRecipes();
  const myFavoriteRecipes = userId ? await getMyFavoriteRecipes() : null;

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
          {myFavoriteRecipes?.length ? (
            <RecipesCarousel recipes={myFavoriteRecipes} />
          ) : (
            <div className="mt-4 h-full w-full rounded-lg border border-slate-200 bg-white p-6 text-center text-xl font-semibold text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50">
              <p className="text-slate-500">
                You haven&apos;t favorited any recipes yet.
              </p>
            </div>
          )}
        </section>
      </SignedIn>
      <section>
        <h2>Featured</h2>
        <p className="text-sm text-slate-500">
          Some of our favorites, hand picked for you.
        </p>
        <RecipesCarousel recipes={allRecipes} />
      </section>
    </div>
  );
}
