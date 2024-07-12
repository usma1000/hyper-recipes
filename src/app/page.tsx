import { SignedIn, SignedOut } from "@clerk/nextjs";
import RecipesCarousel from "./_components/RecipesCarousel";

import { getAllRecipes, getMyFavoriteRecipes } from "~/server/queries";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = auth();

  const allRecipes = await getAllRecipes();
  const myFavoriteRecipes = userId ? await getMyFavoriteRecipes() : null;

  return (
    <div className="flex flex-col gap-8">
      <SignedOut>
        <div className="h-full w-full rounded-md border bg-slate-50 p-6 text-center text-2xl font-semibold text-slate-600">
          Sign in to start saving recipes to your book.
        </div>
      </SignedOut>
      <h1>Browse Recipes</h1>
      <section>
        <h2>Featured</h2>
        <p className="text-sm text-slate-500">
          Some of our favorites, hand picked for you.
        </p>
        <RecipesCarousel recipes={allRecipes} />
      </section>
      <SignedIn>
        <section>
          <h2>My favorites</h2>
          <p className="text-sm text-slate-500">
            You can save any recipe to your favorites by clicking the star icon.
          </p>
          {myFavoriteRecipes && <RecipesCarousel recipes={myFavoriteRecipes} />}
        </section>
      </SignedIn>
    </div>
  );
}
