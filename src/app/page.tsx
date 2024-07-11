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
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

async function Recipes() {
  const recipes = await getAllRecipes();

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {recipes.length === 0 && (
        <div className="w-full text-center text-2xl">No recipes yet</div>
      )}
      {recipes.map((recipe) => {
        return (
          <div key={recipe.id} className="w-48">
            <Dialog>
              <DialogTrigger asChild>
                <div>
                  {recipe.heroImage?.url && (
                    <Image
                      src={recipe.heroImage.url}
                      alt={recipe.heroImage.name}
                      width={200}
                      height={160}
                      className="rounded-md shadow-lg hover:shadow-2xl"
                    />
                  )}
                  <span className="mt-2 block font-semibold">
                    {recipe.name}
                  </span>
                  <p className="text-sm text-gray-400">{recipe.description}</p>
                </div>
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                  {recipe.heroImage?.url && (
                    <DialogHeader className="w relative h-64">
                      <Image
                        src={recipe.heroImage.url}
                        alt={recipe.heroImage.name}
                        fill={true}
                        className="rounded-md shadow-lg"
                        style={{ objectFit: "cover" }}
                      />
                    </DialogHeader>
                  )}
                  <DialogTitle>{recipe.name}</DialogTitle>
                  <DialogDescription>{recipe.description}</DialogDescription>
                  <DialogFooter>
                    <Button variant="outline" size="icon">
                      <Star className="h-3 w-3" />
                    </Button>
                    <Link
                      href={`/recipe/${recipe.id}`}
                      className={buttonVariants({ variant: "default" })}
                    >
                      View Recipe
                    </Link>
                  </DialogFooter>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          </div>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <h2>All Recipes</h2>
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
