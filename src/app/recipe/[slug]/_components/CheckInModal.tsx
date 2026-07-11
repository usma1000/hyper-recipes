"use client";

import { useState } from "react";
import { Star, StarHalf, Loader2, Trophy, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { saveCookingSessionAction } from "~/app/_actions/cookingHistory";
import { AuthGateModal } from "./AuthGateModal";
import type { CheckInRewardResult } from "~/server/queries/gamification";

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId: number;
  recipeSlug: string;
  initialTimeMinutes?: number;
  onSuccess?: () => void;
}

/**
 * Renders a star (full, half, or empty) for the given rating value.
 * @param starNumber - Star position 1-5
 * @param currentRating - Current rating value
 * @returns Star icon element
 */
function renderStar(starNumber: number, currentRating: number): JSX.Element {
  if (starNumber <= Math.floor(currentRating)) {
    return <Star className="h-8 w-8 fill-accent text-accent" />;
  }
  if (starNumber - 0.5 === currentRating) {
    return <StarHalf className="h-8 w-8 fill-accent text-accent" />;
  }
  return <Star className="h-8 w-8 text-muted" />;
}

/**
 * Modal for logging a cook check-in: rating, time, notes, and share toggle.
 * Requires authentication; shows auth gate when signed out.
 */
export function CheckInModal({
  isOpen,
  onClose,
  recipeId,
  initialTimeMinutes = 0,
  onSuccess,
}: CheckInModalProps): JSX.Element {
  const { isSignedIn, isLoaded } = useUser();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [time, setTime] = useState(
    initialTimeMinutes > 0 ? String(initialTimeMinutes) : "",
  );
  const [notes, setNotes] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [rewards, setRewards] = useState<CheckInRewardResult | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);

  const resetForm = (): void => {
    setRating(0);
    setHoveredRating(0);
    setTime(initialTimeMinutes > 0 ? String(initialTimeMinutes) : "");
    setNotes("");
    setIsPublic(true);
    setError("");
    setRewards(null);
    setIsSaving(false);
  };

  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  const handleStarClick = (star: number, event: React.MouseEvent): void => {
    const button = event.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const clickX = event.clientX - rect.left;
    setRating(clickX < halfWidth ? star - 0.5 : star);
  };

  const handleStarHover = (star: number, event: React.MouseEvent): void => {
    const button = event.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const hoverX = event.clientX - rect.left;
    setHoveredRating(hoverX < halfWidth ? star - 0.5 : star);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!isLoaded) return;

    if (!isSignedIn) {
      setShowAuthGate(true);
      return;
    }

    if (rating === 0) {
      setError("Please provide a rating");
      return;
    }

    const timeMinutes = parseInt(time, 10);
    if (isNaN(timeMinutes) || timeMinutes < 1) {
      setError("Please provide a valid cooking time");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const result = await saveCookingSessionAction(
        recipeId,
        rating,
        timeMinutes,
        notes.trim() || undefined,
        isPublic,
      );
      setRewards(result.rewards);
      onSuccess?.();
    } catch (err) {
      console.error("Failed to save check-in:", err);
      setError(
        err instanceof Error ? err.message : "Failed to save. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isOpen && isLoaded && !isSignedIn) {
    return (
      <AuthGateModal
        isOpen={isOpen || showAuthGate}
        onClose={() => {
          setShowAuthGate(false);
          onClose();
        }}
        title="Log your cook"
        description="Sign in to check in, leave a rating, and earn badges."
      />
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          {rewards ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" aria-hidden />
                  Cook logged
                </DialogTitle>
                <DialogDescription>
                  Nice work. Your check-in is saved
                  {isPublic ? " and shared with the community" : ""}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <p className="text-sm font-medium text-foreground">
                  +{rewards.pointsAwarded} XP
                </p>
                <p className="text-sm text-muted-foreground">
                  Level {rewards.progress.level} · {rewards.progress.xp}/
                  {rewards.progress.nextLevelXp} XP
                </p>
                {rewards.newBadges.length > 0 && (
                  <ul className="space-y-2">
                    {rewards.newBadges.map((badge) => (
                      <li
                        key={badge}
                        className="flex items-center gap-2 rounded-lg border border-border/70 bg-herb-muted/40 px-3 py-2 text-sm"
                      >
                        <Trophy className="h-4 w-4 text-accent" aria-hidden />
                        <span className="font-medium">{badge}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  className="w-full"
                >
                  Done
                </Button>
              </DialogFooter>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <DialogHeader>
                <DialogTitle>I cooked this</DialogTitle>
                <DialogDescription>
                  Rate your cook, note what you learned, and earn XP.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={(e) => handleStarClick(star, e)}
                      onMouseMove={(e) => handleStarHover(star, e)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 hover:text-accent"
                      aria-label={`Rate ${star} stars`}
                    >
                      {renderStar(star, hoveredRating || rating)}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {rating ? `${rating} stars` : "Click to rate"}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="check-in-time">Cooking time (minutes)</Label>
                <Input
                  id="check-in-time"
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  min={1}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="check-in-notes">Notes (optional)</Label>
                <Textarea
                  id="check-in-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What worked well? What would you do differently?"
                  rows={3}
                  maxLength={2000}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="check-in-public"
                  checked={isPublic}
                  onCheckedChange={(checked) => setIsPublic(checked === true)}
                />
                <Label
                  htmlFor="check-in-public"
                  className="cursor-pointer font-normal"
                >
                  Share with community
                </Label>
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <DialogFooter>
                <Button type="submit" disabled={isSaving} className="w-full">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Log this cook"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AuthGateModal
        isOpen={showAuthGate}
        onClose={() => setShowAuthGate(false)}
        title="Log your cook"
        description="Sign in to check in, leave a rating, and earn badges."
      />
    </>
  );
}
