import { Suspense } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { fetchCollectionById } from "../../_actions/collections";
import { RecipeGrid, RecipeGridSkeleton } from "../../_components/RecipeGrid";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { DeleteCollectionDialog } from "./_components/DeleteCollectionDialog";

type Props = {
  params: { id: string };
};

/**
 * Single collection page displaying collection details and recipes.
 * Redirects to home if user is not signed in or collection doesn't exist.
 */
export default async function CollectionPage({
  params,
}: Props): Promise<JSX.Element> {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const collectionId = Number(params.id);

  if (isNaN(collectionId)) {
    notFound();
  }

  const collection = await fetchCollectionById(collectionId);

  if (!collection) {
    notFound();
  }

  const recipes = collection.recipes
    .map((cr) => cr.recipe)
    .filter((recipe) => recipe.published === true);

  return (
    <>
      <SignedOut>
        <div className="container py-8">
          <p className="text-center text-neutral-500">
            Please sign in to view collections.
          </p>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="container py-8">
          <div className="mb-8">
            <Link
              href="/collections"
              className={buttonVariants({
                variant: "default",
                size: "sm",
              })}
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Collections
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="mt-2 text-[15px] text-neutral-500 dark:text-neutral-400">
                {collection.description}
              </p>
            )}
            <p className="mt-2 text-[14px] text-neutral-400 dark:text-neutral-500">
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
            </p>
          </div>

          {recipes.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Recipes Yet</CardTitle>
                <CardDescription>
                  This collection doesn't have any recipes yet. Browse recipes
                  and add them to this collection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/"
                  className={buttonVariants({
                    variant: "default",
                  })}
                >
                  Browse Recipes
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Suspense fallback={<RecipeGridSkeleton count={9} />}>
              <RecipeGrid recipes={recipes} columns={3} />
            </Suspense>
          )}

          <Card className="mt-8 border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete this collection. This action cannot be
                undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DeleteCollectionDialog
                collectionId={collection.id}
                collectionTitle={collection.title}
              />
            </CardContent>
          </Card>
        </div>
      </SignedIn>
    </>
  );
}
