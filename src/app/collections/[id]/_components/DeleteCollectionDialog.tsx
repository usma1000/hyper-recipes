"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { deleteCollectionAction } from "~/app/_actions/collections";
import { toast } from "sonner";
import { LoadingSpinner } from "~/components/ui/loading-spinner";

type DeleteCollectionDialogProps = {
  collectionId: number;
  collectionTitle: string;
};

/**
 * Dialog component for deleting a collection with confirmation.
 * @param collectionId - The ID of the collection to delete
 * @param collectionTitle - The title of the collection (for confirmation message)
 */
export function DeleteCollectionDialog({
  collectionId,
  collectionTitle,
}: DeleteCollectionDialogProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = (): void => {
    startTransition(async () => {
      try {
        await deleteCollectionAction(collectionId);
        toast.success(`Collection "${collectionTitle}" deleted successfully.`);
        setOpen(false);
        router.push("/collections");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to delete collection",
        );
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Collection
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Collection</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{collectionTitle}&quot;? This
            action is <strong>irreversible</strong> and will remove all recipes
            from this collection. The recipes themselves will not be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <LoadingSpinner className="mr-2" />
                Deleting...
              </>
            ) : (
              "Delete Collection"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
