import "server-only";
import { revalidatePath } from "next/cache";

// Helper function for path revalidation to avoid repetition
export const revalidateRecipePaths = () => {
  revalidatePath("/", "layout");
  revalidatePath("/recipe/[slug]", "page");
};
