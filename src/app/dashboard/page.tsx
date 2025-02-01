import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateTagsForm from "./_components/CreateTagsForm";
import DeleteTagsForm from "./_components/DeleteTagsForm";
import { getAllTagNames, getUnpublishedRecipes } from "~/server/queries";
import CreateIngredientForm from "./_components/CreateIngredientForm";
import UnpublishedRecipesTable from "./_components/UnpublishedRecipesTable";

export default async function Page() {
  const rawTags = await getAllTagNames();
  const allTags = rawTags.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

  const unpublishedRecipes = await getUnpublishedRecipes();

  return (
    <div className="flex flex-col gap-8">
      <h1>Dashboard</h1>
      <section>
        <h2 className="mb-2">Manage Recipes</h2>
        <Card className="flex basis-1/2 flex-col">
          <CardHeader>
            <CardTitle>Unpublished Recipes</CardTitle>
            <CardDescription>
              These recipes will only be visible to you until they are
              published.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <UnpublishedRecipesTable recipes={unpublishedRecipes} />
          </CardContent>
        </Card>
      </section>
      <section>
        <h2 className="mb-2">Manage Ingredients</h2>
        <div className="flex gap-8">
          <Card className="flex basis-1/2 flex-col">
            <CardHeader>
              <CardTitle>Create New Ingredient</CardTitle>
              <CardDescription>
                Create a new ingredient that can be applied to a recipe.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <CreateIngredientForm />
            </CardContent>
          </Card>
          <Card className="flex basis-1/2 flex-col">
            <CardHeader>
              <CardTitle>Delete an Ingredient</CardTitle>
              <CardDescription>
                Delete an ingredient that is no longer needed. This will remove
                the ingredient from all recipes that it is applied.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {/* <CreateIngredientForm /> */}
              <p>Coming soon...</p>
            </CardContent>
          </Card>
        </div>
      </section>
      <section>
        <h2 className="mb-2">Manage Tags</h2>
        <div className="flex gap-8">
          <Card className="flex basis-1/2 flex-col">
            <CardHeader>
              <CardTitle>Create New Tag</CardTitle>
              <CardDescription>
                Create a new tag of type "Cuisine" or "Meal" which can be
                applied to a recipe.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <CreateTagsForm />
            </CardContent>
          </Card>
          <Card className="flex basis-1/2 flex-col">
            <CardHeader>
              <CardTitle>Delete a Tag</CardTitle>
              <CardDescription>
                Delete a tag that is no longer needed. This will remove the tag
                from all recipes that it is applied.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <DeleteTagsForm tags={allTags} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
