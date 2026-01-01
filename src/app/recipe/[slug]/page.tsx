import { Suspense, cache } from "react";
import {
  getRecipeIdFromSlug,
  getRecipeNameAndDescription,
  getAllRecipeNames,
} from "~/server/queries";
import FullRecipePage from "./_components/FullRecipePage";
import RecipeLoading from "./loading";

/**
 * Enable ISR with 60 second revalidation for recipe pages.
 * Published recipes benefit from caching while unpublished ones
 * remain dynamic due to auth checks.
 */
export const revalidate = 60;

type Props = {
  params: { slug: string };
};

/**
 * Pre-generate pages for all published recipes at build time.
 * This improves initial load performance for popular recipes.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const recipes = await getAllRecipeNames();
  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }));
}

/**
 * Cached version of getRecipeIdFromSlug to dedupe calls within a single request.
 * React's cache() ensures metadata and page render share the same lookup.
 */
const getCachedRecipeIdFromSlug = cache(
  async (slug: string): Promise<number> => {
    return getRecipeIdFromSlug(slug);
  }
);

export async function generateMetadata({ params: { slug } }: Props) {
  const id = await getCachedRecipeIdFromSlug(slug);
  const { name, description } = await getRecipeNameAndDescription(id);
  return {
    title: `Recipe for ${name}`,
    description: description,
  };
}

export default async function RecipePage({ params: { slug } }: Props) {
  const id = await getCachedRecipeIdFromSlug(slug);

  return (
    <div>
      <Suspense fallback={<RecipeLoading />}>
        <FullRecipePage id={id} slug={slug} />
      </Suspense>
    </div>
  );
}
