import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Soup, FolderPlus, Heart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  favorites: Recipe[];
  collections: Collection[];
};

/**
 * Right sidebar for logged-in homepage.
 * Contains Saved, Lists, and Your Recipes sections.
 * @param favorites - User's favorited recipes
 * @param collections - User's recipe collections
 */
export function Sidebar({ favorites, collections }: SidebarProps): JSX.Element {
  return (
    <aside className="space-y-6">
      <SavedSection favorites={favorites} />
      <ListsSection collections={collections} />
      <YourRecipesSection />
    </aside>
  );
}

type SavedSectionProps = {
  favorites: Recipe[];
};

/**
 * Saved recipes section (favorites).
 * Shows top 5 with link to view all.
 */
function SavedSection({ favorites }: SavedSectionProps): JSX.Element {
  if (!favorites || favorites.length === 0) {
    return (
      <section className="rounded-2xl border border-neutral-200/60 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-4 flex items-center gap-2">
          <Heart className="h-5 w-5 text-neutral-400" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">Saved</h3>
        </div>
        <p className="text-[14px] text-neutral-500 dark:text-neutral-400">
          Save recipes to build your shortlist.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-neutral-200/60 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-neutral-400" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">Saved</h3>
        </div>
        <Link
          href="/favorites"
          className="flex items-center gap-1 text-[13px] font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="space-y-3">
        {favorites.slice(0, 5).map((recipe) => (
          <SidebarRecipeItem key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}

type ListsSectionProps = {
  collections: Collection[];
};

/**
 * Lists section (collections).
 * Shows collections with link to manage.
 */
function ListsSection({ collections }: ListsSectionProps): JSX.Element {
  if (!collections || collections.length === 0) {
    return (
      <section className="rounded-2xl border border-neutral-200/60 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-4 flex items-center gap-2">
          <FolderPlus className="h-5 w-5 text-neutral-400" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">Lists</h3>
        </div>
        <p className="mb-3 text-[14px] text-neutral-500 dark:text-neutral-400">
          Make lists for your go-to meals.
        </p>
        <Link href="/collections">
          <Button variant="outline" size="sm" className="w-full">
            Create a list
          </Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-neutral-200/60 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderPlus className="h-5 w-5 text-neutral-400" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">Lists</h3>
        </div>
        <Link
          href="/collections"
          className="flex items-center gap-1 text-[13px] font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          Manage lists
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="space-y-2">
        {collections.slice(0, 5).map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.id}`}
            className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <span className="text-[14px] font-medium text-neutral-700 dark:text-neutral-300">
              {collection.title}
            </span>
            <span className="text-[12px] text-neutral-400">
              {collection.recipes?.length ?? 0} recipes
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * Your recipes section.
 * Shows last 3 created recipes.
 */
function YourRecipesSection(): JSX.Element {
  return (
    <section className="rounded-2xl border border-neutral-200/60 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-neutral-400" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">Your recipes</h3>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-[13px] font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <p className="text-[14px] text-neutral-500 dark:text-neutral-400">
        Recipes you create will appear here.
      </p>
    </section>
  );
}

type SidebarRecipeItemProps = {
  recipe: Recipe;
};

/**
 * Compact recipe item for sidebar lists.
 */
function SidebarRecipeItem({ recipe }: SidebarRecipeItemProps): JSX.Element {
  return (
    <Link
      href={`/recipe/${recipe.slug}`}
      className="flex items-center gap-3 rounded-lg transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
        {recipe.heroImage?.url ? (
          <Image
            src={recipe.heroImage.url}
            alt={recipe.heroImage.name}
            fill={true}
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Soup size={16} className="text-neutral-300 dark:text-neutral-600" />
          </div>
        )}
      </div>
      <span className="truncate text-[14px] font-medium text-neutral-700 dark:text-neutral-300">
        {recipe.name}
      </span>
    </Link>
  );
}

/**
 * Skeleton loader for sidebar.
 */
export function SidebarSkeleton(): JSX.Element {
  return (
    <aside className="space-y-6">
      {Array.from({ length: 3 }, (_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-neutral-200/60 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="mb-4 h-5 w-24 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
                <div className="h-4 w-full animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}

