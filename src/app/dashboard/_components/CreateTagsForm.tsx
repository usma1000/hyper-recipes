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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => onSubmit(e))}
        className="flex flex-col gap-4"
      >
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
        <Button type="submit">Create New Tag</Button>
      </form>
    </Form>
  );
}
