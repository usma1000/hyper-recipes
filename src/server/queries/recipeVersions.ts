import "server-only";
import { db } from "../db";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import {
  RecipeVersionsTable,
  RecipeStepsTable,
  VersionIngredientsTable,
  IngredientSubstitutionsTable,
  ScalingRulesTable,
  IngredientOverridesTable,
  StepOverridesTable,
  RecipesTable,
  type Difficulty,
  type NewRecipeVersion,
  type NewRecipeStep,
  type NewVersionIngredient,
  type NewIngredientSubstitution,
  type NewScalingRule,
  type NewIngredientOverride,
  type NewStepOverride,
} from "../db/schemas";
import { revalidateRecipePaths } from "./utils";
import { slugify } from "~/lib/utils";

/**
 * Creates a new recipe with all three versions (EASY, MEDIUM, HARD).
 * MEDIUM is set as the base version (isBase: true).
 * @param recipe - Basic recipe data (name, description, heroImageId)
 * @returns The created recipe with its versions
 */
export async function createRecipeWithVersionsAsync(recipe: {
  name: string;
  description: string;
  heroImageId?: number | null;
}): Promise<{
  recipeId: number;
  slug: string;
  versions: { easy: number; medium: number; hard: number };
}> {
  const user = auth();
  if (!user.userId) throw new Error("Not authenticated");

  const slug = slugify(recipe.name);

  return await db.transaction(async (tx) => {
    // Create the recipe
    const [newRecipe] = await tx
      .insert(RecipesTable)
      .values({
        name: recipe.name,
        slug,
        description: recipe.description,
        heroImageId: recipe.heroImageId ?? null,
        published: false,
      })
      .returning();

    if (!newRecipe) throw new Error("Failed to create recipe");

    // Create the three versions
    const versions: NewRecipeVersion[] = [
      { recipeId: newRecipe.id, difficulty: "EASY", isBase: false },
      { recipeId: newRecipe.id, difficulty: "MEDIUM", isBase: true },
      { recipeId: newRecipe.id, difficulty: "HARD", isBase: false },
    ];

    const createdVersions = await tx
      .insert(RecipeVersionsTable)
      .values(versions)
      .returning();

    const versionMap = {
      easy:
        createdVersions.find((v) => v.difficulty === "EASY")?.id ??
        (() => {
          throw new Error("EASY version not created");
        })(),
      medium:
        createdVersions.find((v) => v.difficulty === "MEDIUM")?.id ??
        (() => {
          throw new Error("MEDIUM version not created");
        })(),
      hard:
        createdVersions.find((v) => v.difficulty === "HARD")?.id ??
        (() => {
          throw new Error("HARD version not created");
        })(),
    };

    revalidateRecipePaths();

    return {
      recipeId: newRecipe.id,
      slug: newRecipe.slug,
      versions: versionMap,
    };
  });
}

/**
 * Gets all versions for a recipe.
 * @param recipeId - The recipe ID
 * @returns Array of versions with their IDs and difficulties
 */
export async function getRecipeVersionsAsync(
  recipeId: number,
): Promise<Array<{ id: number; difficulty: Difficulty; isBase: boolean }>> {
  const versions = await db.query.RecipeVersionsTable.findMany({
    where: eq(RecipeVersionsTable.recipeId, recipeId),
    columns: {
      id: true,
      difficulty: true,
      isBase: true,
    },
  });

  return versions;
}

/**
 * Gets the base (MEDIUM) version ID for a recipe.
 * @param recipeId - The recipe ID
 * @returns The MEDIUM version ID
 */
export async function getBaseVersionIdAsync(recipeId: number): Promise<number> {
  const version = await db.query.RecipeVersionsTable.findFirst({
    where: and(
      eq(RecipeVersionsTable.recipeId, recipeId),
      eq(RecipeVersionsTable.isBase, true),
    ),
    columns: { id: true },
  });

  if (!version) throw new Error("Base version not found");
  return version.id;
}

