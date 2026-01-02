import { Suspense } from "react";
import { HeaderStrip } from "./HeaderStrip";
import { CookNowSpotlight, CookNowSpotlightSkeleton } from "./CookNowSpotlight";
import { ContinueRow, ContinueRowSkeleton } from "./ContinueRow";
import { ExploreGrid, ExploreGridSkeleton } from "./ExploreGrid";
import { Sidebar } from "./Sidebar";
import { FooterMicroCTA } from "./FooterMicroCTA";

type LoggedInHomepageProps = {
  recipes: Recipe[];
  favorites: Recipe[];
  collections: Collection[];
  tags: Array<{
    id: number;
    name: string;
    tagType: "Cuisine" | "Meal" | "Diet";
  }>;
  recipesByTag: Record<number, Recipe[]>;
};

/**
 * Main orchestrator for the logged-in homepage.
 * Implements two-column layout with main content (70%) and sidebar (30%).
 * @param recipes - All available recipes for exploration
 * @param favorites - User's favorited recipes
 * @param collections - User's recipe collections (lists)
 * @param tags - Available tags for filtering
 * @param recipesByTag - Recipes grouped by tag ID
 */
export function LoggedInHomepage({
  recipes,
  favorites,
  collections,
  tags,
  recipesByTag,
}: LoggedInHomepageProps): JSX.Element {
  return (
    <div className="container py-6">
      <HeaderStrip />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Main Column (70%) */}
        <div className="space-y-8">
          <Suspense fallback={<CookNowSpotlightSkeleton />}>
            <CookNowSpotlight recipes={recipes} />
          </Suspense>

          <Suspense fallback={<ContinueRowSkeleton />}>
            <ContinueRow recipes={recipes} />
          </Suspense>

          <Suspense fallback={<ExploreGridSkeleton />}>
            <ExploreGrid
              recipes={recipes}
              tags={tags}
              recipesByTag={recipesByTag}
            />
          </Suspense>
        </div>

        {/* Sidebar (30%) */}
        <Sidebar favorites={favorites} collections={collections} />
      </div>

      <FooterMicroCTA />
    </div>
  );
}

