import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { and, eq, inArray, count } from "drizzle-orm";
import { type JSONContent } from "novel";
import {
  RecipesTable,
  TagsTable,
  FavoritesTable,
  RecipesToTagsTable,
  IngredientsTable,
  RecipeIngredientsTable,
  PointsTable,
  AchievementsTable,
  BadgesTable,
} from "./db/schemas";
import { slugify } from "~/lib/utils";

// Helper function for path revalidation to avoid repetition
const revalidateRecipePaths = () => {
  revalidatePath("/", "layout");
  revalidatePath("/recipe/[slug]", "page");
};

// Image queries

export async function getAllImages() {
  const images = await db.query.ImagesTable.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });
  return images;
}

export async function getImage(id: number) {
  const image = await db.query.ImagesTable.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!image) throw new Error("Image not found");

  return image;
}

// Recipe queries

type newRecipe = typeof RecipesTable.$inferInsert;

export async function getRecipeIdFromSlug(slug: string) {
  const recipe = await db.query.RecipesTable.findFirst({
    where: (model, { eq }) => eq(model.slug, slug),
    columns: {
      id: true,
    },
  });

  if (!recipe) throw new Error("Recipe not found");

  return recipe.id;
}

export async function createNewRecipe(recipe: newRecipe) {
  const user = auth();
  if (!user.userId) throw new Error("Not authenticated");

  const slug = slugify(recipe.name);

  // handle slug uniqueness
  const [result] = await db
    .select({ value: count() })
    .from(RecipesTable)
    .where(eq(RecipesTable.slug, slug));

  const finalSlug =
    (result?.value ?? 0) > 0 ? `${slug}-${(result?.value ?? 0) + 1}` : slug;

  const [newRecipe] = await db
    .insert(RecipesTable)
    .values({ ...recipe, slug: finalSlug })
    .returning();

  revalidatePath("/", "layout");
  return newRecipe;
}

// export async function createFullRecipe(recipe: newRecipe, tagIds: number[], ingredients: { ingredientId: number, quantity: string }[]) {
//   const user = auth();

//   if (!user.userId) throw new Error('Not authenticated');

//   await db.transaction(async (tx) => {
//     const [recipeId] = await tx.insert(RecipesTable).values(recipe).returning({ recipeId: RecipesTable.id });
//     if (!recipeId) throw new Error('Failed to create recipe');

//     await tx.insert(RecipesToTagsTable).values(tagIds.map(tagId => ({
//       recipeId: recipeId.recipeId,
//       tagId,
//     })));

//     await tx.insert(RecipeIngredientsTable).values(ingredients.map(({ ingredientId, quantity }) => ({
//       recipeId: recipeId.recipeId,
//       ingredientId,
//       quantity,
//     })));
//   });

//   revalidatePath('/', 'layout');
// }

export async function getAllRecipes() {
  const recipes = await db.query.RecipesTable.findMany({
    where: (model, { eq }) => eq(model.published, true),
    orderBy: (model, { desc }) => desc(model.id),
    with: {
      heroImage: true,
    },
  });
  return recipes;
}

export async function getAllRecipeNames() {
  const recipes = await db.query.RecipesTable.findMany({
    where: (model, { eq }) => eq(model.published, true),
    orderBy: (model, { desc }) => desc(model.name),
    columns: {
      id: true,
      name: true,
      slug: true,
    },
  });
  return recipes;
}

// export async function searchRecipesByName(query: string) {
//   const recipes = await db.query.RecipesTable.findMany({
//     where: (model, { like }) => like(model.name, `%${query}%`),
//     orderBy: (model, { asc }) => asc(model.name),
//     columns: {
//       id: true,
//       name: true,
//     },
//   });
//   return recipes;
// }

export async function getSliderRecipes() {
  const recipes = await db.query.RecipesTable.findMany({
    where: (model, { eq }) => eq(model.published, true),
    orderBy: (model, { desc }) => desc(model.id),
    limit: 6,
    with: {
      heroImage: true,
    },
  });
  return recipes;
}

export async function getRecipe(id: number) {
  const recipe = await db.query.RecipesTable.findFirst({
    where: (model, { eq }) => eq(model.id, id),
    with: {
      heroImage: true,
    },
  });

  if (!recipe) throw new Error("Recipe not found.");

  if (!recipe.published && !auth().userId)
    throw new Error("Recipe is unpublished.");

  return recipe;
}

export async function getRecipeNameAndDescription(id: number) {
  const recipe = await db.query.RecipesTable.findFirst({
    where: (model, { eq }) => eq(model.id, id),
    columns: {
      name: true,
      description: true,
    },
  });

  if (!recipe) throw new Error("Recipe not found");

  return recipe;
}

export async function updateRecipeNameAndDescription(
  id: number,
  name: string,
  description: string,
) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db
    .update(RecipesTable)
    .set({
      name,
      description,
    })
    .where(eq(RecipesTable.id, id));

  revalidatePath("/recipe/[slug]", "page");
  revalidatePath("/", "layout");
}

