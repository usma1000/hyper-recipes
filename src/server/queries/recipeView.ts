import "server-only";
import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import {
  RecipeVersionsTable,
  RecipeStepsTable,
  VersionIngredientsTable,
  IngredientOverridesTable,
  StepOverridesTable,
  type Difficulty,
  type RecipeStep,
  type VersionIngredient,
  type IngredientOverrideData,
  type AddIngredientOverrideData,
  type UpdateIngredientOverrideData,
  type ReplaceIngredientOverrideData,
  type StepOverrideData,
  type AddStepOverrideData,
  type UpdateStepOverrideData,
  type ReplaceStepOverrideData,
  type ScalingRuleType,
} from "../db/schemas";

const DEFAULT_SERVINGS = 4;

/**
 * Computed ingredient after applying overrides and scaling.
 */
export type ComputedIngredient = {
  id: number;
  ingredientId: number;
  ingredientName: string;
  ingredientDescription: string | null;
  quantity: number;
  unit: string;
  notes: string | null;
  isOptional: boolean;
  substitutions: Array<{
    ingredientId: number;
    ingredientName: string;
    quantity: number;
    unit: string;
    notes: string | null;
  }>;
};

/**
 * Computed step after applying overrides.
 */
export type ComputedStep = {
  id: number;
  stepOrder: number;
  instruction: string;
  mediaUrl: string | null;
  timerSeconds: number | null;
  skillLevel: "beginner" | "intermediate" | "advanced" | null;
  tools: string[] | null;
  techniques: string[] | null;
};

/**
 * Full computed recipe view returned by getRecipeView.
 */
export type ComputedRecipeView = {
  recipeId: number;
  recipeName: string;
  recipeSlug: string;
  recipeDescription: string;
  heroImageUrl: string | null;
  difficulty: Difficulty;
  servings: number;
  baseServings: number;
  ingredients: ComputedIngredient[];
  steps: ComputedStep[];
  prepTime: number | null;
  cookTime: number | null;
  published: boolean;
};

/**
 * Raw ingredient data from the database with all relations.
 */
type RawVersionIngredient = VersionIngredient & {
  ingredient: { id: number; name: string; description: string | null };
  substitutions: Array<{
    id: number;
    substituteIngredientId: number;
    substituteQuantity: string;
    substituteUnit: string;
    notes: string | null;
    substituteIngredient: { id: number; name: string };
  }>;
  scalingRules: Array<{
    id: number;
    ruleType: ScalingRuleType;
    factor: string | null;
    minServings: number | null;
    maxServings: number | null;
    stepSize: string | null;
  }>;
};

/**
 * Applies scaling to an ingredient quantity based on its scaling rules.
 * @param baseQuantity - The base quantity for default servings
 * @param scalingRules - The scaling rules for this ingredient
 * @param servingsMultiplier - The ratio of target servings to base servings
 * @returns The scaled quantity
 */
function applyScaling(
  baseQuantity: number,
  scalingRules: RawVersionIngredient["scalingRules"],
  servingsMultiplier: number,
): number {
  // Default to linear scaling if no rules
  if (scalingRules.length === 0) {
    return baseQuantity * servingsMultiplier;
  }

  // Use the first applicable rule
  const rule = scalingRules[0];
  if (!rule) return baseQuantity * servingsMultiplier;

  switch (rule.ruleType) {
    case "fixed":
      // Quantity stays constant regardless of servings
      return baseQuantity;

    case "step":
      // Round up to the nearest step size
      const stepSize = rule.stepSize ? parseFloat(rule.stepSize) : 1;
      const scaled = baseQuantity * servingsMultiplier;
      return Math.ceil(scaled / stepSize) * stepSize;

    case "linear":
    default:
      // Apply custom factor if provided, otherwise use servings multiplier
      const factor = rule.factor ? parseFloat(rule.factor) : servingsMultiplier;
      return baseQuantity * factor;
  }
}

/**
 * Applies ingredient overrides to the base ingredients.
 * @param baseIngredients - The base MEDIUM ingredients
 * @param overrides - The ingredient overrides from the target version
 * @returns Modified ingredients array
 */
