"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { onIngredientSubmit } from "./actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AddIngredientFormSchema = z.object({
  ingredient: z.string().min(1),
  amount: z.string().min(1),
});

type PropTypes = {
  recipeId: number;
  allIngredients: {
    value: string;
    label: string;
  }[];
  allAssignedIngredients: {
    id: number;
  }[];
};

export default function IngredientsForm({
  recipeId,
  allIngredients,
  allAssignedIngredients,
}: PropTypes) {
  const form = useForm<z.infer<typeof AddIngredientFormSchema>>({
    resolver: zodResolver(AddIngredientFormSchema),
    defaultValues: {
      ingredient: undefined,
      amount: "",
    },
  });

  const AllUnassignedIngredients = allIngredients.filter(
    (ingredient) =>
      !allAssignedIngredients.some(
        (assignedIngredient) =>
          assignedIngredient.id === Number(ingredient.value),
      ),
  );

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
        onSubmit={form.handleSubmit((e) =>
          onIngredientSubmit(recipeId, Number(e.ingredient), e.amount),
        )}
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
          name="ingredient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Ingredient</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an ingredient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {!AllUnassignedIngredients.length && (
                      <SelectItem disabled value="0">
                        No ingredients available
                      </SelectItem>
                    )}
                    {AllUnassignedIngredients.map((ingredient) => (
                      <SelectItem
                        key={ingredient.value}
                        value={ingredient.value}
                      >
                        {ingredient.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select the ingredient from the list.
              </FormDescription>
              <FormMessage {...field} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="E.g. '2 Tbsp' or 'half'..." {...field} />
              </FormControl>
              <FormDescription>
                Enter the amount of the ingredient.
              </FormDescription>
              <FormMessage {...field} />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || isSubmitting}>
          Add Ingredient
        </Button>
      </form>
    </Form>
  );
}