/**
 * Gets a version ID by recipe ID and difficulty.
 * @param recipeId - The recipe ID
 * @param difficulty - The difficulty level
 * @returns The version ID
 */
export async function getVersionIdByDifficultyAsync(
  recipeId: number,
  difficulty: Difficulty,
): Promise<number> {
  const version = await db.query.RecipeVersionsTable.findFirst({
    where: and(
      eq(RecipeVersionsTable.recipeId, recipeId),
      eq(RecipeVersionsTable.difficulty, difficulty),
    ),
    columns: { id: true },
  });

  if (!version) throw new Error(`${difficulty} version not found`);
  return version.id;
}

/**
 * Adds steps to a recipe version.
 * @param versionId - The version ID
 * @param steps - Array of steps to add
 * @returns The created step IDs
 */
export async function addStepsToVersionAsync(
  versionId: number,
  steps: Array<Omit<NewRecipeStep, "versionId">>,
): Promise<number[]> {
  const user = auth();
  if (!user.userId) throw new Error("Not authenticated");

  const stepsToInsert: NewRecipeStep[] = steps.map((step) => ({
    ...step,
    versionId,
  }));

  const createdSteps = await db
    .insert(RecipeStepsTable)
    .values(stepsToInsert)
    .returning({ id: RecipeStepsTable.id });

  revalidateRecipePaths();
  return createdSteps.map((s) => s.id);
}

/**
 * Updates steps for a version - replaces all existing steps.
 * @param versionId - The version ID
 * @param steps - New steps to set
 */
export async function updateVersionStepsAsync(
  versionId: number,
  steps: Array<Omit<NewRecipeStep, "versionId">>,
): Promise<void> {
  const user = auth();
  if (!user.userId) throw new Error("Not authenticated");

  await db.transaction(async (tx) => {
    // Delete existing steps
    await tx
      .delete(RecipeStepsTable)
      .where(eq(RecipeStepsTable.versionId, versionId));

    // Insert new steps
    if (steps.length > 0) {
      const stepsToInsert: NewRecipeStep[] = steps.map((step) => ({
        ...step,
        versionId,
      }));
      await tx.insert(RecipeStepsTable).values(stepsToInsert);
    }
  });

  revalidateRecipePaths();
}

/**
 * Adds ingredients to a recipe version.
 * @param versionId - The version ID
 * @param ingredients - Array of ingredients to add
 * @returns The created version ingredient IDs
 */
export async function addIngredientsToVersionAsync(
  versionId: number,
  ingredients: Array<Omit<NewVersionIngredient, "versionId">>,
): Promise<number[]> {
  const user = auth();
  if (!user.userId) throw new Error("Not authenticated");

  const ingredientsToInsert: NewVersionIngredient[] = ingredients.map(
    (ing) => ({
      ...ing,
      versionId,
    }),
  );

  const createdIngredients = await db
    .insert(VersionIngredientsTable)
    .values(ingredientsToInsert)
    .returning({ id: VersionIngredientsTable.id });

  revalidateRecipePaths();
  return createdIngredients.map((i) => i.id);
}

/**
 * Updates ingredients for a version - replaces all existing ingredients.
 * @param versionId - The version ID
 * @param ingredients - New ingredients to set
 */
export async function updateVersionIngredientsAsync(
  versionId: number,
  ingredients: Array<Omit<NewVersionIngredient, "versionId">>,
): Promise<void> {
  const user = auth();
  if (!user.userId) throw new Error("Not authenticated");

  await db.transaction(async (tx) => {
    // Delete existing ingredients (cascades to substitutions and scaling rules)
    await tx
      .delete(VersionIngredientsTable)
      .where(eq(VersionIngredientsTable.versionId, versionId));

    // Insert new ingredients
    if (ingredients.length > 0) {
      const ingredientsToInsert: NewVersionIngredient[] = ingredients.map(
        (ing) => ({
          ...ing,
          versionId,
        }),
      );
      await tx.insert(VersionIngredientsTable).values(ingredientsToInsert);
    }
  });

  revalidateRecipePaths();
}

