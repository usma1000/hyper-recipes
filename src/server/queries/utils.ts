import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Revalidates all recipe-related paths and cache tags.
 * Call this after recipe mutations (create, update, delete, publish).
 */
export const revalidateRecipePaths = (): void => {
  revalidatePath("/", "layout");
  revalidatePath("/recipe/[slug]", "page");
  revalidateTag("recipes");
};

/**
 * Revalidates all tag-related cache entries.
 * Call this after tag mutations (create, update, delete, assign).
 */
export const revalidateTagCache = (): void => {
  revalidatePath("/", "layout");
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
