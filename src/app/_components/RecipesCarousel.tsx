import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import RecipeDialog from "./RecipeDialog";
import { Suspense } from "react";
import RecipeCardSkeleton from "./RecipeCardSkeleton";

export default async function RecipesCarousel({
  recipes,
}: {
  recipes: Recipe[];
}) {
  return (
    <div>
      <Carousel className="w-full">
        <CarouselContent className="py-4">
          {recipes?.map((recipe) => {
            return (
              <CarouselItem
                key={recipe.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <Suspense key={recipe.id} fallback={<RecipeCardSkeleton />}>
                  <RecipeDialog recipe={recipe} />
                </Suspense>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
