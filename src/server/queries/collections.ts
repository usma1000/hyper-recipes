import "server-only";
import { db } from "../db";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { CollectionsTable, CollectionRecipesTable } from "../db/schemas";
import { revalidateRecipePaths } from "./utils";
import { unstable_cache } from "next/cache";

type NewCollection = typeof CollectionsTable.$inferInsert;

/**
 * Fetches all collections for the current user with their recipes.
 * Uses eager loading with relations and includes hero images for cover image logic.
 */
export async function getMyCollections() {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  const collections = await db.query.CollectionsTable.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.createdAt),
    with: {
      recipes: {
        with: {
          recipe: {
            with: {
              heroImage: true,
            },
          },
        },
      },
    },
  });

  return collections;
}

/**
 * Fetches a single collection by ID for the current user.
 * @param collectionId - The collection ID
 * @returns The collection with recipes
 */
export async function getCollectionById(collectionId: number) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  const collection = await db.query.CollectionsTable.findFirst({
    where: (model, { and, eq }) =>
      and(eq(model.id, collectionId), eq(model.userId, user.userId)),
    with: {
      recipes: {
        with: {
          recipe: {
            with: {
              heroImage: true,
            },
          },
        },
      },
    },
  });

  return collection;
}

/**
 * Creates a new collection for the current user.
 * @param data - Collection data (title required, description optional)
 * @returns The created collection
 */
export async function createCollection(
  data: Pick<NewCollection, "title" | "description">,
) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  const [newCollection] = await db
    .insert(CollectionsTable)
    .values({
      userId: user.userId,
      title: data.title,
      description: data.description ?? null,
    })
    .returning();

  revalidateRecipePaths();

  return newCollection;
}

/**
 * Adds a recipe to a collection.
 * @param collectionId - The collection ID
 * @param recipeId - The recipe ID to add
 */
export async function addRecipeToCollection(
  collectionId: number,
  recipeId: number,
): Promise<void> {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  // Verify collection belongs to user
  const collection = await db.query.CollectionsTable.findFirst({
    where: (model, { and, eq }) =>
      and(eq(model.id, collectionId), eq(model.userId, user.userId)),
  });

  if (!collection) {
    throw new Error("Collection not found or access denied");
  }

  // Check if recipe already in collection
  const existing = await db.query.CollectionRecipesTable.findFirst({
    where: (model, { and, eq }) =>
      and(eq(model.collectionId, collectionId), eq(model.recipeId, recipeId)),
  });

  if (existing) {
    return; // Already in collection, no-op
  }

  await db.insert(CollectionRecipesTable).values({
    collectionId,
    recipeId,
  });

  revalidateRecipePaths();
}

/**
 * Removes a recipe from a collection.
 * @param collectionId - The collection ID
 * @param recipeId - The recipe ID to remove
 */
export async function removeRecipeFromCollection(
  collectionId: number,
  recipeId: number,
): Promise<void> {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  // Verify collection belongs to user
  const collection = await db.query.CollectionsTable.findFirst({
    where: (model, { and, eq }) =>
      and(eq(model.id, collectionId), eq(model.userId, user.userId)),
  });

  if (!collection) {
    throw new Error("Collection not found or access denied");
  }

  await db
    .delete(CollectionRecipesTable)
    .where(
      and(
        eq(CollectionRecipesTable.collectionId, collectionId),
        eq(CollectionRecipesTable.recipeId, recipeId),
      ),
    );

  revalidateRecipePaths();
}

/**
 * Deletes a collection and all its recipe associations.
 * @param collectionId - The collection ID to delete
 */
export async function deleteCollection(collectionId: number): Promise<void> {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  // Verify collection belongs to user
  const collection = await db.query.CollectionsTable.findFirst({
    where: (model, { and, eq }) =>
      and(eq(model.id, collectionId), eq(model.userId, user.userId)),
  });

  if (!collection) {
    throw new Error("Collection not found or access denied");
  }

  // Delete all recipe associations first
  await db
    .delete(CollectionRecipesTable)
    .where(eq(CollectionRecipesTable.collectionId, collectionId));

  // Delete the collection
  await db
    .delete(CollectionsTable)
    .where(eq(CollectionsTable.id, collectionId));

  revalidateRecipePaths();
}
