import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getAllRecipes } from "~/server/queries";
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
import { Car, Star } from "lucide-react";
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

export const dynamic = "force-dynamic";

async function Recipes() {
  const recipes = await getAllRecipes();

  return (
    <div>
      {recipes.length === 0 && (
        <div className="w-full text-center text-2xl">No recipes yet</div>
      )}
      <Carousel className="w-full">
        <CarouselContent className="py-4">
          {recipes.map((recipe) => {
            return (
              <CarouselItem
                key={recipe.id}
                className="md:basis-1/2 lg:basis-1/2"
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
                            fill={true}
                            className="rounded-md shadow-sm"
                            style={{ objectFit: "cover" }}
                          />
                        </DialogHeader>
                      )}
                      <DialogTitle>{recipe.name}</DialogTitle>
                      <DialogDescription>
                        {recipe.description}
                      </DialogDescription>
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

export default function HomePage() {
  return (
    <>
      <h1>Featured Recipes</h1>
      <Recipes />
      <h2>My favorites</h2>
      <p>Favorites go here...</p>
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">Please sign in</div>
      </SignedOut>
      <SignedIn>
        <div>Signed in: Button to create or edit recipes.</div>
      </SignedIn>
    </>
  );
}
