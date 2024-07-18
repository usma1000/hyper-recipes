import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";

import { getAllTagNames, getAllTagsForRecipe } from "~/server/queries";
import AssignTagsForm from "./AssignTagsForm";

export default async function FullRecipeSheet({
  recipeId,
}: {
  recipeId: number;
}) {
  const rawTags = await getAllTagNames();
  let allTags = rawTags.map((tag) => ({
    value: tag.id.toString(),
    label: tag.name,
  }));

  const rawAssignedTags = await getAllTagsForRecipe(recipeId);
  let allAssignedTags = rawAssignedTags.map((tag) => ({
    id: tag.id,
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
        <AssignTagsForm
          allTags={allTags}
          allAssignedTags={allAssignedTags}
          recipeId={recipeId}
        />
      </SheetContent>
    </Sheet>
  );
}
