"use client";

import { useEffect, useState, useTransition } from "react";
import { FolderPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  fetchMyCollections,
  addRecipeToCollectionAction,
} from "~/app/_actions/collections";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { CreateCollectionForm } from "~/app/_components/CreateCollectionForm";

interface AddToCollectionButtonProps {
  recipeId: number;
}

/**
 * Client-side button for adding recipes to collections.
 * Shows a popover with user's collections and allows adding the recipe.
 */
export function AddToCollectionButton({
  recipeId,
}: AddToCollectionButtonProps): JSX.Element | null {
  const { isSignedIn, isLoaded } = useUser();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setIsLoading(false);
      return;
    }

    fetchMyCollections()
      .then((result) => {
        setCollections(result);
      })
      .catch((error) => {
        console.error("Failed to fetch collections:", error);
        toast.error("Failed to load collections");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isSignedIn, isLoaded]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const handleAddToCollection = (collectionId: number): void => {
    startTransition(async () => {
      try {
        await addRecipeToCollectionAction(collectionId, recipeId);
        toast.success("Recipe added to collection");
        setOpen(false);
        // Refresh collections to update the UI
        const updated = await fetchMyCollections();
        setCollections(updated);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to add recipe to collection",
        );
      }
    });
  };

  const handleCreateAndAdd = async (
    collectionId: number,
    title: string,
  ): Promise<void> => {
    startTransition(async () => {
      try {
        // Add the recipe to the newly created collection
        await addRecipeToCollectionAction(collectionId, recipeId);
        
        toast.success(
          `Collection "${title}" created and recipe added successfully.`,
        );
        
        // Refresh collections to update the UI
        const updated = await fetchMyCollections();
        setCollections(updated);
        setOpen(false);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to add recipe to collection",
        );
      }
    });
  };

  const isRecipeInCollection = (collection: Collection): boolean => {
    return collection.recipes.some(
      (collectionRecipe) => collectionRecipe.recipe.id === recipeId,
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending || isLoading}
        >
          <FolderPlus
            className={`h-5 w-5 transition-all active:-translate-y-1 ${
              isLoading ? "opacity-50" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={
          !isLoading && collections.length === 0 ? "w-96" : "w-80"
        }
        align="end"
      >
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Add to Collection</h4>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner />
            </div>
          ) : collections.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No collections yet. Create one to add this recipe.
              </p>
              <CreateCollectionForm
                onSuccess={async (collectionId: number, title: string) => {
                  await handleCreateAndAdd(collectionId, title);
                }}
              />
            </div>
          ) : (
            <div className="max-h-64 space-y-1 overflow-y-auto">
              {collections.map((collection) => {
                const isInCollection = isRecipeInCollection(collection);
                return (
                  <button
                    key={collection.id}
                    type="button"
                    onClick={() => {
                      if (!isInCollection) {
                        handleAddToCollection(collection.id);
                      }
                    }}
                    disabled={isPending || isInCollection}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-neutral-800"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{collection.title}</div>
                      {collection.description && (
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {collection.description}
                        </div>
                      )}
                    </div>
                    {isInCollection && (
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

