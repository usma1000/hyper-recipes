import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { fetchAllRecipes, fetchSliderRecipes } from "./_actions/recipes";
import {
  fetchAllTagsByType,
  fetchPublishedRecipesByTagIdMap,
} from "./_actions/tags";
import { fetchMyFavoriteRecipes } from "./_actions/favorites";
import { fetchMyCollections } from "./_actions/collections";

import { CompactHero } from "./_components/CompactHero";
import { AdaptiveRecipePreview } from "./_components/AdaptiveRecipePreview";
import { WhyBetterSection } from "./_components/WhyBetterSection";
import { SocialProofStrip } from "./_components/SocialProofStrip";
import { FooterCTA } from "./_components/FooterCTA";
import { UpsellStrip } from "./_components/UpsellStrip";
import { LoggedInHomepage } from "./_components/logged-in-homepage";

/**
 * Homepage with distinct layouts for anonymous and logged-in users.
 * Anonymous visitors (including bots) only load a small featured set —
 * not the full catalog or per-tag query fan-out.
 */
export default async function HomePage(): Promise<JSX.Element> {
  const { userId } = auth();

  // Anonymous / bot path: one cached slider query, no catalog/tag fan-out.
  if (!userId) {
    const featuredRecipes = await fetchSliderRecipes();
    const featuredRecipe = featuredRecipes[0];

    return (
      <SignedOut>
        <div className="flex flex-col">
          <UpsellStrip />
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
    );
  }

  const [allRecipes, tags, recipesByTagBatch, myFavoriteRecipes, myCollections] =
    await Promise.all([
      fetchAllRecipes(),
      fetchAllTagsByType(),
      fetchPublishedRecipesByTagIdMap(),
      fetchMyFavoriteRecipes(),
      fetchMyCollections(),
    ]);

  const recipesByTag: Record<number, Recipe[]> = {};
  for (const tag of tags) {
    recipesByTag[tag.id] = recipesByTagBatch[tag.id] ?? [];
  }

  return (
    <SignedIn>
      <LoggedInHomepage
        recipes={allRecipes}
        favorites={myFavoriteRecipes ?? []}
        collections={myCollections ?? []}
        tags={tags}
        recipesByTag={recipesByTag}
      />
    </SignedIn>
  );
}
