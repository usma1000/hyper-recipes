import "server-only";
import { db } from "../db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { TagsTable, RecipesToTagsTable } from "../db/schemas";
import { revalidateRecipePaths } from "./utils";

export async function getAllTagNames() {
  const tags = await db.query.TagsTable.findMany({
    orderBy: (model, { desc }) => desc(model.name),
    columns: {
      id: true,
      name: true,
    },
  });
  return tags;
}

export async function getRecipesByTag(tagId: number) {
  const recipes = await db.query.RecipesToTagsTable.findMany({
    where: (recipesToTags, { eq }) => eq(recipesToTags.tagId, tagId),
    with: {
      recipe: {
        with: {
          heroImage: true,
        },
      },
    },
  });

  // Filter out any recipes that aren't published
  return recipes
    .map((relation) => relation.recipe)
    .filter(
      (recipe): recipe is NonNullable<typeof recipe> =>
        recipe !== null && recipe.published === true,
    );
}

export async function getAllTagsForRecipe(recipeId: number) {
  const tags = await db.query.RecipesToTagsTable.findMany({
    where: (model, { eq }) => eq(model.recipeId, recipeId),
    with: {
      tag: true,
    },
  });

  return tags.map((tag) => tag.tag);
}

export async function getAllTagsByType() {
  const tags = await db.query.TagsTable.findMany({
    orderBy: (model, { asc }) => [asc(model.tagType), asc(model.name)],
  });

  return tags;
}

type newTag = typeof TagsTable.$inferInsert;

export const createNewTag = async (tag: newTag) => {
  // TODO: Only admins should be able to create tags
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db.insert(TagsTable).values(tag);
};

export async function deleteTag(tagId: number) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db.delete(TagsTable).where(eq(TagsTable.id, tagId));

  revalidatePath("/", "layout");
  revalidatePath("/recipe/[slug]", "page");
  revalidatePath("/dashboard", "page");
}

export async function assignTagsToRecipe(recipeId: number, tagIds: number[]) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db.insert(RecipesToTagsTable).values(
    tagIds.map((tagId) => ({
      recipeId,
      tagId,
    })),
  );

  revalidateRecipePaths();
}

export async function removeAllTagsFromRecipe(recipeId: number) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db
    .delete(RecipesToTagsTable)
    .where(eq(RecipesToTagsTable.recipeId, recipeId));

  revalidateRecipePaths();
}
