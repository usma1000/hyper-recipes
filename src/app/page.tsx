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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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
          <div key={recipe.id} className="w-64">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="overflow-hidden transition-all hover:-translate-y-1 hover:cursor-pointer hover:shadow-lg">
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
                  <DialogDescription>{recipe.description}</DialogDescription>
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
