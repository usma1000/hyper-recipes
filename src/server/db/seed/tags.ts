import { db } from "../index";
import { TagsTable } from "../schemas/tags";

/**
 * Seed data for tags.
 * Includes common cuisine types, meal types, and dietary preferences.
 */
const tagSeedData = [
  // Cuisine Types
  { tagType: "Cuisine" as const, name: "Italian" },
  { tagType: "Cuisine" as const, name: "Mexican" },
  { tagType: "Cuisine" as const, name: "Chinese" },
  { tagType: "Cuisine" as const, name: "Japanese" },
  { tagType: "Cuisine" as const, name: "Indian" },
  { tagType: "Cuisine" as const, name: "Thai" },
  { tagType: "Cuisine" as const, name: "French" },
  { tagType: "Cuisine" as const, name: "Mediterranean" },
  { tagType: "Cuisine" as const, name: "American" },
  { tagType: "Cuisine" as const, name: "Korean" },
  { tagType: "Cuisine" as const, name: "Vietnamese" },
  { tagType: "Cuisine" as const, name: "Greek" },
  { tagType: "Cuisine" as const, name: "Spanish" },
  { tagType: "Cuisine" as const, name: "Middle Eastern" },
  { tagType: "Cuisine" as const, name: "Caribbean" },

  // Meal Types
  { tagType: "Meal" as const, name: "Breakfast" },
  { tagType: "Meal" as const, name: "Brunch" },
  { tagType: "Meal" as const, name: "Lunch" },
  { tagType: "Meal" as const, name: "Dinner" },
  { tagType: "Meal" as const, name: "Snack" },
  { tagType: "Meal" as const, name: "Dessert" },
  { tagType: "Meal" as const, name: "Appetizer" },
  { tagType: "Meal" as const, name: "Side Dish" },

  // Dietary Preferences
  { tagType: "Diet" as const, name: "Vegetarian" },
  { tagType: "Diet" as const, name: "Vegan" },
  { tagType: "Diet" as const, name: "Gluten-Free" },
  { tagType: "Diet" as const, name: "Dairy-Free" },
  { tagType: "Diet" as const, name: "Keto" },
  { tagType: "Diet" as const, name: "Paleo" },
  { tagType: "Diet" as const, name: "Low-Carb" },
  { tagType: "Diet" as const, name: "Low-Fat" },
  { tagType: "Diet" as const, name: "Nut-Free" },
  { tagType: "Diet" as const, name: "Halal" },
  { tagType: "Diet" as const, name: "Kosher" },
  { tagType: "Diet" as const, name: "Pescatarian" },
];

/**
 * Seeds the tags table with initial data.
 * Skips tags that already exist (based on name and tagType combination).
 *
 * @returns Promise resolving to the number of tags inserted
 */
export async function seedTags(): Promise<number> {
  const existingTags = await db.select().from(TagsTable);
  const existingTagMap = new Set(
    existingTags.map((tag) => `${tag.tagType}:${tag.name}`),
  );

  const tagsToInsert = tagSeedData.filter(
    (tag) => !existingTagMap.has(`${tag.tagType}:${tag.name}`),
  );

  if (tagsToInsert.length === 0) {
    console.log("No new tags to insert. All tags already exist.");
    return 0;
  }

  const result = await db.insert(TagsTable).values(tagsToInsert).returning();
  console.log(`Inserted ${result.length} tags.`);
  return result.length;
}
