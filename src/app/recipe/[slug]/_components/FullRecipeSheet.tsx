import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";

import {
  getAllTagNames,
  getAllTagsForRecipe,
  getAllIngredients,
  getIngredientsForRecipe,
  getRecipeNameAndDescription,
} from "~/server/queries";
import AssignTagsForm from "./AssignTagsForm";
import IngredientsForm from "./IngredientsForm";
import EditRecipeForm from "./EditRecipeForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function FullRecipeSheet({
  recipeId,
}: {
  recipeId: number;
}) {
  return (
    <Sheet>
      <SheetTrigger
        className={`${buttonVariants({
          variant: "outline",
          size: "sm",
        })}`}
      >
        Quick Edit
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Recipe</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-8">
          <Suspense
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle>Edit Recipe Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            }
          >
            <EditRecipeCard recipeId={recipeId} />
          </Suspense>

          <Suspense
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle>Assign Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            }
          >
            <TagsCard recipeId={recipeId} />
          </Suspense>

          <Suspense
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle>Add Ingredient</CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            }
          >
            <IngredientsCard recipeId={recipeId} />
          </Suspense>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Split into separate components for better loading management
async function EditRecipeCard({ recipeId }: { recipeId: number }) {
  const { name, description } = await getRecipeNameAndDescription(recipeId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Recipe Details</CardTitle>
      </CardHeader>
      <CardContent>
        <EditRecipeForm
          recipeId={recipeId}
          initialName={name}
          initialDescription={description}
        />
      </CardContent>
    </Card>
  );
}

async function TagsCard({ recipeId }: { recipeId: number }) {
  const rawTags = await getAllTagNames();
  const allTags = rawTags.map((tag) => ({
    value: tag.id.toString(),
    label: tag.name,
  }));

  const rawAssignedTags = await getAllTagsForRecipe(recipeId);
  const allAssignedTags = rawAssignedTags.map((tag) => ({
    id: tag.id,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <AssignTagsForm
          allTags={allTags}
          allAssignedTags={allAssignedTags}
          recipeId={recipeId}
        />
      </CardContent>
    </Card>
  );
}

async function IngredientsCard({ recipeId }: { recipeId: number }) {
  const rawIngredients = await getAllIngredients();
  const allIngredients = rawIngredients.map((ingredient) => ({
    value: ingredient.id.toString(),
    label: ingredient.name,
  }));

  const rawAssignedIngredients = await getIngredientsForRecipe(recipeId);
  const allAssignedIngredients = rawAssignedIngredients.map((ingredient) => ({
    id: ingredient.ingredient.id,
    name: ingredient.ingredient.name,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Ingredient</CardTitle>
      </CardHeader>
      <CardContent>
        <IngredientsForm
          recipeId={recipeId}
          allIngredients={allIngredients}
          allAssignedIngredients={allAssignedIngredients}
        />
      </CardContent>
    </Card>
  );
}
