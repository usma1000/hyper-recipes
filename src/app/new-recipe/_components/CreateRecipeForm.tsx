"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { onNewRecipeSubmit } from "./actions";
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
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const CreateRecipeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  heroImageId: z.number().nullable(),
  steps: z.object({
    type: z.string(),
    content: z.array(
      z.object({
        type: z.string(),
        content: z.array(
          z.object({
            type: z.string(),
            text: z.string(),
          }),
        ),
      }),
    ),
  }),
});

export default function CreateRecipeForm() {
  const form = useForm<z.infer<typeof CreateRecipeFormSchema>>({
    resolver: zodResolver(CreateRecipeFormSchema),
    defaultValues: {
      name: "",
      description: "",
      heroImageId: null,
      steps: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Enter instructions here...",
              },
            ],
          },
        ],
      },
    },
  });

  const {
    formState: { isLoading, isSubmitting, isSubmitSuccessful },
  } = form;

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof CreateRecipeFormSchema>) => {
    const result = await onNewRecipeSubmit(data);
    if (result.success) {
      toast(`${form.getValues("name")} successfully created.`);
      form.reset();
      router.push(`/recipe/${result.id}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipe Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
                  <FormDescription>
                    Enter the recipe description.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
