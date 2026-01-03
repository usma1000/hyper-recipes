"use server";

import { auth } from "@clerk/nextjs/server";
import {
  createRecipeWithVersionsAsync,
  addStepsToVersionAsync,
  addIngredientsToVersionAsync,
  saveIngredientOverrideAsync,
  saveStepOverrideAsync,
  getVersionIdByDifficultyAsync,
  addIngredientSubstitutionAsync,
  addScalingRuleAsync,
} from "~/server/queries/recipeVersions";
import { createOrGetIngredient } from "~/server/queries/ingredients";
import type { RecipeWizardFormData } from "./types";

type SubmitResult = {
  success: boolean;
  slug?: string;
  recipeId?: number;
  error?: string;
};

/**
 * Submits the complete recipe wizard form data.
 * Creates the recipe with all three versions and saves ingredients/steps.
 * @param data - The complete wizard form data
 * @returns Result with success status and slug/error
 */
export async function submitRecipeWizard(
  data: RecipeWizardFormData,
): Promise<SubmitResult> {
  const user = auth();
  if (!user.userId) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // 1. Create the recipe with all three versions
    const { recipeId, slug, versions } = await createRecipeWithVersionsAsync({
      name: data.name,
      description: data.description,
      heroImageId: data.heroImageId,
    });

    // 2. Process ingredients - create or get ingredient IDs
    const ingredientIds = await Promise.all(
      data.ingredients.map(async (ing) => {
        if (ing.ingredientId) {
          return ing.ingredientId;
        }
        // Create new ingredient if it doesn't exist
        const result = await createOrGetIngredient(ing.ingredientName);
        return result.id;
      }),
    );

    // 3. Add ingredients to MEDIUM version
    const versionIngredientIds = await addIngredientsToVersionAsync(
      versions.medium,
      data.ingredients.map((ing, index) => ({
        ingredientId: ingredientIds[index] ?? 0,
        quantity: ing.quantity,
        unit: ing.unit,
        notes: ing.notes ?? null,
        isOptional: ing.isOptional,
      })),
    );

    // 4. Add substitutions and scaling rules
    for (let i = 0; i < data.ingredients.length; i++) {
      const ing = data.ingredients[i];
      const versionIngredientId = versionIngredientIds[i];

      if (!ing || versionIngredientId === undefined) continue;

      // Add substitutions
      if (ing.substitutions && ing.substitutions.length > 0) {
        for (const sub of ing.substitutions) {
          let subIngredientId = sub.ingredientId;
          if (!subIngredientId) {
            const result = await createOrGetIngredient(sub.ingredientName);
            subIngredientId = result.id;
          }

          await addIngredientSubstitutionAsync({
            versionIngredientId,
            substituteIngredientId: subIngredientId,
            substituteQuantity: sub.quantity,
            substituteUnit: sub.unit,
            notes: sub.notes ?? null,
          });
        }
      }

      // Add scaling rule if configured
      if (ing.scalingRule) {
        await addScalingRuleAsync({
          versionIngredientId,
          ruleType: ing.scalingRule.ruleType,
          factor: ing.scalingRule.factor?.toString() ?? null,
          minServings: ing.scalingRule.minServings ?? null,
          maxServings: ing.scalingRule.maxServings ?? null,
          stepSize: ing.scalingRule.stepSize?.toString() ?? null,
        });
      }
    }

    // 5. Add steps to MEDIUM version
    const stepIds = await addStepsToVersionAsync(
      versions.medium,
      data.steps.map((step, index) => ({
        stepOrder: index + 1,
        instruction: step.instruction,
        mediaUrl: step.mediaUrl ?? null,
        timerSeconds: step.timerSeconds ?? null,
        skillLevel: step.skillLevel ?? null,
        tools: step.tools ?? null,
        techniques: step.techniques ?? null,
      })),
    );

    // 6. Save EASY variation overrides
    for (const override of data.easyVariation.ingredientOverrides) {
      await saveIngredientOverrideAsync({
        versionId: versions.easy,
        operation: override.operation,
        targetIngredientId: override.targetIngredientId
          ? versionIngredientIds[
              data.ingredients.findIndex((i) => i.id === override.targetIngredientId)
            ] ?? null
          : null,
        overrideData: override.data ?? null,
      });
    }

    for (const override of data.easyVariation.stepOverrides) {
      await saveStepOverrideAsync({
        versionId: versions.easy,
        operation: override.operation,
        targetStepId: override.targetStepId
          ? stepIds[data.steps.findIndex((s) => s.id === override.targetStepId)] ?? null
          : null,
        overrideData: override.data ?? null,
      });
    }

    // 7. Save HARD variation overrides
    for (const override of data.hardVariation.ingredientOverrides) {
      await saveIngredientOverrideAsync({
        versionId: versions.hard,
        operation: override.operation,
        targetIngredientId: override.targetIngredientId
          ? versionIngredientIds[
              data.ingredients.findIndex((i) => i.id === override.targetIngredientId)
            ] ?? null
          : null,
        overrideData: override.data ?? null,
      });
    }

    for (const override of data.hardVariation.stepOverrides) {
      await saveStepOverrideAsync({
        versionId: versions.hard,
        operation: override.operation,
        targetStepId: override.targetStepId
          ? stepIds[data.steps.findIndex((s) => s.id === override.targetStepId)] ?? null
          : null,
        overrideData: override.data ?? null,
      });
    }

    return { success: true, slug, recipeId };
  } catch (error) {
    console.error("Failed to submit recipe:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create recipe",
    };
  }
}

/**
 * Saves the current wizard state as a draft.
 * For now, this just logs the data - full draft persistence can be added later.
 * @param data - The current wizard form data
 * @returns Result with success status
 */
export async function saveDraft(
  data: RecipeWizardFormData,
): Promise<{ success: boolean; error?: string }> {
  const user = auth();
  if (!user.userId) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // TODO: Implement draft persistence (localStorage or server-side)
    console.log("Draft data:", JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error("Failed to save draft:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save draft",
    };
  }
}

