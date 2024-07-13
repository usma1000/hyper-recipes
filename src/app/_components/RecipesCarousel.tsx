import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Star } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SelectRecipe } from "~/server/db/schema";

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
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="h-full overflow-hidden transition-all hover:-translate-y-1 hover:cursor-pointer hover:shadow-md">
                      <div className="relative h-48">
                        {recipe.heroImage?.url && (
                          <Image
                            src={recipe.heroImage.url}
                            alt={recipe.heroImage.name}
                            fill={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 250px"
                            style={{ objectFit: "cover" }}
                          />
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle>{recipe.name}</CardTitle>
                        <CardDescription>{recipe.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </DialogTrigger>
                  <DialogPortal>
                    <DialogOverlay />
                    <DialogContent>
                      {recipe.heroImage?.url && (
                        <DialogHeader className="relative h-64">
                          <Image
                            src={recipe.heroImage.url}
                            alt={recipe.heroImage.name}
                            width={463}
                            height={256}
                            className="h-auto overflow-hidden rounded-md shadow-sm"
                            style={{ objectFit: "cover" }}
                          />
                        </DialogHeader>
                      )}
                      <DialogTitle>{recipe.name}</DialogTitle>
                      <div>
                        <DialogDescription>
                          {recipe.description}
                        </DialogDescription>
                      </div>
                      <div className="flex flex-row gap-2">
                        <Badge variant="outline">Indian</Badge>
                        <Badge variant="outline">Vegetarian</Badge>
                      </div>
                      <DialogFooter>
                        <div className="flex w-full flex-row justify-between">
                          <Link
                            href={`/recipe/${recipe.id}`}
                            className={buttonVariants({ variant: "default" })}
                          >
                            View Recipe
                          </Link>
                          <Button variant="outline" size="icon">
                            <Star className="h-3 w-3" />
                          </Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </DialogPortal>
                </Dialog>
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
