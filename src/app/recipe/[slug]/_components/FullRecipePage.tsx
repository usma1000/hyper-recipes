import { getFullRecipeById } from "~/server/queries";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Soup } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import FullRecipeSheet from "./FullRecipeSheet";
import StepsEditor from "./StepsEditor";
import { EditorRoot } from "novel";
import { onPublishRecipe } from "./actions";
import DangerZoneDialog from "./DangerZoneDialog";
import Ingredients from "../../../_components/Ingredients";
import UploadImageDialog from "./ImageDialogue";
import { Suspense } from "react";
import CookingHistory from "./CookingHistory";
import { type JSONContent } from "novel";
import { FavoriteButton } from "./FavoriteButton";
import { AddToCollectionButton } from "./AddToCollectionButton";
import { AdminWrapper } from "./AdminWrapper";

export default async function FullRecipePage({
  id,
  slug,
}: {
  id: number;
  slug: string;
}) {
  const { userId } = auth();

  // Fetch recipe with all relations in a single cached query
  const fullRecipe = await getFullRecipeById(id);

  // Access control for unpublished recipes
  if (!fullRecipe.published && !userId) {
    throw new Error("Recipe is unpublished.");
  }

  // Extract data from the consolidated query result
  const recipe = fullRecipe;
  const ingredients = fullRecipe.ingredients;
  const tags = fullRecipe.tags.map((t) => t.tag);
  const steps = fullRecipe.steps as JSONContent;

  async function publishRecipe(): Promise<void> {
    "use server";
    await onPublishRecipe(recipe.id, true);
  }

  return (
    <>
      {recipe.published === false && (
        <div className="mb-8 flex items-center justify-between rounded-md border border-yellow-400 bg-yellow-100 p-4 font-semibold text-yellow-800">
          <div>
            <AlertTriangle
              size={16}
              className="mr-2 inline-block -translate-y-[2px]"
            />
            This recipe is not yet published. It will not be visible to others.
          </div>
          <form action={publishRecipe}>
            <Button>Publish</Button>
          </form>
        </div>
      )}
      <div className="flex flex-wrap gap-8">
        <div className="flex-grow-[1] basis-64">
          <div className="mb-8 flex justify-between align-middle">
            <Link
              href="/"
              className={`${buttonVariants({
                variant: "default",
                size: "sm",
              })}`}
            >
              <ArrowLeft size={16} className="mr-2" /> Back
            </Link>
            <AdminWrapper>
              <FullRecipeSheet recipeId={id} />
            </AdminWrapper>
          </div>
          <div className="flex flex-col gap-8">
            <SignedIn>
              <CookingHistory recipeSlug={slug} />
            </SignedIn>
            <Suspense
              fallback={
                <Card>
                  <CardHeader>
                    <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-4 w-full animate-pulse rounded bg-slate-200"
                      />
                    ))}
                  </CardContent>
                </Card>
              }
            >
              <Ingredients ingredients={ingredients} showCheckboxes={true} />
            </Suspense>
            <AdminWrapper>
              <DangerZoneDialog recipe={recipe} />
            </AdminWrapper>
          </div>
        </div>
        <div className="flex grow-[999] basis-0 flex-col gap-8">
          <Suspense
            fallback={
              <Card>
                <CardHeader>
                  <div className="relative mb-8 h-96 animate-pulse rounded-lg bg-slate-200" />
                  <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                </CardHeader>
              </Card>
            }
          >
            <Card>
              <CardHeader>
                <div className="relative mb-8 h-96">
                  {recipe.heroImage?.url ? (
                    <>
                      <Image
                        src={recipe.heroImage.url}
                        alt={recipe.heroImage.name}
                        fill={true}
                        priority={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 510px"
                        className="rounded-lg"
                        style={{ objectFit: "cover" }}
                      />
                      <AdminWrapper>
                        <div className="absolute right-4 top-4">
                          <UploadImageDialog recipeId={recipe.id} />
                        </div>
                      </AdminWrapper>
                    </>
                  ) : (
                    <div className="relative flex h-full items-center justify-center rounded-lg bg-gray-200">
                      <AdminWrapper>
                        <div className="absolute right-4 top-4">
                          <UploadImageDialog recipeId={recipe.id} />
                        </div>
                      </AdminWrapper>
                      <Soup size={64} className="m-auto text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex items-end gap-2">
                  <h1>{recipe.name}</h1>
                  <FavoriteButton recipeId={recipe.id} />
                  <AddToCollectionButton recipeId={recipe.id} />
                </div>
                <div className="flex flex-row gap-2">
                  {tags
                    .filter((tag) => tag.tagType === "Cuisine")
                    .map((tag) => (
                      <Badge className="my-3" key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  {tags
                    .filter((tag) => tag.tagType === "Meal")
                    .map((tag) => (
                      <Badge className="my-3" key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  {tags
                    .filter((tag) => tag.tagType === "Diet")
                    .map((tag) => (
                      <Badge className="my-3" key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                </div>
                <CardDescription>{recipe.description}</CardDescription>
              </CardHeader>
            </Card>
          </Suspense>

          <Suspense
            fallback={
              <Card>
                <CardHeader className="mb-4 border-b border-slate-200">
                  <CardTitle as="h2" className="text-3xl">
                    Steps
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                      <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            }
          >
            <Card>
              <CardHeader className="mb-4 border-b border-slate-200">
                <CardTitle as="h2" className="text-3xl">
                  Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EditorRoot>
                  <StepsEditor recipeId={id} steps={steps} />
                </EditorRoot>
              </CardContent>
            </Card>
          </Suspense>

          <SignedIn>
            <Card>
              <CardHeader>
                <CardTitle>Personal Notes</CardTitle>
                <CardDescription>
                  Notes are private and only visible to you.
                </CardDescription>
              </CardHeader>
              <CardContent>Feature coming soon.</CardContent>
            </Card>
          </SignedIn>
        </div>
      </div>
    </>
  );
}
