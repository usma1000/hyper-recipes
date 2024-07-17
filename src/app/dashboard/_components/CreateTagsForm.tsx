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
import { tagTypes } from "~/server/db/schema";
import { onSubmit } from "./actions";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

export const CreateTagsFormSchema = z.object({
  recipeId: z.number(),
  tagType: z.enum(tagTypes.enumValues),
  name: z.string(),
});

export default function CreateTagsForm() {
  const form = useForm<z.infer<typeof CreateTagsFormSchema>>({
    resolver: zodResolver(CreateTagsFormSchema),
    defaultValues: {
      recipeId: 0,
      tagType: "Cuisine",
      name: "",
    },
  });

  const {
    formState: { isLoading, isSubmitting, isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) {
      toast(`${form.getValues("name")} successfully created.`);
      form.reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => onSubmit(e))}
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
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tag type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tagTypes.enumValues.map((tagType) => (
                    <SelectItem key={tagType} value={tagType}>
                      {tagType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select a tag type.</FormDescription>
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
                      : form.watch("tagType") === "Meal"
                        ? "e.g. Breakfast, Lunch"
                        : "Enter a Tag Name"
                  }
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter a unique tag name. Cuisine examples: Italian, Mexican.
                Meal examples: Breakfast, Lunch.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || isSubmitting}>
          Create New Tag
        </Button>
      </form>
    </Form>
  );
}
