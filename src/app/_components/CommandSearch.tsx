"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { fetchAllRecipeNames } from "~/app/_actions/recipes";
import { Soup } from "lucide-react";

export function CommandSearch() {
  const [open, setOpen] = React.useState(false);
  const [recipes, setRecipes] = React.useState<
    { id: number; name: string; slug: string }[]
  >([]);
  const router = useRouter();

  const handleOpen = async () => {
    setOpen(true);
    const data = await fetchAllRecipeNames();
    setRecipes(data);
  };

  const handleNavigate = (slug: string) => {
    router.push(`/recipe/${slug}`);
    setOpen(false);
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleOpen();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        className="relative inline-flex h-8 w-full max-w-[140px] items-center justify-start whitespace-nowrap rounded-[0.5rem] border border-input bg-muted/50 px-3 py-2 text-sm font-normal text-muted-foreground shadow-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:max-w-xs sm:pr-12 md:w-40 lg:w-64"
        onClick={handleOpen}
      >
        <span className="hidden lg:inline-flex">Search recipes...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search by recipe name..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Recipes">
            {recipes.map((recipe) => (
              <CommandItem
                key={recipe.id}
                onSelect={() => handleNavigate(recipe.slug)}
              >
                <Soup className="mr-2 h-4 w-4" />
                <span>{recipe.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          {/* TODO: add command group and search function for ingredients and tags */}
        </CommandList>
      </CommandDialog>
    </>
  );
}
