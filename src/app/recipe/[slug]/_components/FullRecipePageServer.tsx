import { getFullRecipeById, getAllRecipes, hasV2DataAsync } from "~/server/queries";
import { auth } from "@clerk/nextjs/server";
import { type JSONContent } from "novel";
import { FullRecipePageClient } from "./FullRecipePage";
import FullRecipeSheet from "./FullRecipeSheet";
import DangerZoneDialog from "./DangerZoneDialog";

interface FullRecipePageServerProps {
  id: number;
}

/**
 * Server component that fetches recipe data and passes to client component.
 * Handles auth checks for unpublished recipes.
 * Now checks for v2 data to enable difficulty switching.
 * @param id - Recipe ID
 * @param slug - Recipe slug (for routing)
 */
export default async function FullRecipePageServer({
  id,
}: FullRecipePageServerProps): Promise<JSX.Element> {
  const { userId } = auth();

  // Fetch recipe and check for v2 data in parallel
  const [fullRecipe, hasV2] = await Promise.all([
    getFullRecipeById(id),
    hasV2DataAsync(id),
  ]);

  if (!fullRecipe.published && !userId) {
    throw new Error("Recipe is unpublished.");
  }

  const allRecipes = await getAllRecipes();
  const relatedRecipes = allRecipes
    .filter((r) => r.id !== fullRecipe.id)
    .slice(0, 6)
    .map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      prepTime: r.prepTime,
      cookTime: r.cookTime,
      difficulty: r.difficulty,
      heroImage: r.heroImage,
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
    />
  );
}
