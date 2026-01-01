import { Suspense } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { fetchSliderRecipes } from "./_actions/recipes";
import { fetchAllTagsByType, fetchRecipesByTag } from "./_actions/tags";
import { fetchMyFavoriteRecipes } from "./_actions/favorites";

import { CompactHero } from "./_components/CompactHero";
import { GreetingBar } from "./_components/GreetingBar";
import { QuickActions } from "./_components/QuickActions";
import { FavoritesSection, FavoritesSectionSkeleton } from "./_components/FavoritesSection";
import { FilterableRecipeSection } from "./_components/FilterableRecipeSection";
import { FeaturedRecipeSpotlight } from "./_components/FeaturedRecipeSpotlight";
import { SocialProofStrip } from "./_components/SocialProofStrip";
import { FooterCTA } from "./_components/FooterCTA";
import { RecipeGridSkeleton } from "./_components/RecipeGrid";

/**
 * Homepage with distinct layouts for anonymous and logged-in users.
 * Anonymous: Compact hero, recipe grid with inline signup prompts, social proof
 * Logged-in: Greeting bar, quick actions, favorites, browseable grid
 */
export default async function HomePage(): Promise<JSX.Element> {
  const { userId } = auth();

  const [allRecipes, tags, myFavoriteRecipes] = await Promise.all([
    fetchSliderRecipes(),
    fetchAllTagsByType(),
    userId ? fetchMyFavoriteRecipes() : Promise.resolve([]),
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
      {/* Anonymous Homepage */}
      <SignedOut>
        <div className="flex flex-col">
          {/* Compact Hero - outside container for full width */}
          <CompactHero />
          
          <div className="container space-y-10 py-8">
            {/* Recipe Grid with Category Pills */}
            <Suspense fallback={<RecipeGridSkeleton count={9} />}>
              <FilterableRecipeSection
                recipes={allRecipes}
                tags={tags}
                recipesByTag={recipesByTag}
                showSignupPrompt={true}
              />
            </Suspense>

            {/* Featured Recipe Spotlight */}
            {featuredRecipe && (
              <FeaturedRecipeSpotlight recipe={featuredRecipe} />
            )}

            {/* Social Proof Strip */}
            <SocialProofStrip />

            {/* Footer CTA */}
            <FooterCTA />
          </div>
        </div>
      </SignedOut>

      {/* Logged-In Homepage */}
      <SignedIn>
        <div className="container space-y-8 py-4">
          {/* Greeting Bar */}
          <GreetingBar />

          {/* Quick Actions */}
          <QuickActions />

          {/* Favorites Section */}
          <Suspense fallback={<FavoritesSectionSkeleton />}>
            <FavoritesSection favorites={myFavoriteRecipes ?? []} />
          </Suspense>

          {/* Recipe Grid with Category Pills */}
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
