import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  getRecipeIdFromSlug,
  getRecipeNameAndDescription,
} from "~/server/queries";
import FullRecipePage from "./_components/FullRecipePage";
import RecipeLoading from "./loading";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params: { slug } }: Props) {
  try {
    const id = await getRecipeIdFromSlug(slug);
    const { name, description } = await getRecipeNameAndDescription(id);
    return {
      title: `Recipe for ${name}`,
      description: description,
    };
  } catch (error) {
    return {
      title: "Recipe Not Found",
      description: "The requested recipe could not be found",
    };
  }
}

export default async function RecipePage({ params: { slug } }: Props) {
  try {
    const id = await getRecipeIdFromSlug(slug);

    return (
      <div>
        <Suspense fallback={<RecipeLoading />}>
          <FullRecipePage id={id} slug={slug} />
        </Suspense>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
