import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SelectRecipe } from "~/server/db/schema";
import RecipeDialog from "./RecipeDialog";

export default async function RecipesCarousel({
  recipes,
}: {
  recipes: SelectRecipe[];
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
                <RecipeDialog recipe={recipe} />
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
