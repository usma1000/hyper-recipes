"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { AlertTriangle, Loader2, Check } from "lucide-react";
import { type JSONContent } from "novel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { RecipeHeader } from "./RecipeHeader";
import { AdaptThisRecipe } from "./AdaptThisRecipe";
import { StepsList, extractStepsFromContent } from "./StepsList";
import { IngredientsPanel } from "./IngredientsPanel";
import { CookModeOverlay } from "./CookModeOverlay";
import { MobileStickyBar } from "./MobileStickyBar";
import { MoreLikeThis } from "./MoreLikeThis";
import { AdminWrapper } from "./AdminWrapper";
import { checkIfFavorite, toggleFavorite } from "~/app/_actions/favorites";
import { saveGeneralNote } from "~/app/_actions/userNotes";
import { onPublishRecipe } from "./actions";

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
  userNotes?: UserNotes;
}

const DEFAULT_SERVINGS = 4;

/**
 * Redesigned recipe page that feels like a cooking tool.
 * Features "Adapt this recipe" controls, scannable steps, and Cook Mode.
 * Desktop: Steps on left, Adapt + Ingredients on sticky right sidebar.
 * Mobile: Single column with sticky bottom action bar.
 * @param recipe - The full recipe data
 * @param relatedRecipes - Related recipes for "More like this" section
 * @param adminEditSheet - Server component for admin edit functionality
 * @param dangerZoneDialog - Server component for danger zone dialog
 */
export function FullRecipePageClient({
  recipe,
  relatedRecipes,
  adminEditSheet,
  dangerZoneDialog,
  hasV2Data = false,
  userNotes,
}: FullRecipePageProps): JSX.Element {
  const { isSignedIn, isLoaded } = useUser();
  const [servings, setServings] = useState(DEFAULT_SERVINGS);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("MEDIUM");
  const [isCookModeOpen, setIsCookModeOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const [generalNote, setGeneralNote] = useState(userNotes?.generalNote ?? "");
  const [savedGeneralNote, setSavedGeneralNote] = useState(userNotes?.generalNote ?? "");
  const [generalNoteSaveState, setGeneralNoteSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [generalNoteError, setGeneralNoteError] = useState("");

  const tags = recipe.tags.map((t) => t.tag);
  const steps = recipe.steps;
  const stepStrings = extractStepsFromContent(steps);
  const servingsMultiplier = servings / DEFAULT_SERVINGS;

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
          <form action={() => onPublishRecipe(recipe.id, true)}>
            <Button type="submit">Publish</Button>
          </form>
        </div>
      )}

      <RecipeHeader recipe={recipe} tags={tags} servings={servings} />

      <div className="mb-4 lg:hidden">
        <AdaptThisRecipe
          servings={servings}
          onServingsChange={setServings}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          hasV2Data={hasV2Data}
        />
      </div>

      <div className="mb-6 lg:hidden">
        <IngredientsPanel
          ingredients={recipe.ingredients}
          servingsMultiplier={servingsMultiplier}
          collapsible
          defaultOpen={false}
        />
      </div>

      <div className="flex gap-8">
        <main className="min-w-0 flex-1">
          <StepsList
            steps={steps}
            onStartCookMode={handleStartCookMode}
            recipeId={recipe.id}
            isSignedIn={!!isSignedIn}
            stepNotes={userNotes?.stepNotes}
          />

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Make it yours</CardTitle>
              <CardDescription>
                Save swaps, timing tweaks, and reminders for next time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignedIn>
                <div className="space-y-3">
                  <Textarea
                    value={generalNote}
                    onChange={(e) => setGeneralNote(e.target.value)}
                    placeholder="Your notes for this recipe..."
                    className="min-h-[100px]"
                    maxLength={2000}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleSaveGeneralNote}
                      disabled={generalNoteSaveState === "saving" || generalNote === savedGeneralNote}
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
                    <p className="text-sm text-destructive">{generalNoteError}</p>
                  )}
                </div>
              </SignedIn>
              <SignedOut>
                <p className="text-sm text-muted-foreground">
                  Log in to save personal notes.
                </p>
              </SignedOut>
            </CardContent>
          </Card>

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
              servings={servings}
              onServingsChange={setServings}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              hasV2Data={hasV2Data}
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
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onStartCookMode={handleStartCookMode}
        servings={servings}
        onServingsChange={setServings}
      />

      <CookModeOverlay
        isOpen={isCookModeOpen}
        onClose={() => setIsCookModeOpen(false)}
        steps={stepStrings}
        ingredients={recipe.ingredients}
      />
    </>
  );
}
