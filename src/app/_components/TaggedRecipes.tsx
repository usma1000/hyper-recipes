"use client";

import { useState, useMemo, Suspense } from "react";
import RecipesCarousel from "./RecipesCarousel";
import RecipeCardSkeleton from "./RecipeCardSkeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "~/lib/utils";
import {
  Check,
  ChevronsUpDown,
  UtensilsCrossed,
  Globe,
  Leaf,
} from "lucide-react";

type TaggedRecipesProps = {
  tags: {
    id: number;
    name: string;
    tagType: "Cuisine" | "Meal" | "Diet";
  }[];
  recipesByTag: Record<number, Recipe[]>;
};

export default function TaggedRecipes({
  tags,
  recipesByTag,
}: TaggedRecipesProps) {
  const [open, setOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<{
    id: number;
    name: string;
    tagType: string;
  } | null>(null);

  // Filter tags to only include those with recipes
  const tagsWithRecipes = useMemo(() => {
    return tags.filter((tag) => {
      const recipes = recipesByTag[tag.id];
      return recipes && recipes.length > 0;
    });
  }, [tags, recipesByTag]);

  // Group tags by type
  const groupedTags = useMemo(() => {
    const grouped = {
      Cuisine: [] as typeof tagsWithRecipes,
      Meal: [] as typeof tagsWithRecipes,
      Diet: [] as typeof tagsWithRecipes,
    };

    tagsWithRecipes.forEach((tag) => {
      grouped[tag.tagType].push(tag);
    });

    return grouped;
  }, [tagsWithRecipes]);

  // Get icon for tag type
  const getTagTypeIcon = (type: string) => {
    switch (type) {
      case "Cuisine":
        return <Globe className="mr-2 h-4 w-4" />;
      case "Meal":
        return <UtensilsCrossed className="mr-2 h-4 w-4" />;
      case "Diet":
        return <Leaf className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full overflow-hidden border-2 border-amber-50 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/50 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Find Recipes By Category</CardTitle>
            <CardDescription>
              Select a category to see matching recipes
            </CardDescription>
          </div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between md:w-[250px]"
              >
                {selectedTag ? selectedTag.name : "Select category..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 md:w-[250px]">
              <Command>
                <CommandInput placeholder="Search categories..." />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>

                  {/* Only show section if it has tags with recipes */}
                  {groupedTags.Cuisine.length > 0 && (
                    <>
                      <CommandGroup heading="Cuisine">
                        {groupedTags.Cuisine.map((tag) => (
                          <CommandItem
                            key={tag.id}
                            value={`${tag.tagType}-${tag.name}`}
                            onSelect={() => {
                              setSelectedTag(tag);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedTag?.id === tag.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {tag.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandSeparator />
                    </>
                  )}

                  {groupedTags.Meal.length > 0 && (
                    <>
                      <CommandGroup heading="Meal Type">
                        {groupedTags.Meal.map((tag) => (
                          <CommandItem
                            key={tag.id}
                            value={`${tag.tagType}-${tag.name}`}
                            onSelect={() => {
                              setSelectedTag(tag);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedTag?.id === tag.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {tag.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandSeparator />
                    </>
                  )}

                  {groupedTags.Diet.length > 0 && (
                    <CommandGroup heading="Dietary">
                      {groupedTags.Diet.map((tag) => (
                        <CommandItem
                          key={tag.id}
                          value={`${tag.tagType}-${tag.name}`}
                          onSelect={() => {
                            setSelectedTag(tag);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedTag?.id === tag.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {tag.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {selectedTag && (
          <div className="mt-4 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            {getTagTypeIcon(selectedTag.tagType)}
            {selectedTag.tagType}: {selectedTag.name}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {selectedTag ? (
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <RecipesCarousel recipes={recipesByTag[selectedTag.id] || []} />
          </Suspense>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <UtensilsCrossed className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No category selected
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Choose a category from the dropdown to see matching recipes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
