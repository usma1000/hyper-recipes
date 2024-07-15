"use server";

import { z } from "zod";
import { insertTag } from "~/server/queries";
import { CreateTagsFormSchema } from "./CreateTagsForm";

export async function onSubmit(values: z.infer<typeof CreateTagsFormSchema>) {
  await insertTag(values, values.recipeId);
}
