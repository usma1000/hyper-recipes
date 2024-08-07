"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { CircleX } from "lucide-react";
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
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { onNewRecipeSubmit } from "./actions";
// import { MultiSelect } from "@/components/ui/multi-select";

export const CreateRecipeFormSchema = z.object({
  name: string().min(3).max(256),
  description: string().min(3).max(1024),
  heroImageId: z.number().nullable(),
  steps: z.unknown().nullable(),
});

// export const AssignTagsFormSchema = z.array(z.number());

// export const AssignIngredientsFormSchema = z
//   .array(
//     z.object({
//       ingredientId: z.number(),
//       quantity: z.string(),
//     }),
//   )
//   .min(1);

// export const NewRecipeFormSchema = z.object({
//   recipe: CreateRecipeFormSchema,
//   tags: AssignTagsFormSchema,
//   ingredients: AssignIngredientsFormSchema,
// });

// type CreateRecipeFormProps = {
//   allTags: { value: string; label: string }[];
// };

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

  useEffect(() => {
    if (isSubmitSuccessful) {
      toast(`${form.getValues("name")} successfully created.`);
      form.reset();
      // TODO: redirect to new recipe page
    }
  }, [isSubmitSuccessful]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => onNewRecipeSubmit(e))}
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
        <Card>
          <CardHeader>
            <CardTitle>Recipe Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Miso Ramen, French Omlette, etc."
                      {...field}
                    />
                  </FormControl>
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
                    <Textarea
                      placeholder="A brief description of the recipe."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <div>
              <FormDescription>Image upload doesn't work yet.</FormDescription>
              <Label htmlFor="image">Image</Label>
              <Input id="picture" type="file" />
            </div> */}
            {/* <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={() => {
          router.refresh();
        }}
      /> */}
            {/* <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={allTags}
                      onValueChange={field.onChange}
                      defaultValue={field.value.map((tag) => tag.toString())}
                      placeholder="Select tags"
                    />
                  </FormControl>
                  <FormDescription>
                    Select which tag(s) to apply to this recipe.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />  */}
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="m-0 list-none">
              <li className="flex items-center gap-2">
                <button>
                  <CircleX size={16} className="hover:fill-red-400" />
                </button>
                <span className="inline-block rounded-sm bg-secondary px-4 py-1">
                  1 cup flour
                </span>
              </li>
              <li className="flex items-center gap-2">
                <button>
                  <CircleX size={16} className="hover:fill-red-400" />
                </button>
                <span className="inline-block rounded-sm bg-secondary px-4 py-1">
                  2 tbsp sugar
                </span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="items-end space-x-4 border-t p-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" placeholder="1 cup, 2 tbsp, etc." />
            </div>

            <div>
              <Label htmlFor="ingredient">Ingredient</Label>
              <Input id="ingredient" placeholder="Flour, Sugar, etc." />
            </div>

            <Button>Add Ingredient</Button>
          </CardFooter>
        </Card> */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Preheat oven to 350 degrees</p>
            <p>Combine flour and sugar in a bowl</p>
          </CardContent>
        </Card> */}
        <Button type="submit" className="self-start">
          Create Recipe
        </Button>
      </form>
    </Form>
  );
}
