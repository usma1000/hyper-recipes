import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { IngredientsTable } from "../server/db/schemas/ingredients.js";
import * as schema from "../server/db/schemas/index.js";
import * as dotenv from "dotenv";

// Load environment variables from .env files
dotenv.config({ path: [".env.local", ".env"] });

// Check for required environment variables
if (!process.env.POSTGRES_URL) {
  console.error("Error: Database connection string is missing!");
  console.error(
    "Please make sure your .env.local file contains a POSTGRES_URL value.",
  );
  process.exit(1);
}

// Create a database connection
const db = drizzle(sql, { schema });

interface ApiIngredient {
  idIngredient: string;
  strIngredient: string;
  strDescription: string | null;
  strType: string | null;
}

interface ApiResponse {
  meals: ApiIngredient[];
}

async function fetchIngredients(): Promise<ApiIngredient[]> {
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?i=list",
    );
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data.meals;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw error;
  }
}

async function populateIngredientsTable() {
  console.log("Starting ingredients population...");

  try {
    // Verify DB connection
    await sql`SELECT 1`;
    console.log("Database connection successful!");

    // Fetch ingredients from the API
    const ingredients = await fetchIngredients();
    console.log(`Fetched ${ingredients.length} ingredients from API`);

    let insertCount = 0;

    // Process ingredients in smaller batches
    const batchSize = 10;
    for (let i = 0; i < ingredients.length; i += batchSize) {
      const batch = ingredients.slice(i, i + batchSize);
      console.log(
        `Processing batch ${i / batchSize + 1}/${Math.ceil(ingredients.length / batchSize)}`,
      );

      // Insert each ingredient individually using Drizzle ORM
      for (const ingredient of batch) {
        try {
          // Check if ingredient already exists
          const existingIngredient = await db.query.IngredientsTable.findFirst({
            where: (table, { eq }) => eq(table.name, ingredient.strIngredient),
          });

          if (!existingIngredient) {
            // Only insert if it doesn't exist
            await db.insert(IngredientsTable).values({
              name: ingredient.strIngredient,
              description: ingredient.strDescription,
            });
            insertCount++;
          }
        } catch (error) {
          console.error(
            `Error processing ingredient ${ingredient.strIngredient}:`,
            error,
          );
        }
      }
    }

    console.log(`Successfully inserted ${insertCount} new ingredients.`);
  } catch (error) {
    console.error("Error populating ingredients:", error);
  }
}

// Run the population script
populateIngredientsTable()
  .then(() => {
    console.log("Ingredients population complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Ingredients population failed:", err);
    process.exit(1);
  });
