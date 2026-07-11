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
    <section className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-foreground/15 hover:shadow-lg hover:shadow-lift dark:border-border dark:bg-card dark:hover:border-border dark:hover:shadow-lift">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted dark:bg-muted md:aspect-auto md:min-h-[320px]">
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
              <Utensils className="h-16 w-16 text-muted-foreground/40 dark:text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center p-8 md:p-10">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground">
            Featured Recipe
          </p>
          <h3 className="mb-3 text-2xl font-semibold tracking-tight text-foreground dark:text-foreground md:text-3xl">
            {recipe.name}
          </h3>
          <p className="mb-8 line-clamp-3 text-[15px] leading-relaxed text-muted-foreground dark:text-muted-foreground">
            {recipe.description}
          </p>
          <Button 
            asChild 
            className="w-fit rounded-xl bg-primary px-6 text-[14px] font-medium shadow-sm transition-all hover:bg-muted hover:shadow-md dark:bg-card dark:text-foreground dark:hover:bg-muted"
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
