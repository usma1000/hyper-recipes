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
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tagTypes } from "~/server/db/schemas";
import { onNewTagSubmit } from "./actions";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { CookingPot, UtensilsCrossed } from "lucide-react";

export const CreateTagsFormSchema = z.object({
  recipeId: z.number(),
  tagType: z.enum(tagTypes.enumValues),
  name: z
    .string()
    .min(2, "Tag name must be at least 2 characters")
    .max(50, "Tag name must be less than 50 characters"),
});

export default function CreateTagsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof CreateTagsFormSchema>>({
    resolver: zodResolver(CreateTagsFormSchema),
    defaultValues: {
      recipeId: 0,
      tagType: "Cuisine",
      name: "",
    },
  });

  const { isSubmitSuccessful } = form.formState;

  const handleSubmit = async (values: z.infer<typeof CreateTagsFormSchema>) => {
    try {
      setIsSubmitting(true);
      await onNewTagSubmit(values);
      toast.success(`${values.name} successfully created.`);
      form.reset({ recipeId: 0, tagType: values.tagType, name: "" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create tag",
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
          name="tagType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue("name", "");
                }}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tag type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tagTypes.enumValues.map((tagType) => (
                    <SelectItem key={tagType} value={tagType}>
                      {tagType === "Cuisine" ? (
                        <div className="flex items-center">
                          <CookingPot className="mr-2 h-4 w-4" />
                          {tagType}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <UtensilsCrossed className="mr-2 h-4 w-4" />
                          {tagType}
                        </div>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose between Cuisine (Italian, Mexican) or Meal (Breakfast,
                Lunch)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag Name</FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    form.watch("tagType") === "Cuisine"
                      ? "e.g. Italian, Mexican"
                      : "e.g. Breakfast, Lunch"
                  }
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Enter a unique, descriptive name for this tag
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
          {isSubmitting ? "Creating..." : "Create Tag"}
        </Button>
      </form>
    </Form>
  );
}
