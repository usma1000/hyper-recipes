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
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-56 md:h-auto">
          {recipe.heroImage?.url ? (
            <Image
              src={recipe.heroImage.url}
              alt={recipe.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full min-h-[224px] w-full items-center justify-center bg-amber-50">
              <Utensils className="h-16 w-16 text-amber-300" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center p-6 md:p-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-amber-600">
            Featured Recipe
          </p>
          <h3 className="mb-3 text-2xl font-bold text-slate-900">
            {recipe.name}
          </h3>
          <p className="mb-6 text-slate-600 line-clamp-3">
            {recipe.description}
          </p>
          <Button asChild className="w-fit">
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

