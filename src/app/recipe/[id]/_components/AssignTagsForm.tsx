"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { onTagSubmit } from "./actions";
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const AssignTagsFormSchema = z.object({
  tags: z.array(z.string()).min(1),
});

type AssignTagsFormProps = {
  allTags: { value: string; label: string }[];
  allAssignedTags: { id: number }[];
  recipeId: number;
};

export default function AssignTagsForm({
  allTags,
  allAssignedTags,
  recipeId,
}: AssignTagsFormProps) {
  const form = useForm<z.infer<typeof AssignTagsFormSchema>>({
    resolver: zodResolver(AssignTagsFormSchema),
    defaultValues: {
      tags: allAssignedTags.map((tag) => tag.id.toString()),
    },
  });

  const {
    formState: { isLoading, isSubmitting, isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) {
      toast("Tags successfully created.");
      form.reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => onTagSubmit(recipeId, e))}
        className="relative flex flex-col gap-4"
      >
        {isLoading ||
          (isSubmitting && (
            <div className="absolute left-0 top-0 z-10 h-full w-full bg-white bg-opacity-50">
              <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                <LoadingSpinner />
              </div>
            </div>
          ))}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultiSelect
                  options={allTags}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Select tags"
                />
              </FormControl>
              <FormDescription>
                Select which tag(s) to apply to this recipe.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || isSubmitting}>
          Apply
        </Button>
      </form>
    </Form>
  );
}
