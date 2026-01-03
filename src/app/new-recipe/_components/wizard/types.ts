import { z } from "zod";

/**
 * Schema for a single recipe step in the wizard.
 */
export const WizardStepSchema = z.object({
  id: z.string(),
  instruction: z.string().min(1, "Instruction is required"),
  mediaUrl: z.string().optional(),
  timerSeconds: z.number().optional(),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  tools: z.array(z.string()).optional(),
  techniques: z.array(z.string()).optional(),
});

/**
 * Schema for scaling rule configuration.
 */
export const ScalingRuleSchema = z.object({
  ruleType: z.enum(["linear", "fixed", "step"]),
  factor: z.number().optional(),
  minServings: z.number().optional(),
  maxServings: z.number().optional(),
  stepSize: z.number().optional(),
});

/**
 * Schema for ingredient substitution.
 */
export const SubstitutionSchema = z.object({
  id: z.string(),
  ingredientId: z.number(),
  ingredientName: z.string(),
  quantity: z.string(),
  unit: z.string(),
  notes: z.string().optional(),
});

/**
 * Schema for a single ingredient in the wizard.
 */
export const WizardIngredientSchema = z.object({
  id: z.string(),
  ingredientId: z.number().optional(),
  ingredientName: z.string().min(1, "Ingredient name is required"),
  quantity: z.string().min(1, "Quantity is required"),
  unit: z.string().min(1, "Unit is required"),
  notes: z.string().optional(),
  isOptional: z.boolean().default(false),
  substitutions: z.array(SubstitutionSchema).optional(),
  scalingRule: ScalingRuleSchema.optional(),
});

/**
 * Schema for ingredient override in difficulty variations.
 */
export const IngredientOverrideSchema = z.object({
  id: z.string(),
  operation: z.enum(["ADD", "REMOVE", "UPDATE", "REPLACE"]),
  targetIngredientId: z.string().optional(),
  data: z.object({
    ingredientId: z.number().optional(),
    ingredientName: z.string().optional(),
    quantity: z.string().optional(),
    unit: z.string().optional(),
    notes: z.string().optional(),
    isOptional: z.boolean().optional(),
  }).optional(),
});

/**
 * Schema for step override in difficulty variations.
 */
export const StepOverrideSchema = z.object({
  id: z.string(),
  operation: z.enum(["ADD", "REMOVE", "UPDATE", "REPLACE"]),
  targetStepId: z.string().optional(),
  data: z.object({
    instruction: z.string().optional(),
    mediaUrl: z.string().optional(),
    timerSeconds: z.number().optional(),
    skillLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    tools: z.array(z.string()).optional(),
    techniques: z.array(z.string()).optional(),
    stepOrder: z.number().optional(),
  }).optional(),
});

/**
 * Schema for difficulty variation (EASY or HARD).
 */
export const DifficultyVariationSchema = z.object({
  ingredientOverrides: z.array(IngredientOverrideSchema),
  stepOverrides: z.array(StepOverrideSchema),
});

/**
 * Complete wizard form schema.
 */
export const RecipeWizardSchema = z.object({
  // Basics
  name: z.string().min(1, "Recipe name is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.number()),
  visibility: z.enum(["public", "private"]).default("public"),
  heroImageId: z.number().optional(),
  heroImageUrl: z.string().optional(),

  // Ingredients (MEDIUM base)
  ingredients: z.array(WizardIngredientSchema),

  // Steps (MEDIUM base)
  steps: z.array(WizardStepSchema),

  // Difficulty variations
  easyVariation: DifficultyVariationSchema,
  hardVariation: DifficultyVariationSchema,
});

export type WizardStep = z.infer<typeof WizardStepSchema>;
export type WizardIngredient = z.infer<typeof WizardIngredientSchema>;
export type IngredientOverride = z.infer<typeof IngredientOverrideSchema>;
export type StepOverride = z.infer<typeof StepOverrideSchema>;
export type DifficultyVariation = z.infer<typeof DifficultyVariationSchema>;
export type RecipeWizardFormData = z.infer<typeof RecipeWizardSchema>;

/**
 * Wizard step identifiers.
 */
export type WizardStepId =
  | "basics"
  | "ingredients"
  | "steps"
  | "difficulty"
  | "preview"
  | "publish";

/**
 * Wizard step configuration.
 */
export type WizardStepConfig = {
  id: WizardStepId;
  title: string;
  description: string;
};

/**
 * All wizard steps in order.
 */
export const WIZARD_STEPS: WizardStepConfig[] = [
  { id: "basics", title: "Basics", description: "Recipe name, description, and image" },
  { id: "ingredients", title: "Ingredients", description: "Add ingredients with quantities" },
  { id: "steps", title: "Steps", description: "Write cooking instructions" },
  { id: "difficulty", title: "Difficulty", description: "Configure Easy/Hard variations" },
  { id: "preview", title: "Preview", description: "Review your recipe" },
  { id: "publish", title: "Publish", description: "Final checks and publish" },
];

/**
 * Default form values for a new recipe.
 */
export const DEFAULT_WIZARD_VALUES: RecipeWizardFormData = {
  name: "",
  description: "",
  tags: [],
  visibility: "public",
  heroImageId: undefined,
  heroImageUrl: undefined,
  ingredients: [],
  steps: [],
  easyVariation: {
    ingredientOverrides: [],
    stepOverrides: [],
  },
  hardVariation: {
    ingredientOverrides: [],
    stepOverrides: [],
  },
};

