"use server";

import { z } from "zod";
import {
  createNewIngredient,
  createNewTag,
  deleteTag,
  getAllIngredientNames,
  getAllTagNames,
} from "~/server/queries";
import { CreateTagsFormSchema } from "./CreateTagsForm";
import { CreateIngredientFormSchema } from "./CreateIngredientForm";

export async function onNewIngredientSubmit(
  values: z.infer<typeof CreateIngredientFormSchema>,
) {
  const ingredientNames = await getAllIngredientNames();
  const ingredientExists = ingredientNames.find(
    (ingredient) => ingredient.name === values.name,
  );

  if (ingredientExists) {
    throw new Error("Ingredient already exists");
  }

  await createNewIngredient(values);

  return { success: true };
}

export async function onNewTagSubmit(
  values: z.infer<typeof CreateTagsFormSchema>,
) {
  const tagNames = await getAllTagNames();
  const tagExists = tagNames.find((tag) => tag.name === values.name);

  if (tagExists) {
    throw new Error("Tag already exists");
  }

  await createNewTag(values);

  return { success: true };
}

export async function onDeleteTagSubmit(id: number) {
  await deleteTag(id);

  return { success: true };
}
