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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, Plus, Server, Tags } from "lucide-react";

export default async function Page() {
  // Fetch data in parallel to improve loading time
  const [rawTags, unpublishedRecipes] = await Promise.all([
    getAllTagNames(),
    getUnpublishedRecipes(),
  ]);

  const allTags = rawTags.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <ChefHat className="h-5 w-5" />
            Recipe Management
          </h2>
        </div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Unpublished Recipes</CardTitle>
            <CardDescription>
              These recipes will only be visible to you until they are published
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UnpublishedRecipesTable recipes={unpublishedRecipes} />
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Server className="h-5 w-5" />
            Ingredient Management
          </h2>
        </div>
        <Card>
          <Tabs defaultValue="create">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Ingredients</CardTitle>
                  <CardDescription>
                    Create and manage ingredients for your recipes
                  </CardDescription>
                </div>
                <TabsList>
                  <TabsTrigger value="create">
                    <Plus className="mr-1 h-4 w-4" />
                    Create
                  </TabsTrigger>
                  <TabsTrigger value="delete" disabled>
                    Delete
                  </TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="create" className="mt-0 pt-0">
                <CreateIngredientForm />
              </TabsContent>
              <TabsContent value="delete" className="mt-0 pt-0">
                <p className="text-sm italic text-muted-foreground">
                  Coming soon...
                </p>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Tags className="h-5 w-5" />
            Tag Management
          </h2>
        </div>
        <Card>
          <Tabs defaultValue="create">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Tags</CardTitle>
                  <CardDescription>
                    Create and manage tags for organizing your recipes
                  </CardDescription>
                </div>
                <TabsList>
                  <TabsTrigger value="create">
                    <Plus className="mr-1 h-4 w-4" />
                    Create
                  </TabsTrigger>
                  <TabsTrigger value="delete">Delete</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="create" className="mt-0 pt-0">
                <CreateTagsForm />
              </TabsContent>
              <TabsContent value="delete" className="mt-0 pt-0">
                <DeleteTagsForm tags={allTags} />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </section>
    </div>
  );
}
