"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createIngredientAction } from "./ingredientActions";

const createIngredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  description: z.string().optional(),
});

type CreateIngredientFormData = z.infer<typeof createIngredientSchema>;

interface CreateIngredientDialogProps {
  onIngredientCreated: (ingredient: { id: number; name: string }) => void;
  triggerText?: string;
  initialName?: string;
}

/**
 * Dialog for creating a new ingredient inline.
 * Opens when user wants to add an ingredient that doesn't exist.
 * @param onIngredientCreated - Callback when ingredient is created
 * @param triggerText - Optional text for the trigger button
 */
export function CreateIngredientDialog({
  onIngredientCreated,
  triggerText = "Create new ingredient",
  initialName = "",
}: CreateIngredientDialogProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateIngredientFormData>({
    resolver: zodResolver(createIngredientSchema),
    defaultValues: {
      name: initialName,
      description: "",
    },
  });

  // Update form when initialName changes (when dialog opens)
  if (open && initialName && form.getValues("name") !== initialName) {
    form.setValue("name", initialName);
  }

  async function onSubmit(data: CreateIngredientFormData): Promise<void> {
    setIsSubmitting(true);
    try {
      const result = await createIngredientAction(data);
      if (result.success && result.ingredient) {
        toast.success(`Created "${result.ingredient.name}"`);
        onIngredientCreated(result.ingredient);
        form.reset();
        setOpen(false);
      } else {
        toast.error(result.error ?? "Failed to create ingredient");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Create ingredient error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Ingredient</DialogTitle>
          <DialogDescription>
            Add a new ingredient to the database. It will be available for all
            recipes.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredient Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Fresh Basil"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the name of the ingredient
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Fresh basil leaves, preferably large"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description or notes about this ingredient
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  // Validate form first
                  const isValid = await form.trigger();
                  if (!isValid) {
                    return;
                  }
                  
                  // Get form values and submit
                  const formData = form.getValues();
                  await onSubmit(formData);
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Ingredient"}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