export async function getStepsByRecipeId(id: number): Promise<JSONContent> {
  const recipe = await db.query.RecipesTable.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!recipe) throw new Error("Recipe not found");

  return recipe.steps as JSONContent;
}

export async function saveStepsForRecipeId(id: number, steps: string) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  const parsedSteps = JSON.parse(steps);
  await db
    .update(RecipesTable)
    .set({
      steps: parsedSteps,
    })
    .where(eq(RecipesTable.id, id));

  revalidatePath("/recipe/[slug]", "page");
}

export async function setPublishRecipe(id: number, published: boolean) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db
    .update(RecipesTable)
    .set({
      published: published,
    })
    .where(eq(RecipesTable.id, id));

  revalidatePath("/recipe/[slug]", "page");
  revalidatePath("/", "layout");
}

export type RecipeWithoutHeroImage = Omit<Recipe, "heroImage">;

export async function getUnpublishedRecipes(): Promise<
  RecipeWithoutHeroImage[]
> {
  const unpublishedRecipes = await db.query.RecipesTable.findMany({
    where: (model, { eq }) => eq(model.published, false),
    orderBy: (model, { desc }) => desc(model.createdAt),
  });

  return unpublishedRecipes;
}

export async function updateRecipeHeroImage(recipeId: number, imageId: number) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db
    .update(RecipesTable)
    .set({
      heroImageId: imageId,
    })
    .where(eq(RecipesTable.id, recipeId));

  return { success: true };
}

// Favorite recipes queries

export async function getMyFavoriteRecipes() {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  const favoriteRecipes = await db.query.FavoritesTable.findMany({
    where: (model, { and, eq }) =>
      and(
        eq(model.userId, user.userId),
        inArray(
          model.recipeId,
          db
            .select({ recipeId: RecipesTable.id })
            .from(RecipesTable)
            .where(eq(RecipesTable.published, true)),
        ),
      ),
    with: {
      favoritedRecipe: {
        with: {
          heroImage: true,
        },
      },
    },
  });
  const recipes = favoriteRecipes.map((favorite) => favorite.favoritedRecipe);
  return recipes;
}

export async function getRecipesByTag(tagId: number) {
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
}

export async function isFavoriteRecipe(recipeId: number) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  const favoriteRecipe = await db.query.FavoritesTable.findFirst({
    where: (model, { and, eq }) =>
      and(eq(model.userId, user.userId), eq(model.recipeId, recipeId)),
  });

  return !!favoriteRecipe;
}

export async function createFavoriteRecipe(recipeId: number) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db.insert(FavoritesTable).values({
    userId: user.userId,
    recipeId,
  });

  revalidatePath("/", "layout");
  revalidatePath("/recipe/[slug]", "page");
}

export async function removeFavoriteRecipe(recipeId: number) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db
    .delete(FavoritesTable)
    .where(
      and(
        eq(FavoritesTable.userId, user.userId),
        eq(FavoritesTable.recipeId, recipeId),
      ),
    );

  revalidatePath("/", "layout");
  revalidatePath("/recipe/[slug]", "page");
}

// Tags queries

export async function getAllTagNames() {
  const tags = await db.query.TagsTable.findMany({
    orderBy: (model, { desc }) => desc(model.name),
    columns: {
      id: true,
      name: true,
    },
  });
  return tags;
}

export async function getAllTagsForRecipe(recipeId: number) {
  const tags = await db.query.RecipesToTagsTable.findMany({
    where: (model, { eq }) => eq(model.recipeId, recipeId),
    with: {
      tag: true,
    },
  });

  return tags.map((tag) => tag.tag);
}

export async function getAllTagsByType() {
  const tags = await db.query.TagsTable.findMany({
    orderBy: (model, { asc }) => [asc(model.tagType), asc(model.name)],
  });

  return tags;
}

type newTag = typeof TagsTable.$inferInsert;

export const createNewTag = async (tag: newTag) => {
  // TODO: Only admins should be able to create tags
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db.insert(TagsTable).values(tag);
};

export async function deleteTag(tagId: number) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db.delete(TagsTable).where(eq(TagsTable.id, tagId));

  revalidatePath("/", "layout");
  revalidatePath("/recipe/[slug]", "page");
  revalidatePath("/dashboard", "page");
}

export async function assignTagsToRecipe(recipeId: number, tagIds: number[]) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db.insert(RecipesToTagsTable).values(
    tagIds.map((tagId) => ({
      recipeId,
      tagId,
    })),
  );

  revalidatePath("/", "layout");
  revalidatePath("/recipe/[slug]", "page");
}

export async function removeAllTagsFromRecipe(recipeId: number) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db
    .delete(RecipesToTagsTable)
    .where(eq(RecipesToTagsTable.recipeId, recipeId));

  revalidatePath("/", "layout");
  revalidatePath("/recipe/[slug]", "page");
}

