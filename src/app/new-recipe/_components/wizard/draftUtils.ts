/**
 * Client-side draft management utilities.
 * Uses localStorage to persist recipe drafts.
 */

import type { RecipeWizardFormData } from "./types";

const DRAFT_STORAGE_KEY = "recipe-wizard-drafts";

export type DraftMetadata = {
  id: string;
  name: string;
  lastSaved: Date;
  step: number;
};

export type Draft = {
  metadata: DraftMetadata;
  data: RecipeWizardFormData;
};

/**
 * Gets all saved drafts from localStorage.
 * @returns Array of draft metadata
 */
export function getAllDrafts(): DraftMetadata[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!stored) return [];

    const drafts: Record<string, Draft> = JSON.parse(stored);
    return Object.values(drafts).map((draft) => ({
      ...draft.metadata,
      lastSaved: new Date(draft.metadata.lastSaved),
    }));
  } catch (error) {
    console.error("Failed to load drafts:", error);
    return [];
  }
}

/**
 * Saves a draft to localStorage.
 * @param data - The wizard form data
 * @param currentStep - The current step index
 * @returns The draft ID
 */
export function saveDraftToStorage(
  data: RecipeWizardFormData,
  currentStep: number,
): string {
  if (typeof window === "undefined") {
    throw new Error("Cannot save draft: window is undefined");
  }

  const draftId = data.name
    ? `draft-${Date.now()}-${data.name.slice(0, 20).replace(/\s+/g, "-")}`
    : `draft-${Date.now()}`;

  const draft: Draft = {
    metadata: {
      id: draftId,
      name: data.name || "Untitled Recipe",
      lastSaved: new Date(),
      step: currentStep,
    },
    data,
  };

  try {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
    const drafts: Record<string, Draft> = stored ? JSON.parse(stored) : {};

    drafts[draftId] = draft;

    // Keep only the last 10 drafts
    const draftEntries = Object.entries(drafts);
    if (draftEntries.length > 10) {
      const sorted = draftEntries.sort(
        (a, b) =>
          new Date(b[1].metadata.lastSaved).getTime() -
          new Date(a[1].metadata.lastSaved).getTime(),
      );
      const toKeep = sorted.slice(0, 10);
      const cleaned: Record<string, Draft> = {};
      for (const [id, draft] of toKeep) {
        cleaned[id] = draft;
      }
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(cleaned));
    } else {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
    }

    return draftId;
  } catch (error) {
    console.error("Failed to save draft:", error);
    throw new Error("Failed to save draft to storage");
  }
}

/**
 * Loads a draft by ID from localStorage.
 * @param draftId - The draft ID
 * @returns The draft data and metadata, or null if not found
 */
export function loadDraftFromStorage(draftId: string): Draft | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!stored) return null;

    const drafts: Record<string, Draft> = JSON.parse(stored);
    const draft = drafts[draftId];

    if (!draft) return null;

    return {
      ...draft,
      metadata: {
        ...draft.metadata,
        lastSaved: new Date(draft.metadata.lastSaved),
      },
    };
  } catch (error) {
    console.error("Failed to load draft:", error);
    return null;
  }
}

/**
 * Deletes a draft from localStorage.
 * @param draftId - The draft ID
 */
export function deleteDraftFromStorage(draftId: string): void {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!stored) return;

    const drafts: Record<string, Draft> = JSON.parse(stored);
    delete drafts[draftId];

    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error("Failed to delete draft:", error);
  }
}

/**
 * Formats a date for display in the draft list.
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDraftDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

