import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAllIngredients,
  getAllTagNames,
  getAllTagsForRecipe,
  getIngredientsForRecipe,
  getRecipeNameAndDescription,
  getRecipe,
  getStepsByRecipeId,
} from "~/server/queries";
import EditRecipeForm from "../../_components/EditRecipeForm";
import AssignTagsForm from "../../_components/AssignTagsForm";
import IngredientsForm from "../../_components/IngredientsForm";
import StepsEditorWrapper from "./StepsEditorWrapper";
import DangerZoneDialog from "../../_components/DangerZoneDialog";
import UploadImageDialog from "../../_components/ImageDialogue";
import Image from "next/image";
import PublishControls from "./PublishControls";

export default async function EditRecipePage({
  id,
  slug,
}: {
  id: number;
  slug: string;
}) {
  // Fetch all recipe data
  const { name, description } = await getRecipeNameAndDescription(id);
  const recipe = await getRecipe(id);

  // Tags data
  const rawTags = await getAllTagNames();
  const allTags = rawTags.map((tag) => ({
    value: tag.id.toString(),
    label: tag.name,
  }));
  const rawAssignedTags = await getAllTagsForRecipe(id);
  const allAssignedTags = rawAssignedTags.map((tag) => ({
    id: tag.id,
  }));

  // Ingredients data
  const rawIngredients = await getAllIngredients();
  const allIngredients = rawIngredients.map((ingredient) => ({
    value: ingredient.id.toString(),
    label: ingredient.name,
  }));
  const rawAssignedIngredients = await getIngredientsForRecipe(id);
  const allAssignedIngredients = rawAssignedIngredients.map((ingredient) => ({
    id: ingredient.ingredient.id,
    name: ingredient.ingredient.name,
  }));

  // Steps data
  const steps = await getStepsByRecipeId(id);

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Edit Recipe</h1>
          <p className="text-muted-foreground">
            Make changes to your recipe "{name}"
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/recipe/${slug}`}
            className={buttonVariants({ variant: "outline" })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipe
          </Link>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Details</CardTitle>
              <CardDescription>
                Edit the basic information about your recipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <EditRecipeForm
                recipeId={id}
                initialName={name}
                initialDescription={description}
              />

              <Separator className="my-6" />

              <div>
                <h3 className="mb-4 text-lg font-medium">Recipe Image</h3>
                <div className="relative mb-4 h-64 w-full overflow-hidden rounded-lg bg-gray-100">
                  {recipe.heroImage?.url ? (
                    <Image
                      src={recipe.heroImage.url}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 700px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <p className="text-muted-foreground">No image selected</p>
                    </div>
                  )}
                </div>
                <UploadImageDialog recipeId={id} />
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="mb-4 text-lg font-medium">Tags</h3>
                <AssignTagsForm
                  allTags={allTags}
                  allAssignedTags={allAssignedTags}
                  recipeId={id}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ingredients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
              <CardDescription>
                Manage the ingredients needed for this recipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IngredientsForm
                recipeId={id}
                allIngredients={allIngredients}
                allAssignedIngredients={allAssignedIngredients}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="steps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cooking Steps</CardTitle>
              <CardDescription>
                Edit the step-by-step instructions for your recipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] rounded-md border">
                <StepsEditorWrapper steps={steps} recipeId={id} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Settings</CardTitle>
              <CardDescription>
                Manage publication status and danger zone options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PublishControls recipe={recipe} />
              <Separator className="my-8" />
              <DangerZoneDialog recipe={recipe} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
