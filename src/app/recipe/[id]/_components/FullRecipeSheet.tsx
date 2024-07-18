import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";

import {
  getAllTagNames,
  getAllTagsForRecipe,
  getAllIngredients,
  getIngredientsForRecipe,
} from "~/server/queries";
import AssignTagsForm from "./AssignTagsForm";
import IngredientsForm from "./IngredientsForm";

export default async function FullRecipeSheet({
  recipeId,
}: {
  recipeId: number;
}) {
  const rawTags = await getAllTagNames();
  const allTags = rawTags.map((tag) => ({
    value: tag.id.toString(),
    label: tag.name,
  }));

  const rawAssignedTags = await getAllTagsForRecipe(recipeId);
  const allAssignedTags = rawAssignedTags.map((tag) => ({
    id: tag.id,
  }));

  const rawIngredients = await getAllIngredients();
  const allIngredients = rawIngredients.map((ingredient) => ({
    value: ingredient.id.toString(),
    label: ingredient.name,
  }));

  const rawAssignedIngredients = await getIngredientsForRecipe(recipeId);
  const allAssignedIngredients = rawAssignedIngredients.map((ingredient) => ({
    id: ingredient.ingredient.id,
  }));

  return (
    <Sheet>
      <SheetTrigger
        className={`${buttonVariants({
          variant: "outline",
          size: "sm",
        })}`}
      >
        Edit
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>Edit Recipe</SheetHeader>
        <div className="flex flex-col gap-8">
          <AssignTagsForm
            allTags={allTags}
            allAssignedTags={allAssignedTags}
            recipeId={recipeId}
          />
          <IngredientsForm
            recipeId={recipeId}
            allIngredients={allIngredients}
            allAssignedIngredients={allAssignedIngredients}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
