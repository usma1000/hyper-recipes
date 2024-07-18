"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";

const tagsForTesting = [
  { value: "1", label: "Indian" },
  { value: "2", label: "Italian" },
  { value: "3", label: "Mexican" },
  { value: "4", label: "Chinese" },
];

export default function FullRecipeSheet() {
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Indian",
    "Mexican",
  ]);

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
        <h3>Assign Tags</h3>
        <MultiSelect
          options={tagsForTesting}
          onValueChange={setSelectedTags}
          defaultValue={[]}
          placeholder="Select tags"
        />
      </SheetContent>
    </Sheet>
  );
}
