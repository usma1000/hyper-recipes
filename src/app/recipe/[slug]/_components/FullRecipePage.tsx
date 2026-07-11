"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import { AlertTriangle, Loader2, Check } from "lucide-react";
import { type JSONContent } from "novel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { RecipeHeader } from "./RecipeHeader";
import {
  AdaptThisRecipe,
  type IngredientSwap,
} from "./AdaptThisRecipe";
import { StepsList, extractStepsFromContent } from "./StepsList";
import { IngredientsPanel } from "./IngredientsPanel";
import { CookModeOverlay } from "./CookModeOverlay";
import { MobileStickyBar } from "./MobileStickyBar";
import { MoreLikeThis } from "./MoreLikeThis";
import { AdminWrapper } from "./AdminWrapper";
import { CommunityCheckIns } from "./CommunityCheckIns";
import { CheckInModal } from "./CheckInModal";
import CookingHistory from "./CookingHistory";
import { checkIfFavorite, toggleFavorite } from "~/app/_actions/favorites";
import { saveGeneralNote } from "~/app/_actions/userNotes";
import { fetchRecipeView, onPublishRecipe } from "./actions";
import type {
  RecipeViewDTO,
  RecipeViewIngredient,
} from "./recipeViewTypes";
import type {
  PublicCheckIn,
  RecipeCookStats,
} from "~/server/queries/cookingHistory";

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

type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";

interface UserNotes {
  stepNotes: Record<number, string>;
  generalNote: string;
}

interface FullRecipePageProps {
  recipe: FullRecipe;
  relatedRecipes: RelatedRecipe[];
  adminEditSheet?: ReactNode;
  dangerZoneDialog?: ReactNode;
  hasV2Data?: boolean;
  initialRecipeView?: RecipeViewDTO;
  userNotes?: UserNotes;
  cookStats?: RecipeCookStats;
  publicCheckIns?: PublicCheckIn[];
}

const DEFAULT_SERVINGS = 4;

/**
 * Formats a computed quantity for display in the ingredients panel.
 * @param quantity - Numeric quantity from the recipe view
 * @param unit - Unit string
 * @returns Formatted quantity string
 */
