"use client";

import { useState, useCallback } from "react";
import { MessageSquare, Check, Loader2, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface StepCardProps {
  stepNumber: number;
  content: string;
  isActive?: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
  isSignedIn?: boolean;
  note?: string;
  onSaveNote?: (note: string) => Promise<{ success: boolean; error?: string }>;
}

/**
 * Individual step card with step number and content.
 * Designed for scannability with clear visual hierarchy.
 * Supports per-step notes for logged-in users.
 * @param stepNumber - The step number (1-indexed)
 * @param content - The step text content
 * @param isActive - Whether this step is currently active
 * @param isCompleted - Whether this step has been completed
 * @param onClick - Optional click handler
 * @param isSignedIn - Whether the user is signed in
 * @param note - Existing note for this step
 * @param onSaveNote - Callback to save the note
 */
export function StepCard({
  stepNumber,
  content,
  isActive = false,
  isCompleted = false,
  onClick,
  isSignedIn = false,
  note = "",
  onSaveNote,
}: StepCardProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [noteValue, setNoteValue] = useState(note);
  const [savedNote, setSavedNote] = useState(note);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const hasNote = savedNote.trim().length > 0;

  const handleSave = useCallback(async () => {
    if (!onSaveNote) return;

    setSaveState("saving");
    setErrorMessage("");

    const result = await onSaveNote(noteValue);

    if (result.success) {
      setSavedNote(noteValue);
      setSaveState("saved");
      setIsEditing(false);
      setTimeout(() => setSaveState("idle"), 2000);
    } else {
      setSaveState("error");
      setErrorMessage(result.error ?? "Failed to save");
    }
  }, [noteValue, onSaveNote]);

  const handleCancel = useCallback(() => {
    setNoteValue(savedNote);
    setIsEditing(false);
    setSaveState("idle");
    setErrorMessage("");
  }, [savedNote]);

  const handleStartEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  return (
    <div
      className={cn(
        "group relative rounded-lg border p-4 transition-all",
        isActive && "border-primary bg-primary/5 ring-1 ring-primary",
        isCompleted && "border-muted bg-muted/30",
        !isActive && !isCompleted && "border-border hover:border-primary/50",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            isActive && "bg-primary text-primary-foreground",
            isCompleted && "bg-muted-foreground/20 text-muted-foreground",
            !isActive && !isCompleted && "bg-muted text-muted-foreground"
          )}
        >
          {isCompleted ? "✓" : stepNumber}
        </div>
        <div className="flex-1 pt-1">
          <p
            className={cn(
              "text-[15px] leading-relaxed",
              isCompleted && "text-muted-foreground line-through"
            )}
          >
            {content}
          </p>

          {hasNote && !isEditing && (
            <div className="mt-2 rounded bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              <MessageSquare className="mr-1.5 inline-block h-3.5 w-3.5" />
              {savedNote}
            </div>
          )}

          {isSignedIn && !isEditing && (
            <button
              type="button"
              onClick={handleStartEdit}
              className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              {hasNote ? "Edit note" : "Add note"}
            </button>
          )}

          {isSignedIn && isEditing && (
            <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
              <Textarea
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                placeholder="Add your note for this step..."
                className="min-h-[80px] text-sm"
                maxLength={2000}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saveState === "saving"}
                >
                  {saveState === "saving" ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : saveState === "saved" ? (
                    <>
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      Saved
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={saveState === "saving"}
                >
                  <X className="mr-1.5 h-3.5 w-3.5" />
                  Cancel
                </Button>
              </div>
              {saveState === "error" && (
                <p className="text-xs text-destructive">{errorMessage}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

