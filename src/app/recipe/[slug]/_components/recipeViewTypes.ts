import type { Difficulty } from "~/server/db/schemas";

export type RecipeViewSubstitution = {
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  notes: string | null;
};

export type RecipeViewIngredient = {
  id: number;
  ingredientId: number;
  ingredientName: string;
  ingredientDescription: string | null;
  quantity: number;
  unit: string;
  notes: string | null;
  isOptional: boolean;
  substitutions: RecipeViewSubstitution[];
};

export type RecipeViewStep = {
  id: number;
  stepOrder: number;
  instruction: string;
  mediaUrl: string | null;
  timerSeconds: number | null;
};

export type RecipeViewDTO = {
  recipeId: number;
  difficulty: Difficulty;
  servings: number;
  ingredients: RecipeViewIngredient[];
  steps: RecipeViewStep[];
};
