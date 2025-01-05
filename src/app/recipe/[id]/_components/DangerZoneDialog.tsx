import React from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { onPublishRecipe } from "./actions";
import { SelectRecipe } from "~/server/db/schema";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

type Props = {
  recipe: SelectRecipe;
};

export default function DangerZoneDialog({ recipe }: Props) {
  async function unpublishRecipe() {
    "use server";
    await onPublishRecipe(recipe.id, false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="mt-4">
          Danger Zone
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Danger Zone</DialogTitle>
            <DialogDescription>
              This is where you can delete or unpublish this recipe. I hope you
              know what you're doing!
            </DialogDescription>
          </DialogHeader>
          {recipe.published && (
            <Card>
              <CardHeader>
                <CardTitle>Unpublish</CardTitle>
                <CardDescription>
                  Unpublishing this recipe will make it invisible to others.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={unpublishRecipe}>
                  <Button variant="destructive">Unpublish Recipe</Button>
                </form>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Delete</CardTitle>
              <CardDescription>
                This action is <strong>irreversible</strong>! Only do this if
                unpublishing isn't enough.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Delete Recipe</Button>
            </CardContent>
          </Card>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Get me out of here!
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
