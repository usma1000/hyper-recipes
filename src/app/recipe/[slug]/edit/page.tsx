import { Suspense } from "react";
import { redirect } from "next/navigation";
import {
  getRecipeIdFromSlug,
  getRecipeNameAndDescription,
} from "~/server/queries";
import { checkRole } from "~/utils/roles";
import EditRecipePage from "./_components/EditRecipePage";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params: { slug } }: Props) {
  const id = await getRecipeIdFromSlug(slug);
  const { name } = await getRecipeNameAndDescription(id);
  return {
    title: `Edit Recipe: ${name}`,
    description: `Edit details for the recipe "${name}"`,
  };
}

export default async function EditRecipePageContainer({
  params: { slug },
}: Props) {
  // Check if user is admin, otherwise redirect
  const isAdmin = await checkRole("admin");
  if (!isAdmin) {
    redirect(`/recipe/${slug}`);
  }

  const id = await getRecipeIdFromSlug(slug);

  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <EditRecipePage id={id} slug={slug} />
    </Suspense>
  );
}
