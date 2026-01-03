"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Clock, Users, ChefHat } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type {
  RecipeWizardFormData,
  WizardIngredient,
  WizardStep,
} from "./types";

const DEFAULT_SERVINGS = 4;

/**
 * Applies ingredient overrides to get the computed ingredient list.
 */
function applyIngredientOverrides(
  baseIngredients: WizardIngredient[],
  overrides: RecipeWizardFormData["easyVariation"]["ingredientOverrides"],
): WizardIngredient[] {
  let result = [...baseIngredients];

  for (const override of overrides) {
    switch (override.operation) {
      case "REMOVE":
        result = result.filter((ing) => ing.id !== override.targetIngredientId);
        break;
      case "UPDATE":
        result = result.map((ing) => {
          if (ing.id === override.targetIngredientId && override.data) {
            return {
              ...ing,
              quantity: override.data.quantity ?? ing.quantity,
              unit: override.data.unit ?? ing.unit,
              notes: override.data.notes ?? ing.notes,
            };
          }
          return ing;
        });
        break;
      case "ADD":
        if (override.data?.ingredientName) {
          result.push({
            id: override.id,
            ingredientName: override.data.ingredientName,
            quantity: override.data.quantity ?? "",
            unit: override.data.unit ?? "",
            isOptional: override.data.isOptional ?? false,
          });
        }
        break;
    }
  }

  return result;
}

/**
 * Applies step overrides to get the computed step list.
 */
function applyStepOverrides(
  baseSteps: WizardStep[],
  overrides: RecipeWizardFormData["easyVariation"]["stepOverrides"],
): WizardStep[] {
  let result = [...baseSteps];

  for (const override of overrides) {
    switch (override.operation) {
      case "REMOVE":
        result = result.filter((step) => step.id !== override.targetStepId);
        break;
      case "UPDATE":
      case "REPLACE":
        result = result.map((step) => {
          if (step.id === override.targetStepId && override.data) {
            return {
              ...step,
              instruction: override.data.instruction ?? step.instruction,
            };
          }
          return step;
        });
        break;
      case "ADD":
        if (override.data?.instruction) {
          result.push({
            id: override.id,
            instruction: override.data.instruction,
          });
        }
        break;
    }
  }

  return result;
}

/**
 * Scales ingredient quantity based on servings.
 */
function scaleQuantity(
  quantity: string,
  servingsMultiplier: number,
): string {
  const num = parseFloat(quantity);
  if (isNaN(num)) return quantity;
  const scaled = num * servingsMultiplier;
  // Round to 2 decimal places and remove trailing zeros
  return parseFloat(scaled.toFixed(2)).toString();
}

/**
 * Wizard step for previewing the recipe at different difficulties and servings.
 */
export function WizardPreview(): JSX.Element {
  const { watch } = useFormContext<RecipeWizardFormData>();
  const [servings, setServings] = useState(DEFAULT_SERVINGS);
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(
    "MEDIUM",
  );

  const formData = watch();
  const servingsMultiplier = servings / DEFAULT_SERVINGS;

  // Compute ingredients and steps based on difficulty
  let displayIngredients = formData.ingredients;
  let displaySteps = formData.steps;

  if (difficulty === "EASY") {
    displayIngredients = applyIngredientOverrides(
      formData.ingredients,
      formData.easyVariation.ingredientOverrides,
    );
    displaySteps = applyStepOverrides(
      formData.steps,
      formData.easyVariation.stepOverrides,
    );
  } else if (difficulty === "HARD") {
    displayIngredients = applyIngredientOverrides(
      formData.ingredients,
      formData.hardVariation.ingredientOverrides,
    );
    displaySteps = applyStepOverrides(
      formData.steps,
      formData.hardVariation.stepOverrides,
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Recipe Preview</h3>
        <p className="text-sm text-muted-foreground">
          See how your recipe looks at different difficulties and serving sizes
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Difficulty selector */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Difficulty
              </label>
              <Tabs
                value={difficulty}
                onValueChange={(v) =>
                  setDifficulty(v as "EASY" | "MEDIUM" | "HARD")
                }
              >
                <TabsList>
                  <TabsTrigger value="EASY">Easy</TabsTrigger>
                  <TabsTrigger value="MEDIUM">Medium</TabsTrigger>
                  <TabsTrigger value="HARD">Hard</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Servings slider */}
            <div className="flex-1 max-w-xs">
              <label className="mb-2 block text-sm font-medium">
                <Users className="mr-1 inline h-4 w-4" />
                Servings: {servings}
              </label>
              <input
                type="range"
                min={1}
                max={12}
                value={servings}
                onChange={(e) => setServings(parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipe preview */}
      <div className="rounded-lg border bg-card">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {formData.name || "Untitled Recipe"}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {formData.description || "No description provided"}
              </p>
            </div>
            <Badge
              variant={
                difficulty === "EASY"
                  ? "secondary"
                  : difficulty === "HARD"
                    ? "destructive"
                    : "default"
              }
            >
              {difficulty}
            </Badge>
          </div>

          {/* Meta info */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {servings} servings
            </span>
            <span className="flex items-center gap-1">
              <ChefHat className="h-4 w-4" />
              {displaySteps.length} steps
            </span>
          </div>
        </div>

        <Separator />

        {/* Content */}
        <div className="grid gap-6 p-6 md:grid-cols-3">
          {/* Ingredients */}
          <div className="md:col-span-1">
            <h2 className="mb-4 font-semibold">Ingredients</h2>
            {displayIngredients.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No ingredients added
              </p>
            ) : (
              <ul className="space-y-2">
                {displayIngredients.map((ing) => (
                  <li
                    key={ing.id}
                    className={`text-sm ${ing.isOptional ? "text-muted-foreground" : ""}`}
                  >
                    <span className="font-medium">
                      {scaleQuantity(ing.quantity, servingsMultiplier)}{" "}
                      {ing.unit}
                    </span>{" "}
                    {ing.ingredientName}
                    {ing.isOptional && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        optional
                      </Badge>
                    )}
                    {ing.notes && (
                      <span className="block text-xs text-muted-foreground">
                        {ing.notes}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Steps */}
          <div className="md:col-span-2">
            <h2 className="mb-4 font-semibold">Instructions</h2>
            {displaySteps.length === 0 ? (
              <p className="text-sm text-muted-foreground">No steps added</p>
            ) : (
              <ol className="space-y-4">
                {displaySteps.map((step, index) => (
                  <li key={step.id} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{step.instruction}</p>
                      {step.timerSeconds && (
                        <Badge variant="secondary" className="mt-2">
                          <Clock className="mr-1 h-3 w-3" />
                          {Math.floor(step.timerSeconds / 60)}m{" "}
                          {step.timerSeconds % 60}s
                        </Badge>
                      )}
                      {step.skillLevel && (
                        <Badge variant="outline" className="ml-2 mt-2">
                          {step.skillLevel}
                        </Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>

      {/* Validation warnings */}
      {(displayIngredients.length === 0 || displaySteps.length === 0) && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="text-base text-yellow-700 dark:text-yellow-300">
              Incomplete Recipe
            </CardTitle>
            <CardDescription className="text-yellow-600 dark:text-yellow-400">
              {displayIngredients.length === 0 &&
                "Add at least one ingredient. "}
              {displaySteps.length === 0 && "Add at least one step."}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}

