"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { onPublishRecipe } from "../../_components/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PublishControls({ recipe }: { recipe: any }) {
  const [isPublished, setIsPublished] = useState(recipe.published);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePublishToggle = async () => {
    try {
      setIsLoading(true);
      await onPublishRecipe(recipe.id, !isPublished);
      setIsPublished(!isPublished);
      toast.success(
        isPublished ? "Recipe unpublished" : "Recipe published successfully",
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to update recipe status");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="publish">Published Status</Label>
          <p className="text-sm text-muted-foreground">
            {isPublished
              ? "Your recipe is publicly visible"
              : "Your recipe is only visible to you"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="publish"
            checked={isPublished}
            onCheckedChange={handlePublishToggle}
            disabled={isLoading}
          />
          <Label htmlFor="publish">{isPublished ? "Published" : "Draft"}</Label>
        </div>
      </div>
      <Button
        variant={isPublished ? "outline" : "default"}
        disabled={isLoading}
        onClick={handlePublishToggle}
        className="w-full"
      >
        {isLoading
          ? "Saving..."
          : isPublished
            ? "Unpublish Recipe"
            : "Publish Recipe"}
      </Button>
    </div>
  );
}
