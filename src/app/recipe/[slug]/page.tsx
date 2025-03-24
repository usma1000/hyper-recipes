import { Suspense } from "react";
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
  const id = await getRecipeIdFromSlug(slug);
  const { name, description } = await getRecipeNameAndDescription(id);
  return {
    title: `Recipe for ${name}`,
    description: description,
  };
}

export default async function RecipePage({ params: { slug } }: Props) {
  const id = await getRecipeIdFromSlug(slug);

  return (
    <div>
      <Suspense fallback={<RecipeLoading />}>
        <FullRecipePage id={id} />
      </Suspense>
    </div>
  );
}
