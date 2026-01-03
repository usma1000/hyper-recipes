/**
 * Backfill Script for Recipe Authoring v2
 *
 * This script migrates existing recipes to the v2 data model:
 * 1. Creates MEDIUM RecipeVersion (isBase: true) for each recipe
 * 2. Converts JSON steps to RecipeStep rows
 * 3. Converts RecipeIngredients to VersionIngredients
 * 4. Creates empty EASY/HARD versions
 *
 * Run with: npx tsx src/server/db/seed/backfillV2.ts
 */

import "dotenv/config";
import "~/env";
import { db } from "..";
import { eq } from "drizzle-orm";
import {
  RecipesTable,
  RecipeVersionsTable,
  RecipeStepsTable,
  VersionIngredientsTable,
  RecipeIngredientsTable,
} from "../schemas";

type JSONContent = {
  type?: string;
  content?: JSONContent[];
  text?: string;
};

/**
 * Extracts plain text steps from the JSON content structure.
 * @param content - The JSON content from the recipe
 * @returns Array of step instruction strings
 */
function extractStepsFromJson(content: JSONContent | null): string[] {
  if (!content || !content.content) return [];

  const steps: string[] = [];

  function extractText(node: JSONContent): string {
    if (node.text) return node.text;
    if (node.content) {
      return node.content.map(extractText).join("");
    }
    return "";
  }

  // Iterate through top-level content nodes
  for (const node of content.content) {
    const text = extractText(node).trim();
    if (text) {
      steps.push(text);
    }
  }

  return steps;
}

/**
 * Parses a quantity string into numeric value and unit.
 * Handles formats like "1/2 cup", "4 cups", "half", "1 tbsp", etc.
 * @param quantityStr - The quantity string from old schema
 * @returns Object with numeric quantity and unit, or null if parsing fails
 */
function parseQuantity(quantityStr: string): {
  quantity: string;
  unit: string;
} | null {
  const trimmed = quantityStr.trim().toLowerCase();

  // Common unit patterns
  const units = [
    "cup",
    "cups",
    "tbsp",
    "tablespoon",
    "tablespoons",
    "tsp",
    "teaspoon",
    "teaspoons",
    "oz",
    "ounce",
    "ounces",
    "lb",
    "pound",
    "pounds",
    "g",
    "gram",
    "grams",
    "kg",
    "kilogram",
    "kilograms",
    "ml",
    "milliliter",
    "milliliters",
    "l",
    "liter",
    "liters",
    "piece",
    "pieces",
    "whole",
    "pinch",
    "to taste",
  ];

  // Try to extract unit
  let unit = "unit";
  let quantityPart = trimmed;

  for (const u of units) {
    const regex = new RegExp(`\\b${u}\\b`, "i");
    if (regex.test(trimmed)) {
      unit = u;
      quantityPart = trimmed.replace(regex, "").trim();
      break;
    }
  }

  // Handle fractional quantities (1/2, 1/4, etc.)
  const fractionMatch = quantityPart.match(/(\d+)\/(\d+)/);
  if (fractionMatch) {
    const numerator = parseFloat(fractionMatch[1] ?? "0");
    const denominator = parseFloat(fractionMatch[2] ?? "1");
    const decimal = numerator / denominator;

    // Check for whole number before fraction (e.g., "1 1/2")
    const wholeMatch = quantityPart.match(/^(\d+)\s+/);
    if (wholeMatch) {
      const whole = parseFloat(wholeMatch[1] ?? "0");
      return {
        quantity: (whole + decimal).toString(),
        unit,
      };
    }

    return {
      quantity: decimal.toString(),
      unit,
    };
  }

  // Handle word quantities
  const wordQuantities: Record<string, number> = {
    half: 0.5,
    quarter: 0.25,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
  };

  if (wordQuantities[trimmed] !== undefined) {
    return {
      quantity: wordQuantities[trimmed]?.toString() ?? "1",
      unit,
    };
  }

  // Try to extract numeric value
  const numberMatch = quantityPart.match(/(\d+\.?\d*)/);
  if (numberMatch) {
    return {
      quantity: numberMatch[1] ?? "1",
      unit,
    };
  }

  // If all else fails, default to 1
  return {
    quantity: "1",
    unit: unit === "unit" ? trimmed : unit,
  };
}

/**
 * Main backfill function.
 * Migrates all existing recipes to v2 model.
 */
