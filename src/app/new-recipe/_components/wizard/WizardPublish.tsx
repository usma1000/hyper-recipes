"use client";

import { useFormContext } from "react-hook-form";
import { Check, X, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { RecipeWizardFormData } from "./types";

interface ValidationCheck {
  id: string;
  label: string;
  check: (data: RecipeWizardFormData) => boolean;
  severity: "error" | "warning";
}

const VALIDATION_CHECKS: ValidationCheck[] = [
  {
    id: "name",
    label: "Recipe has a name",
    check: (data) => data.name.length > 0,
    severity: "error",
  },
  {
    id: "description",
    label: "Recipe has a description",
    check: (data) => data.description.length > 0,
    severity: "error",
  },
  {
    id: "ingredients",
    label: "At least one ingredient added",
    check: (data) => data.ingredients.length > 0,
    severity: "error",
  },
  {
    id: "steps",
    label: "At least one step added",
    check: (data) => data.steps.length > 0,
    severity: "error",
  },
  {
    id: "ingredient-quantities",
    label: "All ingredients have quantities",
    check: (data) =>
      data.ingredients.every((ing) => ing.quantity && ing.quantity.length > 0),
    severity: "error",
  },
  {
    id: "step-instructions",
    label: "All steps have instructions",
    check: (data) =>
      data.steps.every((step) => step.instruction && step.instruction.length > 0),
    severity: "error",
  },
  {
    id: "hero-image",
    label: "Hero image uploaded",
    check: (data) => !!data.heroImageUrl,
    severity: "warning",
  },
  {
    id: "tags",
    label: "At least one tag selected",
    check: (data) => data.tags.length > 0,
    severity: "warning",
  },
  {
    id: "description-length",
    label: "Description is at least 50 characters",
    check: (data) => data.description.length >= 50,
    severity: "warning",
  },
  {
    id: "multiple-steps",
    label: "Recipe has multiple steps",
    check: (data) => data.steps.length >= 3,
    severity: "warning",
  },
];

interface WizardPublishProps {
  onPublish: () => void;
}

/**
 * Wizard step for final validation and publishing.
 * Shows a checklist of required and recommended items.
 * @param onPublish - Callback to trigger form submission
 */
export function WizardPublish({ onPublish }: WizardPublishProps): JSX.Element {
  const { watch, formState } = useFormContext<RecipeWizardFormData>();
  const formData = watch();

  const errors = VALIDATION_CHECKS.filter(
    (check) => check.severity === "error" && !check.check(formData),
  );
  const warnings = VALIDATION_CHECKS.filter(
    (check) => check.severity === "warning" && !check.check(formData),
  );
  const passed = VALIDATION_CHECKS.filter((check) => check.check(formData));

  const canPublish = errors.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Publish Recipe</h3>
        <p className="text-sm text-muted-foreground">
          Review the checklist below before publishing your recipe
        </p>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-950">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-red-700 dark:text-red-300">
              <X className="h-4 w-4" />
              Required Items Missing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 text-sm text-red-600 dark:text-red-400">
              {errors.map((error) => (
                <li key={error.id}>{error.label}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {warnings.length > 0 && errors.length === 0 && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-yellow-700 dark:text-yellow-300">
              <AlertTriangle className="h-4 w-4" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 text-sm text-yellow-600 dark:text-yellow-400">
              {warnings.map((warning) => (
                <li key={warning.id}>{warning.label}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Validation Checklist</CardTitle>
          <CardDescription>
            {passed.length} of {VALIDATION_CHECKS.length} checks passed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {VALIDATION_CHECKS.map((check) => {
              const isPassed = check.check(formData);
              return (
                <li key={check.id} className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      isPassed
                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                        : check.severity === "error"
                          ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400"
                    }`}
                  >
                    {isPassed ? (
                      <Check className="h-4 w-4" />
                    ) : check.severity === "error" ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      isPassed
                        ? "text-muted-foreground"
                        : check.severity === "error"
                          ? "font-medium"
                          : ""
                    }`}
                  >
                    {check.label}
                    {check.severity === "warning" && !isPassed && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (recommended)
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      {/* Recipe summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recipe Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-muted-foreground">Name</dt>
              <dd>{formData.name || "—"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Visibility</dt>
              <dd className="capitalize">{formData.visibility}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Ingredients</dt>
              <dd>{formData.ingredients.length} items</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Steps</dt>
              <dd>{formData.steps.length} steps</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Tags</dt>
              <dd>{formData.tags.length} selected</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">
                Difficulty Overrides
              </dt>
              <dd>
                Easy:{" "}
                {formData.easyVariation.ingredientOverrides.length +
                  formData.easyVariation.stepOverrides.length}
                , Hard:{" "}
                {formData.hardVariation.ingredientOverrides.length +
                  formData.hardVariation.stepOverrides.length}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Publish button */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          size="lg"
          onClick={onPublish}
          disabled={!canPublish || formState.isSubmitting}
        >
          {formState.isSubmitting ? "Publishing..." : "Publish Recipe"}
        </Button>
      </div>

      {!canPublish && (
        <p className="text-center text-sm text-muted-foreground">
          Fix the required items above to enable publishing
        </p>
      )}
    </div>
  );
}
