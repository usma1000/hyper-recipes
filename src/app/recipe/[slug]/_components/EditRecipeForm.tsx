"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { onUpdateRecipeNameAndDescription } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
import { LoadingSpinner } from "~/components/ui/loading-spinner";

const EditRecipeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

interface EditRecipeFormProps {
  recipeId: number;
  initialName: string;
  initialDescription: string;
}

const EditRecipeForm: React.FC<EditRecipeFormProps> = ({
  recipeId,
  initialName,
  initialDescription,
}) => {
  const form = useForm<z.infer<typeof EditRecipeFormSchema>>({
    resolver: zodResolver(EditRecipeFormSchema),
    defaultValues: {
      name: initialName,
      description: initialDescription,
    },
  });

  const {
    formState: { isLoading, isSubmitting, isSubmitSuccessful },
  } = form;

  const router = useRouter();

  const onSubmit = async (data: { name: string; description: string }) => {
    await onUpdateRecipeNameAndDescription(
      recipeId,
      data.name,
      data.description,
    );
    router.refresh();
    form.reset(data);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      toast("Recipe updated successfully");
    }
  }, [isSubmitSuccessful]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
              <FormLabel>Recipe Name</FormLabel>
              <FormControl>
                <Input id="name" {...field} />
              </FormControl>
              <FormDescription>Enter the recipe name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea id="description" {...field} />
              </FormControl>
              <FormDescription>Enter the recipe description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
};

export default EditRecipeForm;
