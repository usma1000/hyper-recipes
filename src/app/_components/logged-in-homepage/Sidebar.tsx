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
      <section className="rounded-2xl border border-border bg-card p-5 dark:border-border dark:bg-card">
        <div className="mb-4 flex items-center gap-2">
          <Heart className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground dark:text-foreground">Saved</h3>
        </div>
        <p className="text-[14px] text-muted-foreground dark:text-muted-foreground">
          Save recipes to build your shortlist.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 dark:border-border dark:bg-card">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground dark:text-foreground">Saved</h3>
        </div>
        <Link
          href="/favorites"
          className="flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
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
      <section className="rounded-2xl border border-border bg-card p-5 dark:border-border dark:bg-card">
        <div className="mb-4 flex items-center gap-2">
          <FolderPlus className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground dark:text-foreground">Lists</h3>
        </div>
        <p className="mb-3 text-[14px] text-muted-foreground dark:text-muted-foreground">
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
    <section className="rounded-2xl border border-border bg-card p-5 dark:border-border dark:bg-card">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderPlus className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground dark:text-foreground">Lists</h3>
        </div>
        <Link
          href="/collections"
          className="flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
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
            className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-muted dark:hover:bg-muted"
          >
            <span className="text-[14px] font-medium text-foreground/80 dark:text-muted-foreground/40">
              {collection.title}
            </span>
            <span className="text-[12px] text-muted-foreground">
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
    <section className="rounded-2xl border border-border bg-card p-5 dark:border-border dark:bg-card">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground dark:text-foreground">Your recipes</h3>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <p className="text-[14px] text-muted-foreground dark:text-muted-foreground">
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
      className="flex items-center gap-3 rounded-lg transition-colors hover:bg-muted dark:hover:bg-muted"
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted dark:bg-muted">
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
            <Soup size={16} className="text-muted-foreground/40 dark:text-muted-foreground" />
          </div>
        )}
      </div>
      <span className="truncate text-[14px] font-medium text-foreground/80 dark:text-muted-foreground/40">
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
          className="rounded-2xl border border-border bg-card p-5 dark:border-border dark:bg-card"
        >
          <div className="mb-4 h-5 w-24 animate-pulse rounded bg-muted dark:bg-muted" />
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-muted dark:bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted dark:bg-muted" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}

