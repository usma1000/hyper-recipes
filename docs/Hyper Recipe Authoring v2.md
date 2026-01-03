
# Hyper Recipe — Recipe Authoring v2 (UI Flow + Data Model) — Cursor Plan Doc

> Purpose: This document is a build spec for redesigning the recipe authoring experience from “write a recipe” to “define a canonical recipe + structured variations and rules,” without forcing authors to duplicate recipes.
>
> Target stack assumptions:
> - Next.js App Router
> - Postgres (Neon)
> - Prisma ORM (or similar)
> - Clerk auth

---

## 0) Non-negotiable UX Principles
1. Authors do NOT create 3 recipes.
2. Medium is the canonical base recipe.
3. Easy/Hard are delta overrides.
4. Progressive disclosure.
5. Preview shows the magic.

---

## 1) Authoring Flow
Dashboard → New Recipe → Basics → Ingredients → Steps → Difficulty → Preview → Publish

---

## 2) Screen Specs
### Basics
- Title
- Description
- Tags
- Visibility
- Hero image

### Ingredients
- Name, quantity, unit, notes
- Optional toggle
- Advanced: substitutions, scaling rules

### Steps
- Instruction text
- Media, timer
- Advanced: skill level, tools, techniques

### Difficulty
- Easy / Medium (base) / Hard
- Ingredient overrides (ADD / REMOVE / UPDATE / REPLACE)
- Step overrides

### Preview
- Difficulty tabs
- Servings slider
- Computed recipe view

### Publish
- Validation checklist
- Publish / draft

---

## 3) Data Model Overview
- Recipe
- RecipeVersion (EASY / MEDIUM / HARD)
- RecipeIngredient
- RecipeStep
- IngredientOverride
- StepOverride
- ScalingRule

Medium owns base data; Easy/Hard store patches only.

---

## 4) Core Server Function
`getRecipeView(recipeId, difficulty, servings?)`
1. Load base MEDIUM version
2. Apply overrides
3. Apply scaling
4. Return computed view model

---

## 5) Migration Plan
1. Add v2 tables
2. Backfill existing recipes → MEDIUM
3. Create empty EASY/HARD
4. Dual-read temporarily
5. Cut over

---

## 6) Cursor Agent Instructions
Implement exactly as specified:
- Wizard UI
- v2 schema + migration
- Backfill script
- Computed recipe view
- Preview + publish flow
