import {
  getFullRecipeById,
  getRelatedRecipeSummariesExcluding,
  hasV2DataAsync,
} from "~/server/queries";
import { auth } from "@clerk/nextjs/server";
import { type JSONContent } from "novel";
import { FullRecipePageClient } from "./FullRecipePage";
import FullRecipeSheet from "./FullRecipeSheet";
import DangerZoneDialog from "./DangerZoneDialog";
import {
  getStepNotesForRecipe,
  getGeneralNoteForRecipe,
} from "~/server/queries/userNotes";
import { fetchRecipeView } from "./actions";
import type { RecipeViewDTO } from "./recipeViewTypes";

interface FullRecipePageServerProps {
  id: number;
}

const DEFAULT_SERVINGS = 4;

/**
 * Server component that fetches recipe data and passes to client component.
 * Auth is required for unpublished access control and personalized notes.
 * Related recipes use a limited cached query (not the full catalog).
 * @param id - Recipe ID
 */
export default async function FullRecipePageServer({
  id,
}: FullRecipePageServerProps): Promise<JSX.Element> {
  const { userId } = auth();

  const [fullRecipe, hasV2, relatedRows, stepNotes, generalNote] =
    await Promise.all([
      getFullRecipeById(id),
      hasV2DataAsync(id),
      getRelatedRecipeSummariesExcluding(id),
      userId ? getStepNotesForRecipe(id) : Promise.resolve({}),
      userId ? getGeneralNoteForRecipe(id) : Promise.resolve(""),
    ]);

  if (!fullRecipe.published && !userId) {
    throw new Error("Recipe is unpublished.");
  }

  let initialRecipeView: RecipeViewDTO | undefined;
  if (hasV2) {
    try {
      initialRecipeView = await fetchRecipeView(id, "MEDIUM", DEFAULT_SERVINGS);
    } catch (err) {
      console.error("Failed to load initial recipe view:", err);
    }
  }

  const userNotes = userId ? { stepNotes, generalNote } : undefined;

  const relatedRecipes = relatedRows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    prepTime: r.prepTime,
    cookTime: r.cookTime,
    difficulty: r.difficulty,
    heroImage: r.heroImage
      ? { url: r.heroImage.url, name: r.heroImage.name }
      : null,
  }));

  const recipe = {
    id: fullRecipe.id,
    name: fullRecipe.name,
    slug: fullRecipe.slug,
    description: fullRecipe.description,
    prepTime: fullRecipe.prepTime,
    cookTime: fullRecipe.cookTime,
    difficulty: fullRecipe.difficulty,
    steps: fullRecipe.steps as JSONContent | null,
    published: fullRecipe.published,
    heroImage: fullRecipe.heroImage,
    ingredients: fullRecipe.ingredients.map((i) => ({
      quantity: i.quantity,
      recipeId: i.recipeId,
      ingredientId: i.ingredientId,
      ingredient: {
        id: i.ingredient.id,
        name: i.ingredient.name,
        description: i.ingredient.description,
      },
    })),
    tags: fullRecipe.tags.map((t) => ({
      tag: {
        id: t.tag.id,
        name: t.tag.name,
        tagType: t.tag.tagType,
      },
    })),
  };

  return (
    <FullRecipePageClient
      recipe={recipe}
      relatedRecipes={relatedRecipes}
      adminEditSheet={<FullRecipeSheet recipeId={id} />}
      dangerZoneDialog={
        <DangerZoneDialog
          recipe={{ id: recipe.id, published: recipe.published }}
        />
      }
      hasV2Data={hasV2}
      initialRecipeView={initialRecipeView}
      userNotes={userNotes}
    />
  );
}
