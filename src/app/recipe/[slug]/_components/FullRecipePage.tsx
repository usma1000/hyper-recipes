"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { AlertTriangle } from "lucide-react";
import { type JSONContent } from "novel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SignedIn } from "@clerk/nextjs";
import { RecipeHeader } from "./RecipeHeader";
import { AdaptThisRecipe } from "./AdaptThisRecipe";
import { StepsList, extractStepsFromContent } from "./StepsList";
import { IngredientsPanel } from "./IngredientsPanel";
import { CookModeOverlay } from "./CookModeOverlay";
import { MobileStickyBar } from "./MobileStickyBar";
import { MoreLikeThis } from "./MoreLikeThis";
import { AdminWrapper } from "./AdminWrapper";
import { checkIfFavorite, toggleFavorite } from "~/app/_actions/favorites";

interface FullRecipe {
  id: number;
  name: string;
  slug: string;
  description: string;
  prepTime: number | null;
  cookTime: number | null;
  difficulty: string | null;
  steps: JSONContent | null;
  published: boolean;
  heroImage: { url: string; name: string } | null;
  ingredients: Array<{
    quantity: string;
    recipeId: number;
    ingredientId: number;
    ingredient: {
      id: number;
      name: string;
      description: string | null;
    };
  }>;
  tags: Array<{
    tag: {
      id: number;
      name: string;
      tagType: string | null;
    };
  }>;
}

interface RelatedRecipe {
  id: number;
  name: string;
  slug: string;
  prepTime: number | null;
  cookTime: number | null;
  difficulty: string | null;
  heroImage: { url: string; name: string } | null;
}

interface FullRecipePageProps {
  recipe: FullRecipe;
  relatedRecipes: RelatedRecipe[];
  onPublish: () => Promise<void>;
  adminEditSheet?: ReactNode;
  dangerZoneDialog?: ReactNode;
}

const DEFAULT_SERVINGS = 4;

/**
 * Redesigned recipe page that feels like a cooking tool.
 * Features "Adapt this recipe" controls, scannable steps, and Cook Mode.
 * Desktop: Steps on left, Adapt + Ingredients on sticky right sidebar.
 * Mobile: Single column with sticky bottom action bar.
 * @param recipe - The full recipe data
 * @param relatedRecipes - Related recipes for "More like this" section
 * @param onPublish - Server action to publish the recipe
 * @param adminEditSheet - Server component for admin edit functionality
 * @param dangerZoneDialog - Server component for danger zone dialog
 */
export function FullRecipePageClient({
  recipe,
  relatedRecipes,
  onPublish,
  adminEditSheet,
  dangerZoneDialog,
}: FullRecipePageProps): JSX.Element {
  const { isSignedIn, isLoaded } = useUser();
  const [servings, setServings] = useState(DEFAULT_SERVINGS);
  const [isCookModeOpen, setIsCookModeOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(true);

  const tags = recipe.tags.map((t) => t.tag);
  const steps = recipe.steps as JSONContent | null;
  const stepStrings = extractStepsFromContent(steps);
  const servingsMultiplier = servings / DEFAULT_SERVINGS;

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setIsLoadingFavorite(false);
      return;
    }

    checkIfFavorite(recipe.id)
      .then((result) => setIsFavorite(result))
      .catch((err) => console.error("Failed to check favorite:", err))
      .finally(() => setIsLoadingFavorite(false));
  }, [recipe.id, isSignedIn, isLoaded]);

  const handleToggleFavorite = async (): Promise<void> => {
    if (!isSignedIn) return;
    try {
      await toggleFavorite(recipe.id, isFavorite);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleStartCookMode = (): void => {
    setIsCookModeOpen(true);
  };

  return (
    <>
      {!recipe.published && (
        <div className="mb-8 flex items-center justify-between rounded-md border border-yellow-400 bg-yellow-100 p-4 font-semibold text-yellow-800 dark:border-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-200">
          <div>
            <AlertTriangle
              size={16}
              className="mr-2 inline-block -translate-y-[2px]"
            />
            This recipe is not yet published. It will not be visible to others.
          </div>
          <form action={onPublish}>
            <Button type="submit">Publish</Button>
          </form>
        </div>
      )}

      <RecipeHeader recipe={recipe} tags={tags} servings={servings} />

      <div className="lg:hidden mb-4">
        <AdaptThisRecipe
          defaultServings={DEFAULT_SERVINGS}
          servings={servings}
          onServingsChange={setServings}
        />
      </div>

      <div className="lg:hidden mb-6">
        <IngredientsPanel
          ingredients={recipe.ingredients}
          servingsMultiplier={servingsMultiplier}
          collapsible
          defaultOpen={false}
        />
      </div>

      <div className="flex gap-8">
        <main className="flex-1 min-w-0">
          <StepsList steps={steps} onStartCookMode={handleStartCookMode} />

          <SignedIn>
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Make it yours</CardTitle>
                <CardDescription>
                  Save notes, swaps, and ratings for next time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Personal notes feature coming soon.
                </p>
              </CardContent>
            </Card>
          </SignedIn>

          {dangerZoneDialog && (
            <AdminWrapper>
              <div className="mt-8">{dangerZoneDialog}</div>
            </AdminWrapper>
          )}

          <MoreLikeThis recipes={relatedRecipes} />
        </main>

        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-24 space-y-4">
            {adminEditSheet && <AdminWrapper>{adminEditSheet}</AdminWrapper>}

            <AdaptThisRecipe
              defaultServings={DEFAULT_SERVINGS}
              servings={servings}
              onServingsChange={setServings}
            />

            <IngredientsPanel
              ingredients={recipe.ingredients}
              servingsMultiplier={servingsMultiplier}
            />
          </div>
        </aside>
      </div>

      <div className="h-20 lg:hidden" />

      <MobileStickyBar
        recipeId={recipe.id}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onStartCookMode={handleStartCookMode}
        servings={servings}
        defaultServings={DEFAULT_SERVINGS}
        onServingsChange={setServings}
      />

      <CookModeOverlay
        isOpen={isCookModeOpen}
        onClose={() => setIsCookModeOpen(false)}
        steps={stepStrings}
        ingredients={recipe.ingredients}
        recipeName={recipe.name}
      />
    </>
  );
}