function applyIngredientOverrides(
  baseIngredients: RawVersionIngredient[],
  overrides: Array<{
    operation: "ADD" | "REMOVE" | "UPDATE" | "REPLACE";
    targetIngredientId: number | null;
    overrideData: IngredientOverrideData;
  }>,
): RawVersionIngredient[] {
  let result = [...baseIngredients];

  for (const override of overrides) {
    switch (override.operation) {
      case "REMOVE":
        if (override.targetIngredientId !== null) {
          result = result.filter(
            (ing) => ing.id !== override.targetIngredientId,
          );
        }
        break;

      case "UPDATE":
        if (override.targetIngredientId !== null && override.overrideData) {
          const updateData = override.overrideData as UpdateIngredientOverrideData;
          result = result.map((ing) => {
            if (ing.id === override.targetIngredientId) {
              return {
                ...ing,
                quantity: updateData.quantity ?? ing.quantity,
                unit: updateData.unit ?? ing.unit,
                notes: updateData.notes ?? ing.notes,
                isOptional: updateData.isOptional ?? ing.isOptional,
              };
            }
            return ing;
          });
        }
        break;

      case "REPLACE":
        if (override.targetIngredientId !== null && override.overrideData) {
          const replaceData = override.overrideData as ReplaceIngredientOverrideData;
          result = result.map((ing) => {
            if (ing.id === override.targetIngredientId) {
              return {
                ...ing,
                ingredientId: replaceData.newIngredientId,
                quantity: replaceData.quantity,
                unit: replaceData.unit,
                notes: replaceData.notes ?? null,
                // Keep the ingredient relation as placeholder - will need fetch
                ingredient: {
                  id: replaceData.newIngredientId,
                  name: "Replaced ingredient",
                  description: null,
                },
              };
            }
            return ing;
          });
        }
        break;

      case "ADD":
        if (override.overrideData) {
          const addData = override.overrideData as AddIngredientOverrideData;
          const newIngredient: RawVersionIngredient = {
            id: -Date.now(), // Temporary negative ID for added ingredients
            versionId: 0,
            ingredientId: addData.ingredientId,
            quantity: addData.quantity,
            unit: addData.unit,
            notes: addData.notes ?? null,
            isOptional: addData.isOptional ?? false,
            ingredient: {
              id: addData.ingredientId,
              name: "Added ingredient",
              description: null,
            },
            substitutions: [],
            scalingRules: [],
          };
          result.push(newIngredient);
        }
        break;
    }
  }

  return result;
}

/**
 * Applies step overrides to the base steps.
 * @param baseSteps - The base MEDIUM steps
 * @param overrides - The step overrides from the target version
 * @returns Modified steps array
 */
function applyStepOverrides(
  baseSteps: RecipeStep[],
  overrides: Array<{
    operation: "ADD" | "REMOVE" | "UPDATE" | "REPLACE";
    targetStepId: number | null;
    overrideData: StepOverrideData;
  }>,
): RecipeStep[] {
  let result = [...baseSteps];

  for (const override of overrides) {
    switch (override.operation) {
      case "REMOVE":
        if (override.targetStepId !== null) {
          result = result.filter((step) => step.id !== override.targetStepId);
        }
        break;

      case "UPDATE":
        if (override.targetStepId !== null && override.overrideData) {
          const updateData = override.overrideData as UpdateStepOverrideData;
          result = result.map((step) => {
            if (step.id === override.targetStepId) {
              return {
                ...step,
                instruction: updateData.instruction ?? step.instruction,
                mediaUrl: updateData.mediaUrl ?? step.mediaUrl,
                timerSeconds: updateData.timerSeconds ?? step.timerSeconds,
                skillLevel: updateData.skillLevel ?? step.skillLevel,
                tools: updateData.tools ?? step.tools,
                techniques: updateData.techniques ?? step.techniques,
              };
            }
            return step;
          });
        }
        break;

      case "REPLACE":
        if (override.targetStepId !== null && override.overrideData) {
          const replaceData = override.overrideData as ReplaceStepOverrideData;
          result = result.map((step) => {
            if (step.id === override.targetStepId) {
              return {
                ...step,
                instruction: replaceData.instruction,
                mediaUrl: replaceData.mediaUrl ?? null,
                timerSeconds: replaceData.timerSeconds ?? null,
                skillLevel: replaceData.skillLevel ?? null,
                tools: replaceData.tools ?? null,
                techniques: replaceData.techniques ?? null,
              };
            }
            return step;
          });
        }
        break;

      case "ADD":
        if (override.overrideData) {
          const addData = override.overrideData as AddStepOverrideData;
          const newStep: RecipeStep = {
            id: -Date.now(),
            versionId: 0,
            stepOrder: addData.stepOrder,
            instruction: addData.instruction,
            mediaUrl: addData.mediaUrl ?? null,
            timerSeconds: addData.timerSeconds ?? null,
            skillLevel: addData.skillLevel ?? null,
            tools: addData.tools ?? null,
            techniques: addData.techniques ?? null,
          };
          result.push(newStep);
          // Re-sort by step order after adding
          result.sort((a, b) => a.stepOrder - b.stepOrder);
        }
        break;
    }
  }

  return result;
}

/**
 * Core function to get a computed recipe view.
 * Loads base MEDIUM version, applies overrides for target difficulty,
 * and applies scaling based on servings.
 * @param recipeId - The recipe ID
 * @param difficulty - The target difficulty (EASY, MEDIUM, or HARD)
 * @param servings - The desired number of servings (defaults to 4)
 * @returns The computed recipe view
 */
