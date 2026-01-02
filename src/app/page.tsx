import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { fetchAllRecipes } from "./_actions/recipes";
import { fetchAllTagsByType, fetchRecipesByTag } from "./_actions/tags";
import { fetchMyFavoriteRecipes } from "./_actions/favorites";
import { fetchMyCollections } from "./_actions/collections";

import { CompactHero } from "./_components/CompactHero";
import { AdaptiveRecipePreview } from "./_components/AdaptiveRecipePreview";
import { WhyBetterSection } from "./_components/WhyBetterSection";
import { SocialProofStrip } from "./_components/SocialProofStrip";
import { FooterCTA } from "./_components/FooterCTA";
import { LoggedInHomepage } from "./_components/logged-in-homepage";

/**
 * Homepage with distinct layouts for anonymous and logged-in users.
 * Anonymous: Product-focused landing page with adaptive recipe preview
 * Logged-in: Two-column layout with Cook Now spotlight, Continue row, Explore grid, and sidebar
 */
export default async function HomePage(): Promise<JSX.Element> {
  const { userId } = auth();

  const [allRecipes, tags, myFavoriteRecipes, myCollections] = await Promise.all([
    fetchAllRecipes(),
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

      {/* Logged-In Homepage - Two-column layout per spec */}
      <SignedIn>
        <LoggedInHomepage
          recipes={allRecipes}
          favorites={myFavoriteRecipes ?? []}
          collections={myCollections ?? []}
          tags={tags}
          recipesByTag={recipesByTag}
        />
      </SignedIn>
    </>
  );
}
