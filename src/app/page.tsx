import { Suspense } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import RecipesCarousel from "./_components/RecipesCarousel";
import { fetchSliderRecipes } from "./_actions/recipes";
import { fetchAllTagsByType, fetchRecipesByTag } from "./_actions/tags";
import { fetchMyFavoriteRecipes } from "./_actions/favorites";
import { auth } from "@clerk/nextjs/server";
import TaggedRecipes from "./_components/TaggedRecipes";
import RecipeCardSkeleton from "./_components/RecipeCardSkeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  ChefHat,
  Clock,
  PlusCircle,
  Search,
  Star,
  Utensils,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default async function HomePage() {
  const { userId } = auth();

  const [allRecipes, tags, myFavoriteRecipes] = await Promise.all([
    fetchSliderRecipes(),
    fetchAllTagsByType(),
    userId ? fetchMyFavoriteRecipes() : Promise.resolve([]),
  ]);

  // Fetch recipes for each tag in parallel to avoid N+1 queries
  const tagRecipeResults = await Promise.all(
    tags.map(async (tag) => ({
      tagId: tag.id,
      recipes: await fetchRecipesByTag(tag.id),
    }))
  );

  const recipesByTag: Record<
    number,
    Awaited<ReturnType<typeof fetchRecipesByTag>>
  > = {};
  for (const result of tagRecipeResults) {
    recipesByTag[result.tagId] = result.recipes;
  }

  // Featured recipe - using the first recipe from all recipes
  const featuredRecipe = allRecipes[0];

  return (
    <div className="flex flex-col space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative -mt-8 flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-b-3xl bg-gradient-to-r from-amber-50 to-orange-100 px-4 py-24 text-center md:px-8">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="container relative z-10 mx-auto max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            Discover & Share
            <span className="text-amber-600"> Delicious Recipes</span>
          </h1>
          <p className="mb-8 text-lg text-slate-700 md:text-xl">
            Cook, share, and explore a world of flavors with our
            community-driven recipe collection
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SignedOut>
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Join the Community <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </SignedOut>
            <Button size="lg" variant="outline" asChild>
              <Link href="#browse">
                <Search className="mr-2 h-4 w-4" /> Browse Recipes
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="relative overflow-hidden border-2 border-amber-100">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-100"></div>
            <CardHeader>
              <ChefHat className="mb-2 h-10 w-10 text-amber-600" />
              <CardTitle>Easy Cooking</CardTitle>
              <CardDescription>
                Step-by-step instructions for cooks of all levels
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="relative overflow-hidden border-2 border-amber-100">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-100"></div>
            <CardHeader>
              <Utensils className="mb-2 h-10 w-10 text-amber-600" />
              <CardTitle>Organized Recipes</CardTitle>
              <CardDescription>
                Keep all your favorite recipes in one place
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="relative overflow-hidden border-2 border-amber-100">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-100"></div>
            <CardHeader>
              <Clock className="mb-2 h-10 w-10 text-amber-600" />
              <CardTitle>Save Time</CardTitle>
              <CardDescription>
                Quick search and filters to find the perfect dish
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Featured Recipe Section */}
      {featuredRecipe && (
        <section className="container">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold">Featured Recipe</h2>
            <p className="text-slate-500">
              Our chef's special selection for you today
            </p>
          </div>
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                {featuredRecipe.heroImage?.url ? (
                  <Image
                    src={featuredRecipe.heroImage.url}
                    alt={featuredRecipe.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-amber-50">
                    <Utensils className="h-16 w-16 text-amber-300" />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center p-8">
                <h3 className="mb-2 text-2xl font-bold">
                  {featuredRecipe.name}
                </h3>
                <p className="mb-6 text-slate-500">
                  {featuredRecipe.description}
                </p>
                <Button asChild>
                  <Link href={`/recipe/${featuredRecipe.slug}`}>
                    View Recipe <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Personal Section for Signed In Users */}
      <SignedIn>
        <section className="container">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold">My Favorites</h2>
            <p className="text-slate-500">
              Your personal collection of saved recipes
            </p>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            {myFavoriteRecipes?.length ? (
              <RecipesCarousel recipes={myFavoriteRecipes} />
            ) : (
              <Card className="border-dashed bg-slate-50 p-8 text-center">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Star className="mb-4 h-12 w-12 text-slate-300" />
                  <h3 className="mb-2 text-xl font-semibold">
                    No favorites yet
                  </h3>
                  <p className="mb-4 text-slate-500">
                    Save your favorite recipes by clicking the star icon
                  </p>
                  <Link href="#browse">
                    <Button variant="outline">Browse Recipes</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </Suspense>
        </section>
      </SignedIn>

      {/* Browse Recipes Section */}
      <section id="browse" className="container scroll-mt-16">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold">Browse Recipes</h2>
          <p className="text-slate-500">
            Discover dishes for every occasion and preference
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-slate-50 px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle>All Recipes</CardTitle>
              <SignedIn>
                <Link href="/new-recipe">
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Recipe
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <RecipeCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <RecipesCarousel recipes={allRecipes} />
            </Suspense>
          </CardContent>
        </Card>
      </section>

      {/* Browse by Tags Section */}
      <section className="container">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold">Explore by Category</h2>
          <p className="text-slate-500">
            Discover recipes by cuisine, meal type, or dietary preference
          </p>
        </div>
        <div className="mt-6">
          <Suspense
            fallback={
              <Card className="w-full overflow-hidden border-2 border-amber-50 shadow-sm">
                <CardHeader className="bg-amber-50/50 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-6 w-40 animate-pulse rounded bg-slate-200"></div>
                      <div className="mt-2 h-4 w-56 animate-pulse rounded bg-slate-200"></div>
                    </div>
                    <div className="h-10 w-[200px] animate-pulse rounded bg-slate-200"></div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-48 animate-pulse rounded-lg bg-slate-100"></div>
                </CardContent>
              </Card>
            }
          >
            <TaggedRecipes tags={tags} recipesByTag={recipesByTag} />
          </Suspense>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <div className="overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white md:p-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold">
                Ready to start cooking?
              </h2>
              <p className="mb-8 text-amber-50">
                Join our community of food enthusiasts and start sharing your
                recipes today.
              </p>
              <div className="flex flex-wrap gap-4">
                <SignedOut>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/sign-up">Create Account</Link>
                  </Button>
                </SignedOut>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white bg-transparent text-white hover:bg-white hover:text-amber-600"
                  asChild
                >
                  <Link href="#browse">Browse Recipes</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex md:items-center md:justify-center">
              <div className="relative h-40 w-40 rounded-full border-4 border-white/30">
                <div className="absolute left-0 top-0 h-full w-full rounded-full bg-white/10 backdrop-blur-sm"></div>
                <ChefHat className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
