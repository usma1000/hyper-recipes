"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, StarHalf } from "lucide-react";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  fetchCookingHistory,
  updateCookingSessionRatingAction,
} from "~/app/_actions/cookingHistory";

type Cook = {
  id: number;
  date: string;
  time: string;
  rating: number;
  hasNotes: boolean;
  notes: string | null;
};

function StarRating({ rating }: { rating: number }): JSX.Element {
  return (
    <div className="flex text-accent">
      {[1, 2, 3, 4, 5].map((value) => {
        const difference = value - rating;
        if (difference <= 0) {
          return <Star key={value} size={16} className="fill-current" />;
        }
        if (difference > 0 && difference < 1) {
          return <StarHalf key={value} size={16} className="fill-current" />;
        }
        return <Star key={value} size={16} className="text-muted" />;
      })}
    </div>
  );
}

interface CookingHistoryProps {
  recipeId: number;
  refreshKey?: number;
  onCheckIn?: () => void;
}

/**
 * Personal cook history for the signed-in user on a recipe.
 * @param recipeId - Recipe ID
 * @param refreshKey - Increment to reload history after a new check-in
 * @param onCheckIn - Opens the check-in modal
 */
export default function CookingHistory({
  recipeId,
  refreshKey = 0,
  onCheckIn,
}: CookingHistoryProps): JSX.Element {
  const [cooks, setCooks] = useState<Cook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCook, setSelectedCook] = useState<Cook | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [editingRating, setEditingRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      setIsLoading(true);
      try {
        const sessions = await fetchCookingHistory(recipeId);
        const transformedCooks: Cook[] = sessions.map((session) => ({
          id: session.id,
          date: new Date(session.cookedAt).toISOString(),
          time: `${session.timeMinutes}m`,
          rating: session.rating,
          hasNotes: !!session.notes,
          notes: session.notes,
        }));
        setCooks(transformedCooks);
      } catch (error) {
        console.error("Failed to fetch cooking history:", error);
        setCooks([]);
      } finally {
        setIsLoading(false);
      }
    }

    void loadHistory();
  }, [recipeId, refreshKey]);

  const handleViewClick = (cook: Cook): void => {
    setSelectedCook(cook);
    setEditingRating(cook.rating);
    setHoveredRating(0);
    setShowViewDialog(true);
  };

  const handleStarClick = (star: number, event: React.MouseEvent): void => {
    const button = event.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const clickX = event.clientX - rect.left;
    setEditingRating(clickX < halfWidth ? star - 0.5 : star);
  };

  const handleStarHover = (star: number, event: React.MouseEvent): void => {
    const button = event.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const hoverX = event.clientX - rect.left;
    setHoveredRating(hoverX < halfWidth ? star - 0.5 : star);
  };

  const renderStar = (
    starNumber: number,
    currentRating: number,
  ): JSX.Element => {
    if (starNumber <= Math.floor(currentRating)) {
      return <Star className="h-8 w-8 fill-accent text-accent" />;
    }
    if (starNumber - 0.5 === currentRating) {
      return <StarHalf className="h-8 w-8 fill-accent text-accent" />;
    }
    return <Star className="h-8 w-8 text-muted" />;
  };

  const handleSaveRating = async (): Promise<void> => {
    if (!selectedCook) return;
    if (editingRating === 0) return;

    setIsSaving(true);
    try {
      await updateCookingSessionRatingAction(selectedCook.id, editingRating);
      setCooks((prevCooks) =>
        prevCooks.map((cook) =>
          cook.id === selectedCook.id
            ? { ...cook, rating: editingRating }
            : cook,
        ),
      );
      setShowViewDialog(false);
    } catch (error) {
      console.error("Failed to update rating:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasPreviousCooks = cooks.length > 0;

  return (
    <div className="rounded-2xl border border-border/70 bg-card/80 p-4 sm:p-5">
      <div className="space-y-1">
        <h3 className="font-display text-base font-semibold tracking-tight">
          Your cooks
        </h3>
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading..."
            : hasPreviousCooks
              ? `Cooked ${cooks.length} ${cooks.length === 1 ? "time" : "times"}`
              : "You have not logged this recipe yet."}
        </p>
      </div>

      {hasPreviousCooks && (
        <Accordion type="single" collapsible className="mt-3">
          <AccordionItem value="cooking-history" className="border-none">
            <AccordionTrigger className="py-2 text-sm">History</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {cooks.map((cook) => (
                  <div
                    key={cook.id}
                    className="flex flex-col space-y-1 border-b border-border/60 pb-2 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(cook.date), "MMM d")}
                      </span>
                      <span className="text-sm">{cook.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <StarRating rating={cook.rating} />
                      <Button
                        variant="link"
                        className="h-6 p-0 text-xs"
                        onClick={() => handleViewClick(cook)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {onCheckIn && (
        <Button onClick={onCheckIn} className="mt-4 w-full" variant="outline">
          I cooked this
        </Button>
      )}

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cooking session</DialogTitle>
            <DialogDescription>
              View and edit your rating for this cook.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
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
                    {renderStar(star, hoveredRating || editingRating)}
                  </button>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {editingRating ? `${editingRating} stars` : "Click to rate"}
              </span>
            </div>

            {selectedCook?.notes && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <p className="whitespace-pre-wrap rounded-md border border-border p-3 text-sm text-foreground/80">
                  {selectedCook.notes}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowViewDialog(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveRating} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save rating"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
