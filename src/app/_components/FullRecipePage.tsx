import { getRecipe } from "~/server/queries";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

const fakeIngredients = [
  { name: "Onions" },
  { name: "Okra" },
  { name: "Olive Oil" },
];

export default async function FullPageRecipeView(props: { id: number }) {
  const recipe = await getRecipe(props.id);

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
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="ml-2">
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
                <Image
                  src={recipe.heroImage.url}
                  alt={recipe.heroImage.name}
                  fill={true}
                  className="rounded-lg"
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
            <h1>{recipe.name}</h1>
            <CardDescription>{recipe.description}</CardDescription>
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
