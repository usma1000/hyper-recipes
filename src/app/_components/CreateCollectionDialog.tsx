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
  DialogTrigger,
} from "~/components/ui/dialog";
import { CreateCollectionForm } from "./CreateCollectionForm";

type CreateCollectionDialogProps = {
  buttonText?: string;
};

/**
 * Client component wrapper for the create collection dialog.
 * Manages dialog open state and closes it after successful creation.
 * @param buttonText - Optional text for the trigger button (default: "Create Collection")
 */
export function CreateCollectionDialog({
  buttonText = "Create Collection",
}: CreateCollectionDialogProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>
            Organize your favorite recipes into custom collections.
          </DialogDescription>
        </DialogHeader>
        <CreateCollectionForm
          onSuccess={async () => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

