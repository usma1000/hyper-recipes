"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { CreateCollectionForm } from "~/app/_components/CreateCollectionForm";

type CreateCollectionDialogWithCallbackProps = {
  onSuccess?: (collectionId: number, title: string) => void | Promise<void>;
  buttonText?: string;
  onOpenChange?: (open: boolean) => void;
  children?: (openDialog: () => void) => React.ReactNode;
};

/**
 * Controlled dialog for creating a collection with custom success callback.
 * Uses a render prop pattern to allow custom trigger elements.
 * @param onSuccess - Callback when collection is created successfully
 * @param buttonText - Optional text for the default trigger button
 * @param onOpenChange - Optional callback when dialog open state changes
 * @param children - Render prop function that receives openDialog function
 */
export function CreateCollectionDialogWithCallback({
  onSuccess,
  buttonText = "Create Collection",
  onOpenChange,
  children,
}: CreateCollectionDialogWithCallbackProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean): void => {
    setOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const openDialog = (): void => {
    setOpen(true);
  };

  const handleSuccess = async (
    collectionId: number,
    title: string,
  ): Promise<void> => {
    setOpen(false);
    if (onSuccess) {
      await onSuccess(collectionId, title);
    }
  };

  return (
    <>
      {children ? (
        children(openDialog)
      ) : (
        <Button variant="outline" size="sm" onClick={openDialog}>
          <Plus className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      )}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>
              Organize your favorite recipes into custom collections.
            </DialogDescription>
          </DialogHeader>
          <CreateCollectionForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}
