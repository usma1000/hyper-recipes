import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { RecipeWizard } from "./_components/wizard";
import { getAllTags } from "~/server/queries/tags";
import { getAllIngredients } from "~/server/queries/ingredients";

/**
 * New Recipe page with the v2 authoring wizard.
 * Fetches available tags and ingredients for the wizard forms.
 */
export default async function NewRecipePage(): Promise<JSX.Element> {
  const user = auth();

  // Redirect to sign-in if not authenticated
  if (!user.userId) {
    redirect("/sign-in");
  }

  // Fetch tags and ingredients in parallel
  const [tags, ingredients] = await Promise.all([
    getAllTags(),
    getAllIngredients(),
  ]);

  // Transform tags for the wizard
  const availableTags = tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    tagType: tag.tagType,
  }));

  // Transform ingredients for the wizard
  const availableIngredients = ingredients.map((ing) => ({
    id: ing.id,
    name: ing.name,
  }));

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Recipe</h1>
        <p className="mt-2 text-muted-foreground">
          Use the wizard to create your recipe with difficulty variations
        </p>
      </div>

      <RecipeWizard
        availableTags={availableTags}
        availableIngredients={availableIngredients}
      />
    </div>
  );
}