function formatComputedQuantity(quantity: number, unit: string): string {
  const formatted =
    quantity % 1 === 0
      ? quantity.toString()
      : quantity.toFixed(2).replace(/\.?0+$/, "");
  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Maps computed v2 ingredients into the IngredientsPanel shape.
 * @param ingredients - Computed recipe view ingredients
 * @param recipeId - Recipe ID for the panel item shape
 * @returns Ingredients panel items
 */
function mapViewIngredients(
  ingredients: RecipeViewIngredient[],
  recipeId: number,
): FullRecipe["ingredients"] {
  return ingredients.map((ing) => ({
    quantity: formatComputedQuantity(ing.quantity, ing.unit),
    recipeId,
    ingredientId: ing.ingredientId,
    ingredient: {
      id: ing.ingredientId,
      name: ing.ingredientName,
      description: ing.ingredientDescription,
    },
  }));
}

/**
 * Builds swap suggestions from computed ingredients that have substitutions.
 * @param ingredients - Computed recipe view ingredients
 * @returns Ingredient swap groups for cooking tips
 */
function buildSwaps(ingredients: RecipeViewIngredient[]): IngredientSwap[] {
  return ingredients
    .filter((ing) => ing.substitutions.length > 0)
    .map((ing) => ({
      originalIngredientId: ing.ingredientId,
      originalName: ing.ingredientName,
      substitutes: ing.substitutions.map((sub) => ({
        ingredientId: sub.ingredientId,
        ingredientName: sub.ingredientName,
        quantity: sub.quantity,
        unit: sub.unit,
        notes: sub.notes,
      })),
    }));
}

/**
 * Recipe detail page with hero, cook check-ins, community reviews, and cook mode.
 */
export function FullRecipePageClient({
  recipe,
  relatedRecipes,
  adminEditSheet,
  dangerZoneDialog,
  hasV2Data = false,
  initialRecipeView,
  userNotes,
  cookStats = { cookCount: 0, avgRating: null },
  publicCheckIns = [],
}: FullRecipePageProps): JSX.Element {
  const { isSignedIn, isLoaded } = useUser();
  const [servings, setServings] = useState(DEFAULT_SERVINGS);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("MEDIUM");
  const [recipeView, setRecipeView] = useState<RecipeViewDTO | undefined>(
    initialRecipeView,
  );
  const [isViewLoading, setIsViewLoading] = useState(false);
  const skipInitialFetch = useRef(
    Boolean(
      hasV2Data &&
        initialRecipeView &&
        initialRecipeView.difficulty === "MEDIUM" &&
        initialRecipeView.servings === DEFAULT_SERVINGS,
    ),
  );

  const [isCookModeOpen, setIsCookModeOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [checkInTimeMinutes, setCheckInTimeMinutes] = useState(0);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [localCookStats, setLocalCookStats] =
    useState<RecipeCookStats>(cookStats);

  const [generalNote, setGeneralNote] = useState(userNotes?.generalNote ?? "");
  const [savedGeneralNote, setSavedGeneralNote] = useState(
    userNotes?.generalNote ?? "",
  );
  const [generalNoteSaveState, setGeneralNoteSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [generalNoteError, setGeneralNoteError] = useState("");

  const tags = recipe.tags.map((t) => t.tag);

  useEffect(() => {
    if (!hasV2Data) {
      return;
    }

    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }

    let cancelled = false;
    setIsViewLoading(true);

    fetchRecipeView(recipe.id, difficulty, servings)
      .then((view) => {
        if (!cancelled) {
          setRecipeView(view);
        }
      })
      .catch((err: unknown) => {
        console.error("Failed to fetch adapted recipe view:", err);
      })
      .finally(() => {
        if (!cancelled) {
          setIsViewLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [hasV2Data, recipe.id, difficulty, servings]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    checkIfFavorite(recipe.id)
      .then((result) => setIsFavorite(result))
      .catch((err) => console.error("Failed to check favorite:", err));
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

  const openCheckIn = (elapsedMinutes = 0): void => {
    setCheckInTimeMinutes(elapsedMinutes);
    setIsCheckInOpen(true);
  };

  const handleCheckInSuccess = (): void => {
    setHistoryRefreshKey((k) => k + 1);
    setLocalCookStats((prev) => ({
      cookCount: prev.cookCount + 1,
      avgRating: prev.avgRating,
    }));
  };

  const handleSaveGeneralNote = useCallback(async () => {
    setGeneralNoteSaveState("saving");
    setGeneralNoteError("");

    const result = await saveGeneralNote(recipe.id, generalNote);

    if (result.success) {
      setSavedGeneralNote(generalNote);
      setGeneralNoteSaveState("saved");
      setTimeout(() => setGeneralNoteSaveState("idle"), 2000);
    } else {
      setGeneralNoteSaveState("error");
      setGeneralNoteError(result.error ?? "Failed to save");
    }
  }, [recipe.id, generalNote]);

  const useV2View = hasV2Data && recipeView !== undefined;
  const displayIngredients = useV2View
    ? mapViewIngredients(recipeView.ingredients, recipe.id)
    : recipe.ingredients;
  const stepInstructions = useV2View
    ? recipeView.steps.map((step) => step.instruction)
    : undefined;
  const stepStrings = useV2View
    ? recipeView.steps.map((step) => step.instruction)
    : extractStepsFromContent(recipe.steps);
  const servingsMultiplier = useV2View ? 1 : servings / DEFAULT_SERVINGS;
  const swaps = useV2View ? buildSwaps(recipeView.ingredients) : [];

  return (
    <>
      {!recipe.published && (
        <div className="container pt-6">
          <div className="flex items-center justify-between rounded-xl border border-accent/40 bg-accent/10 p-4 font-semibold text-accent">
            <div>
              <AlertTriangle
                size={16}
                className="mr-2 inline-block -translate-y-[2px]"
              />
              This recipe is not yet published. It will not be visible to others.
            </div>
            <form action={() => onPublishRecipe(recipe.id, true)}>
              <Button type="submit">Publish</Button>
            </form>
          </div>
        </div>
      )}

      <RecipeHeader
        recipe={recipe}
        tags={tags}
        servings={servings}
        cookStats={localCookStats}
        onStartCookMode={handleStartCookMode}
        onCheckIn={() => openCheckIn()}
      />

      <div className="container py-8 lg:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-80 lg:self-start">
            <div className="space-y-4">
              {adminEditSheet && (
                <AdminWrapper>{adminEditSheet}</AdminWrapper>
              )}

              <div className="lg:hidden">
                <IngredientsPanel
                  ingredients={displayIngredients}
                  servingsMultiplier={servingsMultiplier}
                  isLoading={isViewLoading}
                  collapsible
                  defaultOpen
                />
              </div>

              <div className="hidden lg:block">
                <IngredientsPanel
                  ingredients={displayIngredients}
                  servingsMultiplier={servingsMultiplier}
                  isLoading={isViewLoading}
                />
              </div>

              <AdaptThisRecipe
                servings={servings}
                onServingsChange={setServings}
                difficulty={difficulty}
                onDifficultyChange={setDifficulty}
                hasV2Data={hasV2Data}
                defaultCollapsed
              />

              <SignedIn>
                <CookingHistory
                  recipeId={recipe.id}
                  refreshKey={historyRefreshKey}
                  onCheckIn={() => openCheckIn()}
                />
              </SignedIn>
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <StepsList
              steps={useV2View ? null : recipe.steps}
              stepInstructions={stepInstructions}
              recipeId={recipe.id}
              isSignedIn={!!isSignedIn}
              stepNotes={userNotes?.stepNotes}
              isLoading={isViewLoading}
              swaps={swaps}
            />

            <div className="mt-8 flex justify-center sm:justify-start">
              <Button onClick={() => openCheckIn()} size="lg">
                I cooked this
              </Button>
            </div>

            <section className="mt-10 rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-herb-muted/40 p-5 sm:p-6">
              <h2 className="font-display text-xl font-semibold tracking-tight">
                Make it yours
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Save swaps, timing tweaks, and reminders for next time.
              </p>
              <div className="mt-4">
                <SignedIn>
                  <div className="space-y-3">
                    <Textarea
                      value={generalNote}
                      onChange={(e) => setGeneralNote(e.target.value)}
                      placeholder="Your notes for this recipe..."
                      className="min-h-[100px] bg-background/70"
                      maxLength={2000}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleSaveGeneralNote}
                        disabled={
                          generalNoteSaveState === "saving" ||
                          generalNote === savedGeneralNote
                        }
                      >
                        {generalNoteSaveState === "saving" ? (
                          <>
                            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : generalNoteSaveState === "saved" ? (
                          <>
                            <Check className="mr-1.5 h-4 w-4" />
                            Saved
                          </>
                        ) : (
                          "Save notes"
                        )}
                      </Button>
                    </div>
                    {generalNoteSaveState === "error" && (
                      <p className="text-sm text-destructive">
                        {generalNoteError}
                      </p>
                    )}
                  </div>
                </SignedIn>
                <SignedOut>
                  <p className="text-sm text-muted-foreground">
                    Log in to save personal notes.
                  </p>
                </SignedOut>
              </div>
            </section>

            <CommunityCheckIns
              stats={localCookStats}
              checkIns={publicCheckIns}
            />

            {dangerZoneDialog && (
              <AdminWrapper>
                <div className="mt-8">{dangerZoneDialog}</div>
              </AdminWrapper>
            )}

            <MoreLikeThis recipes={relatedRecipes} />
          </main>
        </div>
      </div>

      <div className="h-20 lg:hidden" />

      <MobileStickyBar
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onStartCookMode={handleStartCookMode}
        onCheckIn={() => openCheckIn()}
        servings={servings}
        onServingsChange={setServings}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        hasV2Data={hasV2Data}
      />

      <CookModeOverlay
        isOpen={isCookModeOpen}
        onClose={() => setIsCookModeOpen(false)}
        steps={stepStrings}
        ingredients={displayIngredients}
        onLogCook={(minutes) => openCheckIn(minutes)}
      />

      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        recipeId={recipe.id}
        recipeSlug={recipe.slug}
        initialTimeMinutes={checkInTimeMinutes}
        onSuccess={handleCheckInSuccess}
      />
    </>
  );
}
