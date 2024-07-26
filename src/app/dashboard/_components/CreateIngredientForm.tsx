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
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { onNewIngredientSubmit } from "./actions";
import { Textarea } from "@/components/ui/textarea";

export const CreateIngredientFormSchema = z.object({
  name: z.string().max(256),
  description: z.string().max(1024),
});

export default function CreateIngredientForm() {
  const form = useForm<z.infer<typeof CreateIngredientFormSchema>>({
    resolver: zodResolver(CreateIngredientFormSchema),
    defaultValues: {
      name: "",
      description: "",
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
        onSubmit={form.handleSubmit((e) => onNewIngredientSubmit(e))}
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredient Name</FormLabel>
              <FormControl>
                <Input placeholder="Onions, garlic, etc." />
              </FormControl>
              <FormDescription>
                This is the name of the ingredient you are adding.
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
                <Textarea placeholder="e.g. A white, pungent vegetable." />
              </FormControl>
              <FormDescription>
                This will show up when you hover over the ingredient.
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