/**
 * Adds a substitution for a version ingredient.
 * @param substitution - The substitution data
 * @returns The created substitution ID
 */
export async function addIngredientSubstitutionAsync(
  substitution: NewIngredientSubstitution,
): Promise<number> {
  const user = auth();
  if (!user.userId) throw new Error("Not authenticated");

  const [created] = await db
    .insert(IngredientSubstitutionsTable)
    .values(substitution)
    .returning({ id: IngredientSubstitutionsTable.id });

  if (!created) throw new Error("Failed to create substitution");
  revalidateRecipePaths();
  return created.id;
}

/**
 * Adds a scaling rule for a version ingredient.
 * @param rule - The scaling rule data
 * @returns The created scaling rule ID
 */
export async function addScalingRuleAsync(rule: NewScalingRule): Promise<number> {
  const user = auth();
  if (!user.userId) throw new Error("Not authenticated");

  const [created] = await db
    .insert(ScalingRulesTable)
    .values(rule)
    .returning({ id: ScalingRulesTable.id });

  if (!created) throw new Error("Failed to create scaling rule");
  revalidateRecipePaths();
  return created.id;
}

/**
 * Saves an ingredient override for a non-base version.
 * @param override - The override data
 * @returns The created override ID
 */
export async function saveIngredientOverrideAsync(
  override: NewIngredientOverride,
): Promise<number> {
  const user = auth();
  if (!user.userId) throw new Error("Not authenticated");

  const [created] = await db
    .insert(IngredientOverridesTable)
    .values(override)
    .returning({ id: IngredientOverridesTable.id });

  if (!created) throw new Error("Failed to create ingredient override");
  revalidateRecipePaths();
  return created.id;
}

/**
 * Gets all ingredient overrides for a version.
 * @param versionId - The version ID
 * @returns Array of ingredient overrides
 */
export async function getIngredientOverridesAsync(
  versionId: number,
): Promise<Array<typeof IngredientOverridesTable.$inferSelect>> {
  return await db.query.IngredientOverridesTable.findMany({
    where: eq(IngredientOverridesTable.versionId, versionId),
  });
}

/**
 * Saves a step override for a non-base version.
 * @param override - The override data
 * @returns The created override ID
 */
export async function saveStepOverrideAsync(
  override: NewStepOverride,
): Promise<number> {
  const user = auth();
  if (!user.userId) throw new Error("Not authenticated");

  const [created] = await db
    .insert(StepOverridesTable)
    .values(override)
    .returning({ id: StepOverridesTable.id });

  if (!created) throw new Error("Failed to create step override");
  revalidateRecipePaths();
  return created.id;
}

/**
 * Gets all step overrides for a version.
 * @param versionId - The version ID
 * @returns Array of step overrides
 */
export async function getStepOverridesAsync(
  versionId: number,
): Promise<Array<typeof StepOverridesTable.$inferSelect>> {
  return await db.query.StepOverridesTable.findMany({
    where: eq(StepOverridesTable.versionId, versionId),
  });
}

/**
 * Deletes all overrides for a version (used when resetting overrides).
 * @param versionId - The version ID
 */
export async function clearVersionOverridesAsync(
  versionId: number,
): Promise<void> {
  const user = auth();
  if (!user.userId) throw new Error("Not authenticated");

  await db.transaction(async (tx) => {
    await tx
      .delete(IngredientOverridesTable)
      .where(eq(IngredientOverridesTable.versionId, versionId));
    await tx
      .delete(StepOverridesTable)
      .where(eq(StepOverridesTable.versionId, versionId));
  });

  revalidateRecipePaths();
}

/**
 * Gets full version data including steps, ingredients, and all related data.
 * @param versionId - The version ID
 * @returns Full version data with all relations
 */
export async function getFullVersionDataAsync(versionId: number) {
  const version = await db.query.RecipeVersionsTable.findFirst({
    where: eq(RecipeVersionsTable.id, versionId),
    with: {
      recipe: true,
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
      ingredientOverrides: true,
      stepOverrides: true,
    },
  });

  if (!version) throw new Error("Version not found");
  return version;
}

