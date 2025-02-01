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
import { Plus, Soup, Star } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  createFavoriteRecipe,
  getAllTagsForRecipe,
  getIngredientsForRecipe,
  isFavoriteRecipe,
  removeFavoriteRecipe,
} from "~/server/queries";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SignedIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function RecipeDialog({ recipe }: { recipe: Recipe }) {
  const user = await currentUser();

  let isFavorite = false;
  if (user) {
    isFavorite = await isFavoriteRecipe(recipe.id);
  }

  const tags = await getAllTagsForRecipe(recipe.id);

  const ingredients = await getIngredientsForRecipe(recipe.id);

  async function toggleFavorite() {
    "use server";
    if (isFavorite) {
      await removeFavoriteRecipe(recipe.id);
    } else {
      await createFavoriteRecipe(recipe.id);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="h-full overflow-hidden transition-all hover:-translate-y-1 hover:cursor-pointer hover:shadow-md">
          <div className="relative h-48">
            {recipe.heroImage?.url ? (
              <Image
                src={recipe.heroImage.url}
                alt={recipe.heroImage.name}
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 250px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-200">
                <Soup size={64} className="m-auto text-gray-400" />
              </div>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex w-full flex-row gap-4">
              <Link
                href={`/recipe/${recipe.id}`}
                className={buttonVariants({ variant: "default" })}
              >
                View Full Recipe
              </Link>
              <SignedIn>
                <form action={toggleFavorite}>
                  <Button type="submit" variant="secondary" size="default">
                    <Star
                      className={`mr-2 h-5 w-5 transition-all active:-translate-y-1 ${isFavorite ? "fill-amber-400" : ""}`}
                    />
                    Favorite
                  </Button>
                </form>
              </SignedIn>
            </div>
          </DialogHeader>
          <div className="flex gap-4">
            <Card className="grow-[999] basis-0">
              {recipe.heroImage?.url ? (
                <div className="relative flex h-64 flex-col space-y-1.5">
                  <Image
                    src={recipe.heroImage.url}
                    alt={recipe.heroImage.name}
                    width={463}
                    height={256}
                    className="mb-4 h-auto overflow-hidden rounded-t-md shadow-sm"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-auto min-h-40 items-center justify-center bg-gray-200">
                  <Soup size={64} className="m-auto text-gray-400" />
                </div>
              )}
              <CardContent className="flex flex-col gap-4">
                <DialogTitle>{recipe.name}</DialogTitle>
                <div>
                  <DialogDescription>{recipe.description}</DialogDescription>
                </div>
                <div className="flex flex-row gap-2">
                  {tags
                    .filter((tag) => tag.tagType === "Cuisine")
                    .map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  {tags
                    .filter((tag) => tag.tagType === "Meal")
                    .map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  {tags
                    .filter((tag) => tag.tagType === "Diet")
                    .map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
            <Card className="sticky top-8 flex-grow-[1] basis-64">
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="m-0">
                  {ingredients.length === 0 && (
                    <span className="text-sm">
                      Oops. Someone forgot to add the ingredients.
                    </span>
                  )}
                  {ingredients.map(({ ingredient, quantity }) => (
                    <li className="flex list-none items-center text-sm leading-tight">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button
                            variant="link"
                            size="sm"
                            className="font-semibold"
                          >
                            {ingredient.name}
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div>{ingredient.description}</div>
                          <Button className="mt-4" size="sm">
                            <Plus size={16} /> Shopping List
                          </Button>
                        </HoverCardContent>
                      </HoverCard>
                      <span>{quantity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
