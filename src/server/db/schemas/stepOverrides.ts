import { serial, integer, json, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createTable } from "../tableCreator";
import { RecipeVersionsTable } from "./recipeVersions";
import { RecipeStepsTable } from "./recipeSteps";

/**
 * Override operation types for step modifications in EASY/HARD versions.
 * - ADD: Add a new step not in the base
 * - REMOVE: Remove a step from the base
 * - UPDATE: Modify instruction/media/timing of a base step
 * - REPLACE: Completely replace a step with new content
 */
export const stepOverrideOperationEnum = pgEnum("step_override_operation", [
  "ADD",
  "REMOVE",
  "UPDATE",
  "REPLACE",
]);

/**
 * StepOverride data structure for ADD operation.
 */
export type AddStepOverrideData = {
  stepOrder: number;
  instruction: string;
  mediaUrl?: string;
  timerSeconds?: number;
  skillLevel?: "beginner" | "intermediate" | "advanced";
  tools?: string[];
  techniques?: string[];
};

/**
 * StepOverride data structure for UPDATE operation.
 */
export type UpdateStepOverrideData = {
  instruction?: string;
  mediaUrl?: string;
  timerSeconds?: number;
  skillLevel?: "beginner" | "intermediate" | "advanced";
  tools?: string[];
  techniques?: string[];
};

/**
 * StepOverride data structure for REPLACE operation.
 */
export type ReplaceStepOverrideData = {
  instruction: string;
  mediaUrl?: string;
  timerSeconds?: number;
  skillLevel?: "beginner" | "intermediate" | "advanced";
  tools?: string[];
  techniques?: string[];
};

export type StepOverrideData =
  | AddStepOverrideData
  | UpdateStepOverrideData
  | ReplaceStepOverrideData
  | null;

/**
 * StepOverrides table - stores delta patches for steps in EASY/HARD versions.
 * Each override describes a modification to apply on top of the MEDIUM base steps.
 */
export const StepOverridesTable = createTable("step_overrides", {
  id: serial("id").primaryKey().notNull(),
  versionId: integer("version_id")
    .references(() => RecipeVersionsTable.id, { onDelete: "cascade" })
    .notNull(),
  operation: stepOverrideOperationEnum("operation").notNull(),
  targetStepId: integer("target_step_id").references(
    () => RecipeStepsTable.id,
    { onDelete: "cascade" },
  ),
  overrideData: json("override_data").$type<StepOverrideData>(),
});

/**
 * Relations for StepOverridesTable.
 * Each override belongs to a version and optionally targets a base step.
 */
export const StepOverridesRelations = relations(
  StepOverridesTable,
  ({ one }) => {
    return {
      version: one(RecipeVersionsTable, {
        fields: [StepOverridesTable.versionId],
        references: [RecipeVersionsTable.id],
      }),
      targetStep: one(RecipeStepsTable, {
        fields: [StepOverridesTable.targetStepId],
        references: [RecipeStepsTable.id],
      }),
    };
  },
);

export type StepOverride = typeof StepOverridesTable.$inferSelect;
export type NewStepOverride = typeof StepOverridesTable.$inferInsert;
export type StepOverrideOperation = "ADD" | "REMOVE" | "UPDATE" | "REPLACE";

