"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  RecipeWizardFormData,
  IngredientOverride,
  StepOverride,
} from "./types";

/**
 * Generates a simple unique ID for form array items.
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type OverrideOperation = "ADD" | "REMOVE" | "UPDATE" | "REPLACE";

/**
 * Wizard step for configuring Easy/Hard difficulty variations.
 * Shows the base Medium recipe and allows override configuration.
 */
export function WizardDifficulty(): JSX.Element {
  const { control, watch } = useFormContext<RecipeWizardFormData>();

  const baseIngredients = watch("ingredients");
  const baseSteps = watch("steps");

  // Field arrays for Easy variation
  const {
    fields: easyIngOverrides,
    append: appendEasyIng,
    remove: removeEasyIng,
  } = useFieldArray({
    control,
    name: "easyVariation.ingredientOverrides",
  });

  const {
    fields: easyStepOverrides,
    append: appendEasyStep,
    remove: removeEasyStep,
  } = useFieldArray({
    control,
    name: "easyVariation.stepOverrides",
  });

  // Field arrays for Hard variation
  const {
    fields: hardIngOverrides,
    append: appendHardIng,
    remove: removeHardIng,
  } = useFieldArray({
    control,
    name: "hardVariation.ingredientOverrides",
  });

  const {
    fields: hardStepOverrides,
    append: appendHardStep,
    remove: removeHardStep,
  } = useFieldArray({
    control,
    name: "hardVariation.stepOverrides",
  });

  function createIngredientOverride(): IngredientOverride {
    return {
      id: generateId(),
      operation: "REMOVE",
      data: {},
    };
  }

  function createStepOverride(): StepOverride {
    return {
      id: generateId(),
      operation: "UPDATE",
      data: {},
    };
  }

  function renderIngredientOverrideEditor(
    prefix: "easyVariation" | "hardVariation",
    index: number,
    onRemove: () => void,
  ): JSX.Element {
    return (
      <Card key={index} className="mb-4">
        <CardContent className="pt-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-4">
              {/* Operation type */}
              <FormField
                control={control}
                name={`${prefix}.ingredientOverrides.${index}.operation`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Operation</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select operation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="REMOVE">
                          Remove ingredient
                        </SelectItem>
                        <SelectItem value="UPDATE">
                          Update quantity/notes
                        </SelectItem>
                        <SelectItem value="REPLACE">
                          Replace with another
                        </SelectItem>
                        <SelectItem value="ADD">Add new ingredient</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Target ingredient selector (for REMOVE, UPDATE, REPLACE) */}
              <FormField
                control={control}
                name={`${prefix}.ingredientOverrides.${index}.operation`}
                render={({ field: opField }) => {
                  if (opField.value === "ADD") return <></>;
                  return (
                    <FormField
                      control={control}
                      name={`${prefix}.ingredientOverrides.${index}.targetIngredientId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            Target Ingredient
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select ingredient" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {baseIngredients.map((ing) => (
                                <SelectItem key={ing.id} value={ing.id}>
                                  {ing.ingredientName || "Unnamed ingredient"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  );
                }}
              />

              {/* Override data fields based on operation */}
              <FormField
                control={control}
                name={`${prefix}.ingredientOverrides.${index}.operation`}
                render={({ field: opField }) => {
                  if (
                    opField.value === "UPDATE" ||
                    opField.value === "REPLACE"
                  ) {
                    return (
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={control}
                          name={`${prefix}.ingredientOverrides.${index}.data.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                New Quantity
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 50" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`${prefix}.ingredientOverrides.${index}.data.unit`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                New Unit
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., g" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    );
                  }
                  if (opField.value === "ADD") {
                    return (
                      <div className="space-y-4">
                        <FormField
                          control={control}
                          name={`${prefix}.ingredientOverrides.${index}.data.ingredientName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                Ingredient Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="New ingredient name"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={control}
                            name={`${prefix}.ingredientOverrides.${index}.data.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">
                                  Quantity
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 100" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`${prefix}.ingredientOverrides.${index}.data.unit`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Unit</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., g" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    );
                  }
                  return <></>;
                }}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  function renderStepOverrideEditor(
    prefix: "easyVariation" | "hardVariation",
    index: number,
    onRemove: () => void,
  ): JSX.Element {
    return (
      <Card key={index} className="mb-4">
        <CardContent className="pt-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-4">
              {/* Operation type */}
              <FormField
                control={control}
                name={`${prefix}.stepOverrides.${index}.operation`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Operation</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select operation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="REMOVE">Remove step</SelectItem>
                        <SelectItem value="UPDATE">
                          Update instruction
                        </SelectItem>
                        <SelectItem value="REPLACE">Replace step</SelectItem>
                        <SelectItem value="ADD">Add new step</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Target step selector */}
              <FormField
                control={control}
                name={`${prefix}.stepOverrides.${index}.operation`}
                render={({ field: opField }) => {
                  if (opField.value === "ADD") return <></>;
                  return (
                    <FormField
                      control={control}
                      name={`${prefix}.stepOverrides.${index}.targetStepId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Target Step</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select step" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {baseSteps.map((step, idx) => (
                                <SelectItem key={step.id} value={step.id}>
                                  Step {idx + 1}:{" "}
                                  {step.instruction.slice(0, 40)}...
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  );
                }}
              />

              {/* Override data */}
              <FormField
                control={control}
                name={`${prefix}.stepOverrides.${index}.operation`}
                render={({ field: opField }) => {
                  if (
                    opField.value === "UPDATE" ||
                    opField.value === "REPLACE" ||
                    opField.value === "ADD"
                  ) {
                    return (
                      <FormField
                        control={control}
                        name={`${prefix}.stepOverrides.${index}.data.instruction`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">
                              {opField.value === "ADD"
                                ? "New Step Instruction"
                                : "Updated Instruction"}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter the instruction..."
                                rows={2}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    );
                  }
                  return <></>;
                }}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Difficulty Variations</h3>
        <p className="text-sm text-muted-foreground">
          Configure how Easy and Hard versions differ from the base Medium
          recipe
        </p>
      </div>

      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardContent className="flex items-start gap-3 pt-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            The <Badge variant="secondary">Medium</Badge> difficulty is your base
            recipe. Easy and Hard variations are defined as overrides (changes) to
            this base.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="easy" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="easy">
            Easy
            {easyIngOverrides.length + easyStepOverrides.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {easyIngOverrides.length + easyStepOverrides.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="medium" disabled>
            Medium (Base)
          </TabsTrigger>
          <TabsTrigger value="hard">
            Hard
            {hardIngOverrides.length + hardStepOverrides.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {hardIngOverrides.length + hardStepOverrides.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Easy Variation */}
        <TabsContent value="easy" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Easy Version Overrides
              </CardTitle>
              <CardDescription>
                Simplify the recipe by removing complex steps or substituting
                easier ingredients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Ingredient overrides */}
              <div className="mb-6">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium">Ingredient Changes</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendEasyIng(createIngredientOverride())}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Override
                  </Button>
                </div>
                {easyIngOverrides.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No ingredient overrides. Easy version uses same ingredients
                    as Medium.
                  </p>
                ) : (
                  easyIngOverrides.map((field, index) =>
                    renderIngredientOverrideEditor("easyVariation", index, () =>
                      removeEasyIng(index),
                    ),
                  )
                )}
              </div>

              {/* Step overrides */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium">Step Changes</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendEasyStep(createStepOverride())}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Override
                  </Button>
                </div>
                {easyStepOverrides.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No step overrides. Easy version uses same steps as Medium.
                  </p>
                ) : (
                  easyStepOverrides.map((field, index) =>
                    renderStepOverrideEditor("easyVariation", index, () =>
                      removeEasyStep(index),
                    ),
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medium (read-only summary) */}
        <TabsContent value="medium" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Base Recipe (Medium)</CardTitle>
              <CardDescription>
                This is the canonical recipe that Easy and Hard build upon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Ingredients</h4>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {baseIngredients.map((ing) => (
                      <li key={ing.id}>
                        {ing.quantity} {ing.unit} {ing.ingredientName}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Steps</h4>
                  <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-muted-foreground">
                    {baseSteps.map((step) => (
                      <li key={step.id}>{step.instruction.slice(0, 60)}...</li>
                    ))}
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hard Variation */}
        <TabsContent value="hard" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Hard Version Overrides
              </CardTitle>
              <CardDescription>
                Add complexity with advanced techniques or premium ingredients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Ingredient overrides */}
              <div className="mb-6">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium">Ingredient Changes</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendHardIng(createIngredientOverride())}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Override
                  </Button>
                </div>
                {hardIngOverrides.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No ingredient overrides. Hard version uses same ingredients
                    as Medium.
                  </p>
                ) : (
                  hardIngOverrides.map((field, index) =>
                    renderIngredientOverrideEditor("hardVariation", index, () =>
                      removeHardIng(index),
                    ),
                  )
                )}
              </div>

              {/* Step overrides */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium">Step Changes</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendHardStep(createStepOverride())}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Override
                  </Button>
                </div>
                {hardStepOverrides.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No step overrides. Hard version uses same steps as Medium.
                  </p>
                ) : (
                  hardStepOverrides.map((field, index) =>
                    renderStepOverrideEditor("hardVariation", index, () =>
                      removeHardStep(index),
                    ),
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

