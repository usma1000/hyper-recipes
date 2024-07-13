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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cuisineTypes, mealTypes, tagTypes } from "~/server/db/schema";

const CreateTagsFormSchema = z.object({
  recipeId: z.coerce.number(),
  tagType: z.enum(tagTypes.enumValues),
  cuisineType: z.optional(z.enum(cuisineTypes.enumValues)),
  mealType: z.optional(z.enum(mealTypes.enumValues)),
});

export default function CreateTagsForm() {
  const form = useForm<z.infer<typeof CreateTagsFormSchema>>({
    resolver: zodResolver(CreateTagsFormSchema),
  });

  function onSubmit(values: z.infer<typeof CreateTagsFormSchema>) {
    // first insert new tag to TagsTable
    // then insert new record to Recipes using returned tagId from previous step
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="recipeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe</FormLabel>
              <FormControl>
                {/* replace with a combobox */}
                <Input placeholder="Search by name..." {...field} />
              </FormControl>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        {form.watch("tagType") === "Cuisine" && (
          <FormField
            control={form.control}
            name="cuisineType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuisine Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {form.watch("tagType") === "Meal" && (
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
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
