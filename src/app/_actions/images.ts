"use server";

import { db } from "~/server/db";
import { ImagesTable } from "~/server/db/schemas";

export async function fetchAllImages() {
  const images = await db.query.ImagesTable.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });
  return images;
}

export async function fetchImage(id: number) {
  const image = await db.query.ImagesTable.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!image) throw new Error("Image not found");

  return image;
}