async function backfillRecipesToV2(): Promise<void> {
  console.log("Starting Recipe Authoring v2 backfill...\n");

  // Get all recipes that don't have versions yet
  const existingRecipes = await db.query.RecipesTable.findMany({
    with: {
      ingredients: {
        with: {
          ingredient: true,
        },
      },
    },
  });

  // Get recipes that already have versions
  const recipesWithVersions = await db.query.RecipeVersionsTable.findMany({
    columns: { recipeId: true },
  });
  const recipesWithVersionsSet = new Set(
    recipesWithVersions.map((v) => v.recipeId),
  );

  // Filter to recipes without v2 data
  const recipesToMigrate = existingRecipes.filter(
    (r) => !recipesWithVersionsSet.has(r.id),
  );

  console.log(`Found ${recipesToMigrate.length} recipes to migrate.\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const recipe of recipesToMigrate) {
    try {
      console.log(`Migrating: ${recipe.name} (ID: ${recipe.id})`);

      await db.transaction(async (tx) => {
        // 1. Create the three versions
        const [easyVersion, mediumVersion, hardVersion] = await tx
          .insert(RecipeVersionsTable)
          .values([
            { recipeId: recipe.id, difficulty: "EASY", isBase: false },
            { recipeId: recipe.id, difficulty: "MEDIUM", isBase: true },
            { recipeId: recipe.id, difficulty: "HARD", isBase: false },
          ])
          .returning();

        if (!mediumVersion) throw new Error("Failed to create MEDIUM version");

        // 2. Convert JSON steps to RecipeStep rows
        const stepStrings = extractStepsFromJson(
          recipe.steps as JSONContent | null,
        );
        if (stepStrings.length > 0) {
          await tx.insert(RecipeStepsTable).values(
            stepStrings.map((instruction, index) => ({
              versionId: mediumVersion.id,
              stepOrder: index + 1,
              instruction,
              mediaUrl: null,
              timerSeconds: null,
              skillLevel: null,
              tools: null,
              techniques: null,
            })),
          );
          console.log(`  - Created ${stepStrings.length} steps`);
        }

        // 3. Convert RecipeIngredients to VersionIngredients
        if (recipe.ingredients.length > 0) {
          const versionIngredients = recipe.ingredients
            .map((ri) => {
              const parsed = parseQuantity(ri.quantity);
              if (!parsed) {
                console.warn(
                  `  - Warning: Could not parse quantity "${ri.quantity}" for ingredient ${ri.ingredientId}, skipping`,
                );
                return null;
              }
              return {
                versionId: mediumVersion.id,
                ingredientId: ri.ingredientId,
                quantity: parsed.quantity,
                unit: parsed.unit,
                notes: null,
                isOptional: false,
              };
            })
            .filter(
              (
                ing,
              ): ing is {
                versionId: number;
                ingredientId: number;
                quantity: string;
                unit: string;
                notes: null;
                isOptional: false;
              } => ing !== null,
            );

          if (versionIngredients.length > 0) {
            await tx.insert(VersionIngredientsTable).values(versionIngredients);
            console.log(`  - Created ${versionIngredients.length} ingredients`);
          }
        }

        // Log version IDs
        console.log(
          `  - Versions created: EASY=${easyVersion?.id}, MEDIUM=${mediumVersion.id}, HARD=${hardVersion?.id}`,
        );
      });

      successCount++;
      console.log(`  - Success!\n`);
    } catch (error) {
      errorCount++;
      console.error(`  - Error: ${error instanceof Error ? error.message : "Unknown error"}\n`);
    }
  }

  console.log("\n=== Backfill Complete ===");
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total: ${recipesToMigrate.length}`);
}

/**
 * Verifies the backfill by checking a sample of migrated recipes.
 */
async function verifyBackfill(): Promise<void> {
  console.log("\n=== Verification ===\n");

  const versions = await db.query.RecipeVersionsTable.findMany({
    with: {
      recipe: {
        columns: { name: true },
      },
      steps: true,
      versionIngredients: true,
    },
    limit: 10,
  });

  for (const version of versions) {
    if (version.isBase) {
      console.log(`Recipe: ${version.recipe.name}`);
      console.log(`  - Version ID: ${version.id} (${version.difficulty})`);
      console.log(`  - Steps: ${version.steps.length}`);
      console.log(`  - Ingredients: ${version.versionIngredients.length}`);
      console.log("");
    }
  }
}

// Main execution
async function main(): Promise<void> {
  try {
    await backfillRecipesToV2();
    await verifyBackfill();
    process.exit(0);
  } catch (error) {
    console.error("Backfill failed:", error);
    process.exit(1);
  }
}

main();

