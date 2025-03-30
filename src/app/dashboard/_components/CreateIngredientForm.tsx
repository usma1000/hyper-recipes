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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { onNewIngredientSubmit } from "./actions";
import { Textarea } from "@/components/ui/textarea";

export const CreateIngredientFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(256, "Name must be less than 256 characters"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(1024, "Description must be less than 1024 characters"),
});

export default function CreateIngredientForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof CreateIngredientFormSchema>>({
    resolver: zodResolver(CreateIngredientFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleSubmit = async (
    values: z.infer<typeof CreateIngredientFormSchema>,
  ) => {
    try {
      setIsSubmitting(true);
      await onNewIngredientSubmit(values);
      toast.success(`${values.name} successfully created.`);
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create ingredient",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredient Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Onions, garlic, olive oil"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Enter a clear, specific ingredient name
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
              <FormLabel>Ingredient Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. A pungent vegetable used as a base in many cuisines"
                  className="resize-none"
                  {...field}
                  disabled={isSubmitting}
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Add helpful information about this ingredient
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
          {isSubmitting ? "Creating..." : "Create Ingredient"}
        </Button>
      </form>
    </Form>
  );
}
