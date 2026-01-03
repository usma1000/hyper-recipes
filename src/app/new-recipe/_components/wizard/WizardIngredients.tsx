"use client";

import { useState, useCallback, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { RecipeWizardFormData, WizardIngredient } from "./types";
import { CreateIngredientDialog } from "./CreateIngredientDialog";

/**
 * Generates a simple unique ID for form array items.
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type IngredientOption = {
  id: number;
  name: string;
};

interface IngredientCommandProps {
  availableIngredients: IngredientOption[];
  fieldValue: string;
  onSelect: (ingredientName: string) => void;
  onIngredientCreated: (ingredient: { id: number; name: string }) => void;
}

/**
 * Command component for ingredient selection with create option.
 * Handles filtering and shows create option when no exact match exists.
 */
function IngredientCommand({
  availableIngredients,
  fieldValue,
  onSelect,
  onIngredientCreated,
}: IngredientCommandProps): JSX.Element {
  const [searchValue, setSearchValue] = useState("");

  // Sync search value with field value when popover opens
  useEffect(() => {
    if (fieldValue) {
      setSearchValue(fieldValue);
    }
  }, [fieldValue]);

  // Check if there's an exact match for the current search
  const hasExactMatch = availableIngredients.some(
    (ing) => ing.name.toLowerCase() === searchValue.toLowerCase(),
  );

  // Show create option if search has value and no exact match
  const showCreateOption = searchValue.length > 0 && !hasExactMatch;

  return (
    <Command>
      <CommandInput
        placeholder="Search ingredients..."
        value={searchValue}
        onValueChange={setSearchValue}
      />
      <CommandList>
        <CommandEmpty>
          <span className="text-sm text-muted-foreground">
            {searchValue.length > 0
              ? `No ingredient found matching "${searchValue}"`
              : "Start typing to search ingredients"}
          </span>
        </CommandEmpty>
        <CommandGroup>
          {availableIngredients.map((ing) => (
            <CommandItem
              key={ing.id}
              value={ing.name}
              onSelect={() => {
                onSelect(ing.name);
                setSearchValue("");
              }}
            >
              {ing.name}
            </CommandItem>
          ))}
        </CommandGroup>
        {showCreateOption && (
          <div className="border-t p-2">
            <CreateIngredientDialog
              onIngredientCreated={onIngredientCreated}
              triggerText={`Create "${searchValue}"`}
              initialName={searchValue}
            />
          </div>
        )}
      </CommandList>
    </Command>
  );
}

interface WizardIngredientsProps {
  availableIngredients: IngredientOption[];
  onIngredientsUpdated?: (ingredients: IngredientOption[]) => void;
}

const COMMON_UNITS = [
  "g",
  "kg",
  "ml",
  "L",
  "cup",
  "tbsp",
  "tsp",
  "oz",
  "lb",
  "piece",
  "whole",
  "pinch",
  "to taste",
];

/**
 * Wizard step for adding and managing recipe ingredients.
 * Includes: ingredient list, quantities, units, optional toggle, and advanced features.
 * @param availableIngredients - Available ingredients for autocomplete
 */
export function WizardIngredients({
  availableIngredients: initialIngredients,
  onIngredientsUpdated,
}: WizardIngredientsProps): JSX.Element {
  const { control, watch, setValue } = useFormContext<RecipeWizardFormData>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "ingredients",
  });

  const [expandedAdvanced, setExpandedAdvanced] = useState<string | null>(null);
  const [openCombobox, setOpenCombobox] = useState<string | null>(null);
  const [availableIngredients, setAvailableIngredients] = useState<IngredientOption[]>(initialIngredients);

  const handleIngredientCreated = useCallback((ingredient: { id: number; name: string }, index: number) => {
    // Add to available ingredients list
    setAvailableIngredients((prev) => {
      if (prev.some((ing) => ing.id === ingredient.id)) {
        return prev;
      }
      return [...prev, ingredient];
    });

    // Update the form field with the new ingredient using setValue
    setValue(`ingredients.${index}.ingredientName`, ingredient.name, { shouldDirty: true });
    setValue(`ingredients.${index}.ingredientId`, ingredient.id, { shouldDirty: true });

    // Notify parent if callback provided
    const updated = [...availableIngredients, ingredient];
    onIngredientsUpdated?.(updated);
    setOpenCombobox(null);
  }, [setValue, availableIngredients, onIngredientsUpdated]);

  function handleAddIngredient(): void {
    const newIngredient: WizardIngredient = {
      id: generateId(),
      ingredientName: "",
      quantity: "",
      unit: "g",
      isOptional: false,
    };
    append(newIngredient);
  }

  function handleMoveUp(index: number): void {
    if (index > 0) {
      move(index, index - 1);
    }
  }

  function handleMoveDown(index: number): void {
    if (index < fields.length - 1) {
      move(index, index + 1);
    }
  }

  function toggleAdvanced(id: string): void {
    setExpandedAdvanced((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Ingredients</h3>
          <p className="text-sm text-muted-foreground">
            Add ingredients for the base (Medium) recipe
          </p>
        </div>
        <Button type="button" onClick={handleAddIngredient} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Add Ingredient
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <p className="text-muted-foreground">No ingredients added yet</p>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddIngredient}
            className="mt-4"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add your first ingredient
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border bg-card p-4"
            >
              <div className="flex items-start gap-4">
                {/* Drag handle and reorder buttons */}
                <div className="flex flex-col items-center gap-1 pt-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === fields.length - 1}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Main ingredient fields */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-12 gap-4">
                    {/* Ingredient name with autocomplete */}
                    <div className="col-span-5">
                      <FormField
                        control={control}
                        name={`ingredients.${index}.ingredientName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Ingredient</FormLabel>
                            <Popover
                              open={openCombobox === field.name}
                              onOpenChange={(open) =>
                                setOpenCombobox(open ? field.name : null)
                              }
                            >
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Input
                                    placeholder="Type ingredient..."
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setOpenCombobox(field.name);
                                    }}
                                  />
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-64 p-0"
                                align="start"
                              >
                                <IngredientCommand
                                  availableIngredients={availableIngredients}
                                  fieldValue={field.value ?? ""}
                                  onSelect={(ingredientName) => {
                                    field.onChange(ingredientName);
                                    setOpenCombobox(null);
                                  }}
                                  onIngredientCreated={(ingredient) =>
                                    handleIngredientCreated(ingredient, index)
                                  }
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Quantity */}
                    <div className="col-span-3">
                      <FormField
                        control={control}
                        name={`ingredients.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Quantity</FormLabel>
                            <FormControl>
                              <Input placeholder="100" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Unit */}
                    <div className="col-span-3">
                      <FormField
                        control={control}
                        name={`ingredients.${index}.unit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Unit</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {COMMON_UNITS.map((unit) => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Optional checkbox */}
                    <div className="col-span-1 flex items-end pb-2">
                      <FormField
                        control={control}
                        name={`ingredients.${index}.isOptional`}
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-xs font-normal">
                              Optional
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Notes field */}
                  <FormField
                    control={control}
                    name={`ingredients.${index}.notes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Notes (e.g., 'finely chopped', 'room temperature')"
                            className="text-sm"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Advanced settings collapsible */}
                  <Collapsible
                    open={expandedAdvanced === field.id}
                    onOpenChange={() => toggleAdvanced(field.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-xs">
                        {expandedAdvanced === field.id ? (
                          <ChevronUp className="mr-1 h-3 w-3" />
                        ) : (
                          <ChevronDown className="mr-1 h-3 w-3" />
                        )}
                        Advanced Settings
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-4 rounded-md bg-muted/50 p-4">
                      {/* Scaling Rule */}
                      <div>
                        <FormLabel className="text-xs">Scaling Rule</FormLabel>
                        <FormField
                          control={control}
                          name={`ingredients.${index}.scalingRule.ruleType`}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value ?? "linear"}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select scaling" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="linear">
                                  Linear (scales with servings)
                                </SelectItem>
                                <SelectItem value="fixed">
                                  Fixed (constant amount)
                                </SelectItem>
                                <SelectItem value="step">
                                  Step (round up, e.g., eggs)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          How this ingredient scales when adjusting servings
                        </p>
                      </div>

                      {/* Substitutions placeholder */}
                      <div>
                        <FormLabel className="text-xs">Substitutions</FormLabel>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Add alternative ingredients (coming soon)
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                {/* Delete button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <div className="flex justify-center">
          <Button type="button" variant="outline" onClick={handleAddIngredient}>
            <Plus className="mr-1 h-4 w-4" />
            Add Another Ingredient
          </Button>
        </div>
      )}
    </div>
  );
}

