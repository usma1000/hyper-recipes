"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star, StarHalf, Loader2, Trophy, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveCookingSessionAction } from "~/app/_actions/cookingHistory";
import { getRecipeIdBySlug } from "~/app/_actions/recipes";
import { AuthGateModal } from "../_components/AuthGateModal";
import type { CheckInRewardResult } from "~/server/queries/gamification";

/**
 * Renders a star icon for the rating control.
 * @param starNumber - Star position 1-5
 * @param currentRating - Current rating value
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
 * Deep-link fallback page for logging a cook check-in after a timed session.
 */
export default function RateRecipePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { time: string };
}): JSX.Element {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [time, setTime] = useState(searchParams.time || "0");
  const [notes, setNotes] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [rewards, setRewards] = useState<CheckInRewardResult | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setShowAuthGate(true);
    }
  }, [isLoaded, isSignedIn]);

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
      const recipeId = await getRecipeIdBySlug(params.slug);
      const result = await saveCookingSessionAction(
        recipeId,
        rating,
        timeMinutes,
        notes.trim() || undefined,
        isPublic,
      );
      setRewards(result.rewards);
    } catch (err) {
      console.error("Failed to save cooking session:", err);
      setError(
        err instanceof Error ? err.message : "Failed to save. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (rewards) {
    return (
      <div className="container mx-auto max-w-md space-y-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" aria-hidden />
              Cook logged
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm font-medium">+{rewards.pointsAwarded} XP</p>
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
            <Button
              className="w-full"
              onClick={() => router.push(`/recipe/${params.slug}`)}
            >
              Back to recipe
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="container mx-auto max-w-md space-y-8 py-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Rate your cook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={(e) => handleStarClick(star, e)}
                    onMouseMove={(e) => handleStarHover(star, e)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 hover:text-accent"
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
              <Label htmlFor="rate-time">Cooking time (minutes)</Label>
              <Input
                id="rate-time"
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                min={1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate-notes">Notes (optional)</Label>
              <Textarea
                id="rate-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What worked well? What would you do differently next time?"
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="rate-public"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked === true)}
              />
              <Label htmlFor="rate-public" className="cursor-pointer font-normal">
                Share with community
              </Label>
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save rating"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>

      <AuthGateModal
        isOpen={showAuthGate}
        onClose={() => {
          setShowAuthGate(false);
          if (!isSignedIn) {
            router.push(`/recipe/${params.slug}`);
          }
        }}
        title="Log your cook"
        description="Sign in to check in, leave a rating, and earn badges."
      />
    </>
  );
}
