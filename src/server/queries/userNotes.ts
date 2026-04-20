import "server-only";
import { db } from "../db";
import { auth } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";
import {
  RecipeStepNotesTable,
  RecipeUserNotesTable,
} from "../db/schemas/recipeUserNotes";

const MAX_NOTE_LENGTH = 2000;

/**
 * Validates that a note is within the allowed length.
 * @param note - The note content to validate
 * @throws Error if note exceeds max length
 */
function validateNoteLength(note: string): void {
  if (note.length > MAX_NOTE_LENGTH) {
    throw new Error(`Note exceeds maximum length of ${MAX_NOTE_LENGTH} characters`);
  }
}

/**
 * Validates that step index is a non-negative integer.
 * @param stepIndex - The step index to validate
 * @throws Error if step index is invalid
 */
function validateStepIndex(stepIndex: number): void {
  if (!Number.isInteger(stepIndex) || stepIndex < 0) {
    throw new Error("Step index must be a non-negative integer");
  }
}

/**
 * Fetches all step notes for a recipe for the current user.
 * @param recipeId - The recipe ID
 * @returns Map of step index to note content
 */
export async function getStepNotesForRecipe(
  recipeId: number
): Promise<Record<number, string>> {
  const { userId } = auth();

  if (!userId) {
    return {};
  }

  const notes = await db.query.RecipeStepNotesTable.findMany({
    where: (model, { and, eq }) =>
      and(eq(model.userId, userId), eq(model.recipeId, recipeId)),
  });

  const noteMap: Record<number, string> = {};
  for (const note of notes) {
    if (note.note) {
      noteMap[note.stepIndex] = note.note;
    }
  }

  return noteMap;
}

/**
 * Upserts a step note for the current user.
 * @param recipeId - The recipe ID
 * @param stepIndex - The step index (0-based)
 * @param note - The note content
 */
export async function upsertStepNote(
  recipeId: number,
  stepIndex: number,
  note: string
): Promise<void> {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  validateStepIndex(stepIndex);
  validateNoteLength(note);

  await db
    .insert(RecipeStepNotesTable)
    .values({
      userId,
      recipeId,
      stepIndex,
      note,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        RecipeStepNotesTable.userId,
        RecipeStepNotesTable.recipeId,
        RecipeStepNotesTable.stepIndex,
      ],
      set: {
        note,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    });
}

/**
 * Fetches the general note for a recipe for the current user.
 * @param recipeId - The recipe ID
 * @returns The note content or empty string if none exists
 */
export async function getGeneralNoteForRecipe(recipeId: number): Promise<string> {
  const { userId } = auth();

  if (!userId) {
    return "";
  }

  const note = await db.query.RecipeUserNotesTable.findFirst({
    where: (model, { and, eq }) =>
      and(eq(model.userId, userId), eq(model.recipeId, recipeId)),
  });

  return note?.note ?? "";
}

/**
 * Upserts the general note for a recipe for the current user.
 * @param recipeId - The recipe ID
 * @param note - The note content
 */
export async function upsertGeneralNote(
  recipeId: number,
  note: string
): Promise<void> {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  validateNoteLength(note);

  await db
    .insert(RecipeUserNotesTable)
    .values({
      userId,
      recipeId,
      note,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [RecipeUserNotesTable.userId, RecipeUserNotesTable.recipeId],
      set: {
        note,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    });
}

