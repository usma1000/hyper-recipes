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
import { SelectRecipe } from "~/server/db/schema";
import {
  createFavoriteRecipe,
  getAllTagsForRecipe,
  isFavoriteRecipe,
  removeFavoriteRecipe,
} from "~/server/queries";

export default async function RecipeDialog({
  recipe,
}: {
  recipe: SelectRecipe;
}) {
  const isFavorite = await isFavoriteRecipe(recipe.id);

  const tags = await getAllTagsForRecipe(recipe.id);

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
            <DialogDescription>{recipe.description}</DialogDescription>
          </div>
          <div className="flex flex-row gap-2">
            {tags
              .filter((tag) => tag.tagType === "Cuisine")
              .map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.cuisineType}
                </Badge>
              ))}
            {tags
              .filter((tag) => tag.tagType === "Meal")
              .map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.mealType}
                </Badge>
              ))}
          </div>
          <DialogFooter>
            <div className="flex w-full flex-row justify-between">
              <Link
                href={`/recipe/${recipe.id}`}
                className={buttonVariants({ variant: "default" })}
              >
                View Recipe
              </Link>
              <form action={toggleFavorite}>
                <Button type="submit" variant="ghost" size="sm">
                  <Star
                    className={`h-5 w-5 transition-all active:-translate-y-1 ${isFavorite ? "fill-amber-400" : ""}`}
                  />
                </Button>
              </form>
            </div>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
