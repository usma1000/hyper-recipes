import { db } from "../index";
import { IngredientsTable } from "../schemas/ingredients";

/**
 * Seed data for ingredients.
 * Includes common cooking ingredients with optional descriptions.
 */
const ingredientSeedData = [
  // Vegetables
  { name: "Onion", description: "Yellow or white onion, commonly used as a base flavor" },
  { name: "Garlic", description: "Fresh garlic cloves, essential for savory dishes" },
  { name: "Tomato", description: "Fresh ripe tomatoes" },
  { name: "Bell Pepper", description: "Red, yellow, or green bell peppers" },
  { name: "Carrot", description: "Fresh carrots, often diced or sliced" },
  { name: "Celery", description: "Fresh celery stalks" },
  { name: "Potato", description: "Russet, Yukon Gold, or red potatoes" },
  { name: "Broccoli", description: "Fresh broccoli florets" },
  { name: "Spinach", description: "Fresh or frozen spinach leaves" },
  { name: "Mushroom", description: "Button, cremini, or shiitake mushrooms" },
  { name: "Zucchini", description: "Fresh zucchini squash" },
  { name: "Eggplant", description: "Fresh eggplant" },
  { name: "Corn", description: "Fresh corn kernels or canned corn" },
  { name: "Peas", description: "Fresh or frozen green peas" },
  { name: "Green Beans", description: "Fresh green beans, trimmed" },
  { name: "Cabbage", description: "Green or red cabbage" },
  { name: "Cauliflower", description: "Fresh cauliflower florets" },
  { name: "Lettuce", description: "Romaine, iceberg, or mixed greens" },
  { name: "Cucumber", description: "Fresh cucumber" },
  { name: "Avocado", description: "Ripe Hass avocado" },

  // Herbs and Aromatics
  { name: "Basil", description: "Fresh basil leaves" },
  { name: "Parsley", description: "Fresh flat-leaf or curly parsley" },
  { name: "Cilantro", description: "Fresh cilantro leaves and stems" },
  { name: "Rosemary", description: "Fresh rosemary sprigs" },
  { name: "Thyme", description: "Fresh thyme leaves" },
  { name: "Oregano", description: "Fresh or dried oregano" },
  { name: "Ginger", description: "Fresh ginger root, peeled and minced" },
  { name: "Lemongrass", description: "Fresh lemongrass stalks" },
  { name: "Scallion", description: "Green onions or spring onions" },
  { name: "Chives", description: "Fresh chives, chopped" },

  // Proteins
  { name: "Chicken Breast", description: "Boneless, skinless chicken breast" },
  { name: "Chicken Thigh", description: "Boneless, skinless chicken thighs" },
  { name: "Ground Beef", description: "Ground beef, 80/20 or lean" },
  { name: "Beef Steak", description: "Ribeye, sirloin, or your preferred cut" },
  { name: "Pork Chop", description: "Bone-in or boneless pork chops" },
  { name: "Ground Pork", description: "Ground pork" },
  { name: "Salmon", description: "Fresh salmon fillets" },
  { name: "Tuna", description: "Fresh tuna steaks or canned tuna" },
  { name: "Shrimp", description: "Raw or cooked shrimp, peeled and deveined" },
  { name: "Eggs", description: "Large eggs" },
  { name: "Tofu", description: "Firm or extra-firm tofu" },
  { name: "Tempeh", description: "Fermented soybean cake" },
  { name: "Chickpeas", description: "Canned or cooked chickpeas" },
  { name: "Black Beans", description: "Canned or cooked black beans" },
  { name: "Lentils", description: "Brown, green, or red lentils" },

  // Dairy
  { name: "Butter", description: "Unsalted butter" },
  { name: "Milk", description: "Whole, 2%, or plant-based milk" },
  { name: "Heavy Cream", description: "Heavy whipping cream" },
  { name: "Cheese", description: "Your preferred cheese variety" },
  { name: "Parmesan Cheese", description: "Freshly grated Parmesan cheese" },
  { name: "Mozzarella Cheese", description: "Fresh or shredded mozzarella" },
  { name: "Cheddar Cheese", description: "Sharp or mild cheddar cheese" },
  { name: "Yogurt", description: "Plain Greek or regular yogurt" },
  { name: "Sour Cream", description: "Full-fat or reduced-fat sour cream" },

  // Pantry Staples
  { name: "Olive Oil", description: "Extra virgin olive oil" },
  { name: "Vegetable Oil", description: "Neutral cooking oil" },
  { name: "Sesame Oil", description: "Toasted sesame oil" },
  { name: "Salt", description: "Kosher salt or sea salt" },
  { name: "Black Pepper", description: "Freshly ground black pepper" },
  { name: "Flour", description: "All-purpose flour" },
  { name: "Sugar", description: "Granulated white sugar" },
  { name: "Brown Sugar", description: "Light or dark brown sugar" },
  { name: "Honey", description: "Raw or regular honey" },
  { name: "Soy Sauce", description: "Light or dark soy sauce" },
  { name: "Rice Vinegar", description: "Unseasoned rice vinegar" },
  { name: "Balsamic Vinegar", description: "Aged balsamic vinegar" },
  { name: "Worcestershire Sauce", description: "Worcestershire sauce" },
  { name: "Tomato Paste", description: "Concentrated tomato paste" },
  { name: "Crushed Tomatoes", description: "Canned crushed tomatoes" },
  { name: "Chicken Broth", description: "Low-sodium chicken broth" },
  { name: "Vegetable Broth", description: "Low-sodium vegetable broth" },
  { name: "Beef Broth", description: "Low-sodium beef broth" },

  // Grains and Starches
  { name: "Rice", description: "Long-grain white rice or jasmine rice" },
  { name: "Brown Rice", description: "Long-grain brown rice" },
  { name: "Pasta", description: "Your preferred pasta shape" },
  { name: "Bread", description: "Sliced bread or artisan loaf" },
  { name: "Quinoa", description: "Rinsed quinoa" },
  { name: "Oats", description: "Rolled oats or quick oats" },
  { name: "Breadcrumbs", description: "Panko or regular breadcrumbs" },

  // Spices and Seasonings
  { name: "Paprika", description: "Sweet or smoked paprika" },
  { name: "Cumin", description: "Ground cumin seeds" },
  { name: "Coriander", description: "Ground coriander seeds" },
  { name: "Turmeric", description: "Ground turmeric" },
  { name: "Cinnamon", description: "Ground cinnamon" },
  { name: "Nutmeg", description: "Freshly grated or ground nutmeg" },
  { name: "Chili Powder", description: "Ancho or chipotle chili powder" },
  { name: "Cayenne Pepper", description: "Ground cayenne pepper" },
  { name: "Red Pepper Flakes", description: "Crushed red pepper flakes" },
  { name: "Bay Leaves", description: "Dried bay leaves" },
  { name: "Curry Powder", description: "Your preferred curry powder blend" },

  // Nuts and Seeds
  { name: "Almonds", description: "Raw or toasted almonds" },
  { name: "Walnuts", description: "Raw or toasted walnuts" },
  { name: "Pine Nuts", description: "Toasted pine nuts" },
  { name: "Sesame Seeds", description: "White or black sesame seeds" },
  { name: "Peanuts", description: "Raw or roasted peanuts" },

  // Fruits
  { name: "Lemon", description: "Fresh lemons for juice and zest" },
  { name: "Lime", description: "Fresh limes for juice and zest" },
  { name: "Orange", description: "Fresh oranges" },
  { name: "Apple", description: "Your preferred apple variety" },
  { name: "Banana", description: "Ripe bananas" },
  { name: "Berries", description: "Fresh or frozen berries" },

  // Other
  { name: "Coconut Milk", description: "Full-fat or light coconut milk" },
  { name: "Fish Sauce", description: "Thai or Vietnamese fish sauce" },
  { name: "Miso Paste", description: "White or red miso paste" },
];

/**
 * Seeds the ingredients table with initial data.
 * Skips ingredients that already exist (based on name).
 *
 * @returns Promise resolving to the number of ingredients inserted
 */
export async function seedIngredients(): Promise<number> {
  const existingIngredients = await db.select().from(IngredientsTable);
  const existingIngredientNames = new Set(
    existingIngredients.map((ingredient) => ingredient.name.toLowerCase()),
  );

  const ingredientsToInsert = ingredientSeedData.filter(
    (ingredient) => !existingIngredientNames.has(ingredient.name.toLowerCase()),
  );

  if (ingredientsToInsert.length === 0) {
    console.log("No new ingredients to insert. All ingredients already exist.");
    return 0;
  }

  const result = await db
    .insert(IngredientsTable)
    .values(ingredientsToInsert)
    .returning();
  console.log(`Inserted ${result.length} ingredients.`);
  return result.length;
}

