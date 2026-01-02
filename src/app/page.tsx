import { Suspense } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { fetchSliderRecipes } from "./_actions/recipes";
import { fetchAllTagsByType, fetchRecipesByTag } from "./_actions/tags";
import { fetchMyFavoriteRecipes } from "./_actions/favorites";
import { fetchMyCollections } from "./_actions/collections";

import { CompactHero } from "./_components/CompactHero";
import { AdaptiveRecipePreview } from "./_components/AdaptiveRecipePreview";
import { WhyBetterSection } from "./_components/WhyBetterSection";
import { SocialProofStrip } from "./_components/SocialProofStrip";
import { FooterCTA } from "./_components/FooterCTA";
import { GreetingBar } from "./_components/GreetingBar";
import { FavoritesSection, FavoritesSectionSkeleton } from "./_components/FavoritesSection";
import { CollectionsSection } from "./_components/CollectionsSection";
import { FilterableRecipeSection } from "./_components/FilterableRecipeSection";
import { RecipeGridSkeleton } from "./_components/RecipeGrid";

/**
 * Homepage with distinct layouts for anonymous and logged-in users.
 * Anonymous: Product-focused landing page with adaptive recipe preview
 * Logged-in: Greeting bar, quick actions, favorites, browseable grid
 */
export default async function HomePage(): Promise<JSX.Element> {
  const { userId } = auth();

  const [allRecipes, tags, myFavoriteRecipes, myCollections] = await Promise.all([
    fetchSliderRecipes(),
    fetchAllTagsByType(),
    userId ? fetchMyFavoriteRecipes() : Promise.resolve([]),
    userId ? fetchMyCollections() : Promise.resolve([]),
  ]);

  const tagRecipeResults = await Promise.all(
    tags.map(async (tag) => ({
      tagId: tag.id,
      recipes: await fetchRecipesByTag(tag.id),
    }))
  );

  const recipesByTag: Record<
    number,
    Awaited<ReturnType<typeof fetchRecipesByTag>>
  > = {};
  for (const result of tagRecipeResults) {
    recipesByTag[result.tagId] = result.recipes;
  }

  const featuredRecipe = allRecipes[0];

  return (
    <>
      {/* Anonymous Homepage - Product-focused landing */}
      <SignedOut>
        <div className="flex flex-col">
          <CompactHero featuredRecipe={featuredRecipe} />
          
          <div className="container space-y-16 py-16">
            {featuredRecipe && (
              <AdaptiveRecipePreview recipe={featuredRecipe} />
            )}

            <WhyBetterSection />

            <SocialProofStrip />

            <FooterCTA />
          </div>
        </div>
      </SignedOut>

      {/* Logged-In Homepage */}
      <SignedIn>
        <div className="container space-y-6 py-6">
          <GreetingBar />

          <Suspense fallback={<FavoritesSectionSkeleton />}>
            <FavoritesSection favorites={myFavoriteRecipes ?? []} />
          </Suspense>

          <Suspense fallback={<div className="py-4" />}>
            <CollectionsSection collections={myCollections ?? []} />
          </Suspense>

          <Suspense fallback={<RecipeGridSkeleton count={9} />}>
            <FilterableRecipeSection
              recipes={allRecipes}
              tags={tags}
              recipesByTag={recipesByTag}
              showSignupPrompt={false}
            />
          </Suspense>
        </div>
      </SignedIn>
    </>
  );
}
