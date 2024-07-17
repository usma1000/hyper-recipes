"use server";

import { z } from "zod";
import { createNewTag, getAllTagNames } from "~/server/queries";
import { CreateTagsFormSchema } from "./CreateTagsForm";

export async function onSubmit(values: z.infer<typeof CreateTagsFormSchema>) {
  const tagNames = await getAllTagNames();
  const tagExists = tagNames.find((tag) => tag.name === values.name);

  if (tagExists) {
    throw new Error("Tag already exists");
  }

  await createNewTag(values);

  return { success: true };
}
