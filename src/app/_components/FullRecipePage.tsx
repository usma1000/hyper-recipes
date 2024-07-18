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
import { SignedIn } from "@clerk/nextjs";
import FullRecipeSheet from "./FullRecipeSheet";

const fakeIngredients = [
  { amount: "2", name: "Onions" },
  { amount: "2 lbs", name: "Okra" },
  { amount: "2 tbsp", name: "Olive Oil" },
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
    <div className="flex flex-wrap gap-8">
      <div className="flex-grow-[1] basis-64">
        <div className="mb-8 flex justify-between align-middle">
          <Link
            href="/"
            className={`${buttonVariants({
              variant: "default",
              size: "sm",
            })}`}
          >
            <ArrowLeft size={16} /> Back
          </Link>
          {/* TODO: Update to admin only */}
          <SignedIn>
            <FullRecipeSheet recipeId={props.id} />
          </SignedIn>
        </div>
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="m-0">
              {fakeIngredients.map((ingredient) => (
                <li className="list-none">
                  <input type="checkbox" className="mr-2" />
                  {`${ingredient.amount} ${ingredient.name}`}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="flex grow-[999] basis-0 flex-col gap-8">
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
