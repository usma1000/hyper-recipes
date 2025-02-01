import {
  createFavoriteRecipe,
  getIngredientsForRecipe,
  getAllTagsForRecipe,
  getRecipe,
  isFavoriteRecipe,
  removeFavoriteRecipe,
  getStepsByRecipeId,
} from "~/server/queries";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import FullRecipeSheet from "./FullRecipeSheet";
import StepsEditor from "./StepsEditor";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { EditorRoot } from "novel";
import { onPublishRecipe } from "./actions";
import DangerZoneDialog from "./DangerZoneDialog";

export default async function FullRecipePage(props: { id: number }) {
  const { userId } = auth();
  const recipe = await getRecipe(props.id);
  const ingredients = await getIngredientsForRecipe(props.id);
  const tags = await getAllTagsForRecipe(recipe.id);
  const steps = await getStepsByRecipeId(recipe.id);
  let isFavorite = false;

  if (userId) {
    isFavorite = await isFavoriteRecipe(recipe.id);
  }

  async function toggleFavorite() {
    "use server";
    if (isFavorite) {
      await removeFavoriteRecipe(recipe.id);
    } else {
      await createFavoriteRecipe(recipe.id);
    }
  }

  async function publishRecipe() {
    "use server";
    await onPublishRecipe(recipe.id, true);
  }

  return (
    <>
      {recipe.published === false && (
        <div className="mb-8 flex items-center justify-between rounded-md border border-yellow-400 bg-yellow-100 p-4 font-semibold text-yellow-800">
          <div>
            <AlertTriangle
              size={16}
              className="mr-2 inline-block -translate-y-[2px]"
            />
            This recipe is not yet published. It will not be visible to others.
          </div>
          <form action={publishRecipe}>
            <Button>Publish</Button>
          </form>
        </div>
      )}
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
          <div className="sticky top-8">
            <Card>
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
                      <input type="checkbox" className="mr-2" />
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
              <CardFooter>
                <Button>
                  <ShoppingCart size={16} className="mr-2" />
                  My Shopping List
                </Button>
              </CardFooter>
            </Card>
            <SignedIn>
              <DangerZoneDialog recipe={recipe} />
            </SignedIn>
          </div>
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
                <SignedIn>
                  <form action={toggleFavorite}>
                    <Button type="submit" variant="ghost" size="sm">
                      <Star
                        className={`h-5 w-5 transition-all active:-translate-y-1 ${isFavorite ? "fill-amber-400" : ""}`}
                      />
                    </Button>
                  </form>
                </SignedIn>
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
                {tags
                  .filter((tag) => tag.tagType === "Diet")
                  .map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="mb-4 border-b border-slate-200 bg-slate-50">
              <CardTitle as="h2" className="text-3xl">
                Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EditorRoot>
                <StepsEditor steps={steps} />
              </EditorRoot>
            </CardContent>
          </Card>
          <SignedIn>
            <Card>
              <CardHeader>
                <CardTitle>Personal Notes</CardTitle>
                <CardDescription>
                  Notes are private and only visible to you.
                </CardDescription>
              </CardHeader>
              <CardContent>Nothing here yet.</CardContent>
            </Card>
          </SignedIn>
        </div>
      </div>
    </>
  );
}