export const getRecipeViewAsync = unstable_cache(
  async (
    recipeId: number,
    difficulty: Difficulty,
    servings: number = DEFAULT_SERVINGS,
  ): Promise<ComputedRecipeView> => {
    // 1. Get the base MEDIUM version with all data
    const baseVersion = await db.query.RecipeVersionsTable.findFirst({
      where: and(
        eq(RecipeVersionsTable.recipeId, recipeId),
        eq(RecipeVersionsTable.isBase, true),
      ),
      with: {
        recipe: {
          with: {
            heroImage: true,
          },
        },
        steps: {
          orderBy: (steps, { asc }) => [asc(steps.stepOrder)],
        },
        versionIngredients: {
          with: {
            ingredient: true,
            substitutions: {
              with: {
                substituteIngredient: true,
              },
            },
            scalingRules: true,
          },
        },
      },
    });

    if (!baseVersion) throw new Error("Base recipe version not found");

    let ingredients = baseVersion.versionIngredients as RawVersionIngredient[];
    let steps = baseVersion.steps;

    // 2. If not MEDIUM, get target version and apply overrides
    if (difficulty !== "MEDIUM") {
      const targetVersion = await db.query.RecipeVersionsTable.findFirst({
        where: and(
          eq(RecipeVersionsTable.recipeId, recipeId),
          eq(RecipeVersionsTable.difficulty, difficulty),
        ),
        columns: { id: true },
      });

      if (targetVersion) {
        // Get ingredient overrides
        const ingredientOverrides =
          await db.query.IngredientOverridesTable.findMany({
            where: eq(IngredientOverridesTable.versionId, targetVersion.id),
          });

        // Get step overrides
        const stepOverrides = await db.query.StepOverridesTable.findMany({
          where: eq(StepOverridesTable.versionId, targetVersion.id),
        });

        // Apply overrides
        ingredients = applyIngredientOverrides(ingredients, ingredientOverrides);
        steps = applyStepOverrides(steps, stepOverrides);
      }
    }

    // 3. Apply scaling based on servings
    const servingsMultiplier = servings / DEFAULT_SERVINGS;

    const computedIngredients: ComputedIngredient[] = ingredients.map((ing) => {
      const baseQuantity = parseFloat(ing.quantity);
      const scaledQuantity = applyScaling(
        baseQuantity,
        ing.scalingRules,
        servingsMultiplier,
      );

      return {
        id: ing.id,
        ingredientId: ing.ingredientId,
        ingredientName: ing.ingredient.name,
        ingredientDescription: ing.ingredient.description,
        quantity: scaledQuantity,
        unit: ing.unit,
        notes: ing.notes,
        isOptional: ing.isOptional,
        substitutions: ing.substitutions.map((sub) => ({
          ingredientId: sub.substituteIngredientId,
          ingredientName: sub.substituteIngredient.name,
          quantity:
            parseFloat(sub.substituteQuantity) * servingsMultiplier,
          unit: sub.substituteUnit,
          notes: sub.notes,
        })),
      };
    });

    const computedSteps: ComputedStep[] = steps.map((step) => ({
      id: step.id,
      stepOrder: step.stepOrder,
      instruction: step.instruction,
      mediaUrl: step.mediaUrl,
      timerSeconds: step.timerSeconds,
      skillLevel: step.skillLevel,
      tools: step.tools,
      techniques: step.techniques,
    }));

    // 4. Return computed view
    return {
      recipeId: baseVersion.recipe.id,
      recipeName: baseVersion.recipe.name,
      recipeSlug: baseVersion.recipe.slug,
      recipeDescription: baseVersion.recipe.description,
      heroImageUrl: baseVersion.recipe.heroImage?.url ?? null,
      difficulty,
      servings,
      baseServings: DEFAULT_SERVINGS,
      ingredients: computedIngredients,
      steps: computedSteps,
      prepTime: baseVersion.recipe.prepTime,
      cookTime: baseVersion.recipe.cookTime,
      published: baseVersion.recipe.published,
    };
  },
  ["recipe-view"],
  { revalidate: 60, tags: ["recipes", "recipe-versions"] },
);

/**
 * Simplified version that gets the MEDIUM view at default servings.
 * Useful for quick recipe display without difficulty/servings customization.
 * @param recipeId - The recipe ID
 * @returns The computed recipe view for MEDIUM difficulty
 */
export async function getDefaultRecipeViewAsync(
  recipeId: number,
): Promise<ComputedRecipeView> {
  return getRecipeViewAsync(recipeId, "MEDIUM", DEFAULT_SERVINGS);
}

/**
 * Checks if a recipe has v2 data (versions, steps, ingredients).
 * Used during migration period to determine which reader to use.
 * @param recipeId - The recipe ID
 * @returns True if recipe has v2 data
 */
export async function hasV2DataAsync(recipeId: number): Promise<boolean> {
  const version = await db.query.RecipeVersionsTable.findFirst({
    where: eq(RecipeVersionsTable.recipeId, recipeId),
    columns: { id: true },
  });

  return version !== undefined;
}

