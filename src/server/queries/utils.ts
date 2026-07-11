import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Revalidates all recipe-related paths and cache tags.
 * Prefer page-level revalidation over layout — layout invalidation
 * forces every nested page under "/" to recompute on the next request.
 */
export const revalidateRecipePaths = (): void => {
  revalidatePath("/", "page");
  revalidatePath("/recipe/[slug]", "page");
  revalidateTag("recipes");
};

/**
 * Revalidates all tag-related cache entries.
 * Call this after tag mutations (create, update, delete, assign).
 */
export const revalidateTagCache = (): void => {
  revalidatePath("/", "page");
  revalidatePath("/dashboard", "page");
  revalidateTag("tags");
};

/**
 * Revalidates all ingredient-related cache entries.
 * Call this after ingredient mutations (create, update, delete).
 */
export const revalidateIngredientCache = (): void => {
  revalidatePath("/dashboard", "page");
  revalidateTag("ingredients");
};
