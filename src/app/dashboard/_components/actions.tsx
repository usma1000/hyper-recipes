"use server";

import { z } from "zod";
import { createNewTag } from "~/server/queries";
import { CreateTagsFormSchema } from "./CreateTagsForm";

export async function onSubmit(values: z.infer<typeof CreateTagsFormSchema>) {
  await createNewTag(values);
}
