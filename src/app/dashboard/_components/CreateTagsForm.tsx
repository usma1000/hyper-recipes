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
import { Combobox } from "./Combobox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cuisineTypes, mealTypes, tagTypes } from "~/server/db/schema";
import { onSubmit } from "./actions";

export const CreateTagsFormSchema = z.object({
  recipeId: z.number(),
  tagType: z.enum(tagTypes.enumValues),
  cuisineType: z.optional(z.enum(cuisineTypes.enumValues)),
  mealType: z.optional(z.enum(mealTypes.enumValues)),
});

type PropTypes = {
  recipeNames: { id: number; name: string }[];
};

export default function CreateTagsForm({ recipeNames }: PropTypes) {
  const form = useForm<z.infer<typeof CreateTagsFormSchema>>({
    resolver: zodResolver(CreateTagsFormSchema),
  });

  // function onSubmit(values: z.infer<typeof CreateTagsFormSchema>) {
  //   console.log(values);
  // }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => onSubmit(e))}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="recipeId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Recipe</FormLabel>
              {recipeNames.length === 0 ? (
                <p>No recipes found</p>
              ) : (
                <Combobox
                  defaultValue={field.value}
                  recipeNames={recipeNames}
                  form={form}
                />
              )}
              <FormDescription>Select a recipe to add tags to.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tagType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue("cuisineType", undefined);
                  form.setValue("mealType", undefined);
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
          name="cuisineType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuisine Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={form.watch("tagType") === "Meal"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a cuisine type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cuisineTypes.enumValues.map((cuisineType) => (
                    <SelectItem key={cuisineType} value={cuisineType}>
                      {cuisineType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select a cuisine type.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mealType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={form.watch("tagType") === "Cuisine"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mealTypes.enumValues.map((mealType) => (
                      <SelectItem key={mealType} value={mealType}>
                        {mealType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Select a meal type.</FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
