"use server";

import { z } from "zod";
import { createNewTag, deleteTag, getAllTagNames } from "~/server/queries";
import { CreateTagsFormSchema } from "./CreateTagsForm";

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
