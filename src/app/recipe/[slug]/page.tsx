import { Suspense, cache } from "react";
import {
  getRecipeIdFromSlug,
  getRecipeMetadata,
  getAllRecipeNames,
} from "~/server/queries";
import FullRecipePage from "./_components/FullRecipePage";
import RecipeLoading from "./loading";
import { env } from "~/env";

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
  },
);

/**
 * Gets the site URL for absolute OpenGraph image URLs.
 * Falls back to localhost in development.
 */
function getSiteUrl(): string {
  if (env.NEXT_PUBLIC_SITE_URL) {
    return env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.NODE_ENV === "production") {
    return "https://hyper-recipes.vercel.app";
  }
  return "http://localhost:3000";
}

export async function generateMetadata({ params: { slug } }: Props) {
  const id = await getCachedRecipeIdFromSlug(slug);
  const recipeMetadata = await getRecipeMetadata(id);
  const siteUrl = getSiteUrl();
  const recipeUrl = `${siteUrl}/recipe/${slug}`;

  const openGraphImages = recipeMetadata.heroImageUrl
    ? [
        {
          url: recipeMetadata.heroImageUrl,
          width: 1200,
          height: 630,
          alt: recipeMetadata.name,
        },
      ]
    : [];

  return {
    title: `${recipeMetadata.name} | Hyper Recipes`,
    description: recipeMetadata.description,
    openGraph: {
      title: recipeMetadata.name,
      description: recipeMetadata.description,
      url: recipeUrl,
      siteName: "Hyper Recipes",
      images: openGraphImages,
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: recipeMetadata.name,
      description: recipeMetadata.description,
      images: recipeMetadata.heroImageUrl ? [recipeMetadata.heroImageUrl] : [],
    },
  };
}

export default async function RecipePage({ params: { slug } }: Props) {
  const id = await getCachedRecipeIdFromSlug(slug);

  return (
    <div className="container py-8">
      <Suspense fallback={<RecipeLoading />}>
        <FullRecipePage id={id} slug={slug} />
      </Suspense>
    </div>
  );
}
