import { seedTags } from "./tags";
import { seedIngredients } from "./ingredients";

/**
 * Main seed function that runs all seed operations.
 * Can be extended to include other seed functions as needed.
 *
 * @returns Promise resolving when all seeds are complete
 */
export async function seed(): Promise<void> {
  console.log("Starting database seed...");

  try {
    await seedTags();
    await seedIngredients();
    console.log("Database seed completed successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
