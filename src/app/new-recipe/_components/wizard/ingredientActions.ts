"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { IngredientsTable } from "~/server/db/schemas";

type CreateIngredientResult = {
  success: boolean;
  ingredient?: { id: number; name: string };
  error?: string;
};

/**
 * Server action to create a new ingredient without triggering revalidation.
 * Used by the CreateIngredientDialog component in the wizard.
 * Does NOT call revalidatePath to prevent page refresh during wizard flow.
 * @param data - Ingredient name and optional description
 * @returns Result with created ingredient or error
 */
export async function createIngredientAction(data: {
  name: string;
  description?: string;
}): Promise<CreateIngredientResult> {
  const user = auth();
  if (!user.userId) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Check if ingredient already exists (case-insensitive)
    const existing = await db.query.IngredientsTable.findFirst({
      where: (model, { ilike }) => ilike(model.name, data.name),
    });

    if (existing) {
      return {
        success: true,
        ingredient: {
          id: existing.id,
          name: existing.name,
        },
      };
    }

    // Create new ingredient WITHOUT calling revalidate
    const [created] = await db
      .insert(IngredientsTable)
      .values({
        name: data.name,
        description: data.description ?? null,
      })
      .returning();

    if (!created) {
      return { success: false, error: "Failed to create ingredient" };
    }

    return {
      success: true,
      ingredient: {
        id: created.id,
        name: created.name,
      },
    };
  } catch (error) {
    console.error("Failed to create ingredient:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create ingredient",
    };
  }
}

