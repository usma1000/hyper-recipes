import "dotenv/config";
import "~/env";
import { seed } from "./index";

/**
 * Standalone script to run database seeding.
 * This file can be executed directly with tsx or ts-node.
 * Imports env to ensure environment variables are validated.
 */
async function main(): Promise<void> {
  try {
    await seed();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

void main();
