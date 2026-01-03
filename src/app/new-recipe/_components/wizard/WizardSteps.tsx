"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Timer,
  Image as ImageIcon,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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

import type { RecipeWizardFormData, WizardStep } from "./types";

/**
 * Generates a simple unique ID for form array items.
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const COMMON_TOOLS = [
  "Chef's knife",
  "Cutting board",
  "Mixing bowl",
  "Whisk",
  "Spatula",
  "Saucepan",
  "Frying pan",
  "Baking sheet",
  "Oven",
  "Blender",
  "Food processor",
  "Measuring cups",
  "Measuring spoons",
  "Thermometer",
];

const COMMON_TECHNIQUES = [
  "Sauteing",
  "Braising",
  "Roasting",
  "Grilling",
  "Steaming",
  "Boiling",
  "Simmering",
  "Frying",
  "Baking",
  "Chopping",
  "Dicing",
  "Mincing",
  "Julienne",
  "Folding",
  "Whisking",
  "Kneading",
];

/**
 * Wizard step for adding and managing recipe instructions.
 * Includes: step list, timers, media, skill levels, tools, and techniques.
 */
export function WizardSteps(): JSX.Element {
  const { control } = useFormContext<RecipeWizardFormData>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "steps",
  });

  const [expandedAdvanced, setExpandedAdvanced] = useState<string | null>(null);

  function handleAddStep(): void {
    const newStep: WizardStep = {
      id: generateId(),
      instruction: "",
    };
    append(newStep);
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

  function formatTime(seconds: number | undefined): string {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins}m`;
    return `${mins}m ${secs}s`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Cooking Steps</h3>
          <p className="text-sm text-muted-foreground">
            Write clear instructions for the base (Medium) recipe
          </p>
        </div>
        <Button type="button" onClick={handleAddStep} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Add Step
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <p className="text-muted-foreground">No steps added yet</p>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddStep}
            className="mt-4"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add your first step
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-4">
                {/* Step number and reorder controls */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </div>
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

                {/* Main step content */}
                <div className="flex-1 space-y-4">
                  {/* Instruction */}
                  <FormField
                    control={control}
                    name={`steps.${index}.instruction`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Describe this step clearly and concisely..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quick actions row */}
                  <div className="flex flex-wrap gap-2">
                    {/* Timer */}
                    <FormField
                      control={control}
                      name={`steps.${index}.timerSeconds`}
                      render={({ field }) => (
                        <div className="flex items-center gap-2">
                          <Timer className="h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="Timer (seconds)"
                            className="w-32 text-sm"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : undefined,
                              )
                            }
                          />
                          {field.value && (
                            <Badge variant="secondary">
                              {formatTime(field.value)}
                            </Badge>
                          )}
                        </div>
                      )}
                    />

                    {/* Media URL */}
                    <FormField
                      control={control}
                      name={`steps.${index}.mediaUrl`}
                      render={({ field }) => (
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Image/video URL"
                            className="w-48 text-sm"
                            {...field}
                          />
                        </div>
                      )}
                    />
                  </div>

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
                      {/* Skill Level */}
                      <div>
                        <FormField
                          control={control}
                          name={`steps.${index}.skillLevel`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                Skill Level
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value ?? ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select skill level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="beginner">
                                    Beginner
                                  </SelectItem>
                                  <SelectItem value="intermediate">
                                    Intermediate
                                  </SelectItem>
                                  <SelectItem value="advanced">
                                    Advanced
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Tools */}
                      <div>
                        <FormField
                          control={control}
                          name={`steps.${index}.tools`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                Tools Needed
                              </FormLabel>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {COMMON_TOOLS.map((tool) => (
                                  <Badge
                                    key={tool}
                                    variant={
                                      field.value?.includes(tool)
                                        ? "default"
                                        : "outline"
                                    }
                                    className="cursor-pointer text-xs"
                                    onClick={() => {
                                      const current = field.value ?? [];
                                      if (current.includes(tool)) {
                                        field.onChange(
                                          current.filter((t) => t !== tool),
                                        );
                                      } else {
                                        field.onChange([...current, tool]);
                                      }
                                    }}
                                  >
                                    {tool}
                                  </Badge>
                                ))}
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Techniques */}
                      <div>
                        <FormField
                          control={control}
                          name={`steps.${index}.techniques`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                Techniques Used
                              </FormLabel>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {COMMON_TECHNIQUES.map((technique) => (
                                  <Badge
                                    key={technique}
                                    variant={
                                      field.value?.includes(technique)
                                        ? "default"
                                        : "outline"
                                    }
                                    className="cursor-pointer text-xs"
                                    onClick={() => {
                                      const current = field.value ?? [];
                                      if (current.includes(technique)) {
                                        field.onChange(
                                          current.filter((t) => t !== technique),
                                        );
                                      } else {
                                        field.onChange([...current, technique]);
                                      }
                                    }}
                                  >
                                    {technique}
                                  </Badge>
                                ))}
                              </div>
                            </FormItem>
                          )}
                        />
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
          <Button type="button" variant="outline" onClick={handleAddStep}>
            <Plus className="mr-1 h-4 w-4" />
            Add Another Step
          </Button>
        </div>
      )}
    </div>
  );
}

