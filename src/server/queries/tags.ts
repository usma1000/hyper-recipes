import "server-only";
import { db } from "../db";
import { auth } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";
import { eq } from "drizzle-orm";
import { TagsTable, RecipesToTagsTable } from "../db/schemas";
import { revalidateRecipePaths, revalidateTagCache } from "./utils";

/**
 * Fetches all tag names for dropdowns and selects.
 * Cached for 5 minutes, invalidated via "tags" tag.
 */
export const getAllTagNames = unstable_cache(
  async () => {
    const tags = await db.query.TagsTable.findMany({
      orderBy: (model, { desc }) => desc(model.name),
      columns: {
        id: true,
        name: true,
      },
    });
    return tags;
  },
  ["all-tag-names"],
  { revalidate: 300, tags: ["tags"] }
);

/**
 * Fetches published recipes for a specific tag.
 * Cached for 60 seconds, invalidated via "recipes" and "tags" tags.
 * @param tagId - The tag ID to filter by
 */
export const getRecipesByTag = unstable_cache(
  async (tagId: number) => {
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
  },
  ["recipes-by-tag"],
  { revalidate: 60, tags: ["recipes", "tags"] }
);

/**
 * Fetches all tags assigned to a recipe.
 * Cached for 60 seconds, invalidated via "tags" tag.
 * @param recipeId - The recipe ID
 */
export const getAllTagsForRecipe = unstable_cache(
  async (recipeId: number) => {
    const tags = await db.query.RecipesToTagsTable.findMany({
      where: (model, { eq }) => eq(model.recipeId, recipeId),
      with: {
        tag: true,
      },
    });

    return tags.map((tag) => tag.tag);
  },
  ["tags-for-recipe"],
  { revalidate: 60, tags: ["tags"] }
);

/**
 * Fetches all tags grouped by type for category browsing.
 * Cached for 5 minutes, invalidated via "tags" tag.
 */
export const getAllTagsByType = unstable_cache(
  async () => {
    const tags = await db.query.TagsTable.findMany({
      orderBy: (model, { asc }) => [asc(model.tagType), asc(model.name)],
    });

    return tags;
  },
  ["all-tags-by-type"],
  { revalidate: 300, tags: ["tags"] }
);

type newTag = typeof TagsTable.$inferInsert;

export const createNewTag = async (tag: newTag): Promise<void> => {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db.insert(TagsTable).values(tag);

  revalidateTagCache();
};

export async function deleteTag(tagId: number): Promise<void> {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db.delete(TagsTable).where(eq(TagsTable.id, tagId));

  revalidateTagCache();
}

export async function assignTagsToRecipe(recipeId: number, tagIds: number[]): Promise<void> {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db.insert(RecipesToTagsTable).values(
    tagIds.map((tagId) => ({
      recipeId,
      tagId,
    })),
  );

  revalidateRecipePaths();
  revalidateTagCache();
}

export async function removeAllTagsFromRecipe(recipeId: number): Promise<void> {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db
    .delete(RecipesToTagsTable)
    .where(eq(RecipesToTagsTable.recipeId, recipeId));

  revalidateRecipePaths();
  revalidateTagCache();
}
