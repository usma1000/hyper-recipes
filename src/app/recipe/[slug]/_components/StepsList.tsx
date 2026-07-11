"use client";

import { useState, useCallback } from "react";
import { type JSONContent } from "novel";
import { StepCard } from "./StepCard";
import { CookingTips } from "./CookingTips";
import { saveStepNote } from "~/app/_actions/userNotes";
import type { IngredientSwap } from "./AdaptThisRecipe";

interface StepsListProps {
  steps?: JSONContent | null;
  stepInstructions?: string[];
  recipeId: number;
  isSignedIn: boolean;
  stepNotes?: Record<number, string>;
  isLoading?: boolean;
  swaps?: IngredientSwap[];
}

/**
 * Extracts plain text steps from Novel editor JSON format.
 * @param content - Novel editor JSON content
 * @returns Array of step strings
 */
function extractStepsFromContent(content: JSONContent | null): string[] {
  if (!content?.content) return [];

  const steps: string[] = [];

  const extractText = (node: JSONContent): string => {
    if (node.type === "text" && node.text) {
      return node.text;
    }
    if (node.content) {
      return node.content.map(extractText).join("");
    }
    return "";
  };

  for (const node of content.content) {
    if (node.type === "orderedList" || node.type === "bulletList") {
      for (const item of node.content ?? []) {
        const text = extractText(item).trim();
        if (text) {
          steps.push(text);
        }
      }
    } else if (node.type === "paragraph" || node.type === "heading") {
      const text = extractText(node).trim();
      if (text && text !== "There are no steps for this one.") {
        steps.push(text);
      }
    }
  }

  return steps;
}

/**
 * Steps list with cooking tips (cues, fixes, swaps).
 * @param steps - Novel editor JSON content (v1)
 * @param stepInstructions - Precomputed step strings (v2)
 * @param recipeId - The recipe ID for saving notes
 * @param isSignedIn - Whether the user is signed in
 * @param stepNotes - Existing notes for each step
 * @param isLoading - Whether adapted steps are loading
 * @param swaps - Ingredient substitution suggestions
 */
export function StepsList({
  steps = null,
  stepInstructions,
  recipeId,
  isSignedIn,
  stepNotes = {},
  isLoading = false,
  swaps = [],
}: StepsListProps): JSX.Element {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const stepStrings = stepInstructions ?? extractStepsFromContent(steps);

  const toggleStepCompletion = (index: number): void => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSaveStepNote = useCallback(
    async (stepIndex: number, note: string) => {
      return await saveStepNote(recipeId, stepIndex, note);
    },
    [recipeId],
  );

  return (
    <section className="space-y-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
          Method
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          Steps
        </h2>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground">Updating steps...</p>
        </div>
      ) : stepStrings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground">
            No steps available for this recipe.
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          {stepStrings.map((step, index) => (
            <li key={index}>
              <StepCard
                stepNumber={index + 1}
                content={step}
                isCompleted={completedSteps.has(index)}
                onClick={() => toggleStepCompletion(index)}
                isSignedIn={isSignedIn}
                note={stepNotes[index] ?? ""}
                onSaveNote={(note) => handleSaveStepNote(index, note)}
              />
            </li>
          ))}
        </ol>
      )}

      <CookingTips swaps={swaps} />
    </section>
  );
}

export { extractStepsFromContent };
