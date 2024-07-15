import {
  createFavoriteRecipe,
  getAllTagsForRecipe,
  getRecipe,
  isFavoriteRecipe,
  removeFavoriteRecipe,
} from "~/server/queries";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const fakeIngredients = [
  { name: "Onions" },
  { name: "Okra" },
  { name: "Olive Oil" },
];

export default async function FullPageRecipeView(props: { id: number }) {
  const recipe = await getRecipe(props.id);

  const tags = await getAllTagsForRecipe(recipe.id);

  const isFavorite = await isFavoriteRecipe(recipe.id);

  async function toggleFavorite() {
    "use server";
    if (isFavorite) {
      await removeFavoriteRecipe(recipe.id);
    } else {
      await createFavoriteRecipe(recipe.id);
    }
  }

  return (
    <div className="flex">
      <div className="basis-1/4">
        <Link
          href="/"
          className={`${buttonVariants({
            variant: "outline",
            size: "sm",
          })} mb-8`}
        >
          <ArrowLeft size={16} /> Back
        </Link>
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="m-0">
              {fakeIngredients.map((ingredient) => (
                <li className="list-none">
                  <input type="checkbox" className="mr-2" />
                  {ingredient.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full flex-col gap-8 pl-8">
        <Card>
          <CardHeader>
            {recipe.heroImage?.url && (
              <div className="relative mb-8 h-96">
                {/* update "sizes" when mobile is fixed */}
                <Image
                  src={recipe.heroImage.url}
                  alt={recipe.heroImage.name}
                  fill={true}
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 510px"
                  className="rounded-lg"
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
            <div className="flex items-end gap-2">
              <h1>{recipe.name}</h1>
              <form action={toggleFavorite}>
                <Button type="submit" variant="ghost" size="sm">
                  <Star
                    className={`h-5 w-5 transition-all active:-translate-y-1 ${isFavorite ? "fill-amber-400" : ""}`}
                  />
                </Button>
              </form>
            </div>
            <CardDescription>{recipe.description}</CardDescription>
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
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Steps:</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              This is where a recipe steps would go. This is just an example
              until QuillJs is set up. There would be a list of steps here. I
              want to include callouts and other formatting options.
            </p>
            <p>
              This is where a recipe steps would go. This is just an example
              until QuillJs is set up. There would be a list of steps here. I
              want to include callouts and other formatting options.
            </p>
            <p>
              This is where a recipe steps would go. This is just an example
              until QuillJs is set up. There would be a list of steps here. I
              want to include callouts and other formatting options.
            </p>
            <p>
              This is where a recipe steps would go. This is just an example
              until QuillJs is set up. There would be a list of steps here. I
              want to include callouts and other formatting options.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
