"use client";

import { useFormContext } from "react-hook-form";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "~/utils/uploadthing";

import type { RecipeWizardFormData } from "./types";

type TagOption = {
  id: number;
  name: string;
  tagType: string;
};

interface WizardBasicsProps {
  availableTags: TagOption[];
}

/**
 * Wizard step for basic recipe information.
 * Includes: Title, Description, Tags, Visibility, Hero image.
 * @param availableTags - Available tags for categorization
 */
export function WizardBasics({ availableTags }: WizardBasicsProps): JSX.Element {
  const { control, watch, setValue } = useFormContext<RecipeWizardFormData>();

  const selectedTags = watch("tags");
  const heroImageUrl = watch("heroImageUrl");

  // Group tags by type
  const tagsByType = availableTags.reduce(
    (acc, tag) => {
      const type = tag.tagType;
      if (!acc[type]) acc[type] = [];
      acc[type].push(tag);
      return acc;
    },
    {} as Record<string, TagOption[]>,
  );

  function handleTagToggle(tagId: number): void {
    const current = selectedTags ?? [];
    if (current.includes(tagId)) {
      setValue(
        "tags",
        current.filter((id) => id !== tagId),
        { shouldDirty: true },
      );
    } else {
      setValue("tags", [...current, tagId], { shouldDirty: true });
    }
  }

  function handleImageRemove(): void {
    setValue("heroImageId", undefined, { shouldDirty: true });
    setValue("heroImageUrl", undefined, { shouldDirty: true });
  }

  return (
    <div className="space-y-6">
      {/* Recipe Name */}
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recipe Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter a descriptive name..." {...field} />
            </FormControl>
            <FormDescription>
              A clear name that describes your dish.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your recipe in a few sentences..."
                rows={3}
                {...field}
              />
            </FormControl>
            <FormDescription>
              What makes this recipe special? Include key flavors or origins.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Hero Image */}
      <FormField
        control={control}
        name="heroImageId"
        render={() => (
          <FormItem>
            <FormLabel>Hero Image</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {heroImageUrl ? (
                  <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
                    <Image
                      src={heroImageUrl}
                      alt="Recipe hero"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={handleImageRemove}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex aspect-video w-full max-w-md items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center">
                      <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Upload a hero image
                      </p>
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) {
                            setValue("heroImageUrl", res[0].url, {
                              shouldDirty: true,
                            });
                            // Note: heroImageId would need to be set after saving to DB
                          }
                        }}
                        onUploadError={(error) => {
                          console.error("Upload error:", error);
                        }}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription>
              A beautiful photo of the finished dish.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tags */}
      <FormField
        control={control}
        name="tags"
        render={() => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {Object.entries(tagsByType).map(([type, tags]) => (
                  <div key={type}>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      {type}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant={
                            selectedTags?.includes(tag.id)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => handleTagToggle(tag.id)}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
                {Object.keys(tagsByType).length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No tags available
                  </p>
                )}
              </div>
            </FormControl>
            <FormDescription>
              Select tags to help users discover your recipe.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Visibility */}
      <FormField
        control={control}
        name="visibility"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Visibility</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Public recipes are visible to everyone after publishing.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

