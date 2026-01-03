import { serial, integer, numeric, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createTable } from "../tableCreator";
import { VersionIngredientsTable } from "./versionIngredients";

/**
 * Scaling rule types for ingredient quantity adjustments.
 * - linear: Scales proportionally with servings (default behavior)
 * - fixed: Quantity stays constant regardless of servings
 * - step: Increases in discrete steps (e.g., eggs)
 */
export const scalingRuleTypeEnum = pgEnum("scaling_rule_type", [
  "linear",
  "fixed",
  "step",
]);

/**
 * ScalingRules table - defines custom scaling behavior for ingredients.
 * Overrides the default linear scaling when adjusting servings.
 */
export const ScalingRulesTable = createTable("scaling_rules", {
  id: serial("id").primaryKey().notNull(),
  versionIngredientId: integer("version_ingredient_id")
    .references(() => VersionIngredientsTable.id, { onDelete: "cascade" })
    .notNull(),
  ruleType: scalingRuleTypeEnum("rule_type").notNull(),
  factor: numeric("factor", { precision: 10, scale: 4 }),
  minServings: integer("min_servings"),
  maxServings: integer("max_servings"),
  stepSize: numeric("step_size", { precision: 10, scale: 3 }),
});

/**
 * Relations for ScalingRulesTable.
 * Each scaling rule belongs to one version ingredient.
 */
export const ScalingRulesRelations = relations(
  ScalingRulesTable,
  ({ one }) => {
    return {
      versionIngredient: one(VersionIngredientsTable, {
        fields: [ScalingRulesTable.versionIngredientId],
        references: [VersionIngredientsTable.id],
      }),
    };
  },
);

export type ScalingRule = typeof ScalingRulesTable.$inferSelect;
export type NewScalingRule = typeof ScalingRulesTable.$inferInsert;
export type ScalingRuleType = "linear" | "fixed" | "step";

