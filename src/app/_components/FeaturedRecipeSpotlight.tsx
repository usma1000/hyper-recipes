import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils } from "lucide-react";

type FeaturedRecipeSpotlightProps = {
  recipe: Recipe;
};

/**
 * Full-width featured recipe spotlight.
 * Displays a highlighted recipe with hero image.
 * @param recipe - The recipe to feature
 */
export function FeaturedRecipeSpotlight({ recipe }: FeaturedRecipeSpotlightProps): JSX.Element {
  return (
    <section className="group overflow-hidden rounded-2xl border border-neutral-200/60 bg-white transition-all duration-200 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:shadow-neutral-950/50">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800 md:aspect-auto md:min-h-[320px]">
          {recipe.heroImage?.url ? (
            <Image
              src={recipe.heroImage.url}
              alt={recipe.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />
          ) : (
            <div className="flex h-full min-h-[280px] w-full items-center justify-center">
              <Utensils className="h-16 w-16 text-neutral-300 dark:text-neutral-600" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center p-8 md:p-10">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Featured Recipe
          </p>
          <h3 className="mb-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white md:text-3xl">
            {recipe.name}
          </h3>
          <p className="mb-8 line-clamp-3 text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {recipe.description}
          </p>
          <Button 
            asChild 
            className="w-fit rounded-xl bg-neutral-900 px-6 text-[14px] font-medium shadow-sm transition-all hover:bg-neutral-800 hover:shadow-md dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            <Link href={`/recipe/${recipe.slug}`}>
              View Recipe
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