// Ingredient queries

type newIngredient = typeof IngredientsTable.$inferInsert;

export async function createNewIngredient(ingredient: newIngredient) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  await db.insert(IngredientsTable).values(ingredient);

  revalidatePath("/dashboard", "page");
}

export async function getAllIngredients() {
  const ingredients = await db.query.IngredientsTable.findMany();
  return ingredients;
}

export async function getAllIngredientNames() {
  const ingredients = await db.query.IngredientsTable.findMany({
    columns: {
      name: true,
    },
  });
  return ingredients;
}

export async function getIngredientsForRecipe(recipeId: number) {
  const ingredients = await db.query.RecipeIngredientsTable.findMany({
    where: (model, { eq }) => eq(model.recipeId, recipeId),
    with: {
      ingredient: true,
    },
  });

  return ingredients;
}

export async function createIngredientForRecipe(
  recipeId: number,
  ingredientId: number,
  quantity: string,
) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  try {
    await db.insert(RecipeIngredientsTable).values({
      recipeId,
      ingredientId,
      quantity,
    });

    revalidateRecipePaths();
    return { success: true };
  } catch (error) {
    console.error("Failed to create ingredient for recipe:", error);
    throw new Error("Failed to add ingredient to recipe");
  }
}

export async function removeIngredientFromRecipe(
  recipeId: number,
  ingredientId: number,
) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  try {
    await db
      .delete(RecipeIngredientsTable)
      .where(
        and(
          eq(RecipeIngredientsTable.recipeId, recipeId),
          eq(RecipeIngredientsTable.ingredientId, ingredientId),
        ),
      );

    revalidateRecipePaths();
    return { success: true };
  } catch (error) {
    console.error("Failed to remove ingredient from recipe:", error);
    throw new Error("Failed to remove ingredient from recipe");
  }
}

/**
 * Batch add multiple ingredients to a recipe in a single transaction
 */
export async function batchAddIngredientsToRecipe(
  recipeId: number,
  ingredients: { ingredientId: number; quantity: string }[],
) {
  const user = auth();

  if (!user.userId) throw new Error("Not authenticated");

  if (!ingredients.length) return { success: true, count: 0 };

  try {
    await db.transaction(async (tx) => {
      await tx.insert(RecipeIngredientsTable).values(
        ingredients.map(({ ingredientId, quantity }) => ({
          recipeId,
          ingredientId,
          quantity,
        })),
      );
    });

    revalidateRecipePaths();
    return { success: true, count: ingredients.length };
  } catch (error) {
    console.error("Failed to batch add ingredients:", error);
    throw new Error("Failed to add ingredients to recipe");
  }
}

// Points queries
export async function getUserPoints(userId: string) {
  // First check if user entry exists
  const points = await db.query.PointsTable.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
    columns: { points: true }, // Only select the points column
  });
  return points?.points ?? 0;
}

export async function addUserPoints(userId: string, pointsToAdd: number) {
  const existingEntry = await db.query.PointsTable.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  if (existingEntry) {
    // Update existing entry
    await db
      .update(PointsTable)
      .set({ points: existingEntry.points + pointsToAdd })
      .where(eq(PointsTable.userId, userId));
  } else {
    // Create new entry
    await db.insert(PointsTable).values({
      userId,
      points: pointsToAdd,
    });
  }

  // Consider selective path revalidation if this changes UI
  revalidatePath("/profile", "page");
}

// Achievements queries
export async function getUserAchievements(userId: string) {
  return await db.query.AchievementsTable.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
    orderBy: (model, { desc }) => desc(model.earnedAt),
  });
}

export async function addUserAchievement(
  userId: string,
  title: string,
  description?: string,
) {
  await db.insert(AchievementsTable).values({
    userId,
    title,
    description,
  });

  // Consider selective path revalidation
  revalidatePath("/profile", "page");
}

// Badges queries
export async function getUserBadges(userId: string) {
  return await db.query.BadgesTable.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
    orderBy: (model, { desc }) => desc(model.earnedAt),
  });
}

export async function addUserBadge(userId: string, badgeName: string) {
  // Check if badge already exists to avoid duplicates
  const existingBadge = await db.query.BadgesTable.findFirst({
    where: (model, { and, eq }) =>
      and(eq(model.userId, userId), eq(model.badgeName, badgeName)),
  });

  if (!existingBadge) {
    await db.insert(BadgesTable).values({
      userId,
      badgeName,
    });

    // Consider selective path revalidation
    revalidatePath("/profile", "page");
  }
}

// Add a combined query for profile data to reduce multiple DB calls
export async function getUserGamificationProfile(userId: string) {
  const [points, achievements, badges] = await Promise.all([
    getUserPoints(userId),
    getUserAchievements(userId),
    getUserBadges(userId),
  ]);

  return {
    points,
    achievements,
    badges,
  };
}
