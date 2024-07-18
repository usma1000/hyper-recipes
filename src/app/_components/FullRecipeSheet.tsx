import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";

import { getAllTagNames } from "~/server/queries";
import AssignTagsForm from "./AssignTagsForm";

export default async function FullRecipeSheet() {
  const rawTags = await getAllTagNames();
  let allTags = rawTags.map((tag) => ({
    value: tag.id.toString(),
    label: tag.name,
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
        <h3 className="mb-4">Assign Tags</h3>
        <SheetDescription>
          Select which tag(s) to apply to this recipe.
        </SheetDescription>
        <AssignTagsForm allTags={allTags} />
      </SheetContent>
    </Sheet>
  );
}
