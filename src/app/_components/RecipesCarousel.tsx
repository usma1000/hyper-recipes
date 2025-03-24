import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Suspense } from "react";
import RecipeCardSkeleton from "./RecipeCardSkeleton";
import RecipeCard from "./RecipeCard";

export default async function RecipesCarousel({
  recipes,
}: {
  recipes?: Recipe[];
}) {
  if (!recipes) {
    console.log("No recipes provided to RecipesCarousel");
    return null;
  }

  return (
    <div>
      <Carousel className="w-full">
        <CarouselContent className="py-4">
          {recipes.map((recipe) => (
            <CarouselItem key={recipe.id} className="md:basis-1/2 lg:basis-1/3">
              <Suspense key={recipe.id} fallback={<RecipeCardSkeleton />}>
                <RecipeCard recipe={recipe} />
              </Suspense>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
