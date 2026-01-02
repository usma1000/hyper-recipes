"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { createNewCollection } from "../_actions/collections";
import { useState } from "react";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const CreateCollectionFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(256, "Title must be less than 256 characters"),
  description: z
    .string()
    .max(1024, "Description must be less than 1024 characters")
    .optional(),
});

type CreateCollectionFormProps = {
  onSuccess?: (collectionId: number, title: string) => void | Promise<void>;
};

/**
 * Form component for creating a new collection.
 * @param onSuccess - Optional callback when collection is created successfully
 */
export function CreateCollectionForm({
  onSuccess,
}: CreateCollectionFormProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof CreateCollectionFormSchema>>({
    resolver: zodResolver(CreateCollectionFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleSubmit = async (
    values: z.infer<typeof CreateCollectionFormSchema>,
  ) => {
    try {
      setIsSubmitting(true);
      const newCollection = await createNewCollection(
        values.title,
        values.description,
      );
      toast.success(`Collection "${values.title}" created successfully.`);
      form.reset();
      if (onSuccess) {
        await onSuccess(newCollection.id, values.title);
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create collection",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Italian Favorites, Quick Weeknight Meals"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Give your collection a descriptive name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a description for your collection..."
                  {...field}
                  disabled={isSubmitting}
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Optional description to help organize your collections
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? <LoadingSpinner className="mr-2" /> : null}
          {isSubmitting ? "Creating..." : "Create Collection"}
        </Button>
      </form>
    </Form>
  );
}

