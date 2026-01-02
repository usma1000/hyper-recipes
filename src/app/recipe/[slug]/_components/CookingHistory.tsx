"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import CookingTimer from "./CookingTimer";
import {
  fetchCookingHistory,
  updateCookingSessionRatingAction,
} from "~/app/_actions/cookingHistory";
import { getRecipeIdBySlug } from "~/app/_actions/recipes";

type Cook = {
  id: number;
  date: string;
  time: string;
  rating: number;
  hasNotes: boolean;
  notes: string | null;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex text-amber-400">
      {[1, 2, 3, 4, 5].map((value) => {
        const difference = value - rating;
        if (difference <= 0) {
          return <Star key={value} size={16} className="fill-current" />;
        } else if (difference > 0 && difference < 1) {
          return <StarHalf key={value} size={16} className="fill-current" />;
        } else {
          return <Star key={value} size={16} className="text-slate-200" />;
        }
      })}
    </div>
  );
}

interface CookingHistoryProps {
  recipeSlug: string;
}

export default function CookingHistory({ recipeSlug }: CookingHistoryProps) {
  const [cooks, setCooks] = useState<Cook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCook, setSelectedCook] = useState<Cook | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [editingRating, setEditingRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      try {
        const recipeId = await getRecipeIdBySlug(recipeSlug);
        const sessions = await fetchCookingHistory(recipeId);

        const transformedCooks: Cook[] = sessions.map((session) => ({
          id: session.id,
          date: session.cookedAt.toISOString(),
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
  }, [recipeSlug]);

  const handleViewClick = (cook: Cook) => {
    setSelectedCook(cook);
    setEditingRating(cook.rating);
    setHoveredRating(0);
    setShowViewDialog(true);
  };

  const handleStarClick = (star: number, event: React.MouseEvent) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const clickX = event.clientX - rect.left;

    const finalRating = clickX < halfWidth ? star - 0.5 : star;
    setEditingRating(finalRating);
  };

  const handleStarHover = (star: number, event: React.MouseEvent) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const hoverX = event.clientX - rect.left;

    const finalRating = hoverX < halfWidth ? star - 0.5 : star;
    setHoveredRating(finalRating);
  };

  const renderStar = (starNumber: number, currentRating: number) => {
    if (starNumber <= Math.floor(currentRating)) {
      return <Star className="h-8 w-8 fill-amber-400 text-amber-400" />;
    } else if (starNumber - 0.5 === currentRating) {
      return <StarHalf className="h-8 w-8 fill-amber-400 text-amber-400" />;
    } else {
      return <Star className="h-8 w-8 text-slate-200" />;
    }
  };

  const handleSaveRating = async () => {
    if (!selectedCook) return;

    if (editingRating === 0) {
      alert("Please provide a rating");
      return;
    }

    setIsSaving(true);
    try {
      await updateCookingSessionRatingAction(selectedCook.id, editingRating);

      // Update local state
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
      alert("Failed to update rating. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasPreviousCooks = cooks.length > 0;

  return (
    <Card>
      <CardHeader className="space-y-1.5">
        <CardTitle>Cook Tracker</CardTitle>
        <CardDescription>
          {isLoading
            ? "Loading..."
            : hasPreviousCooks
              ? `Cooked ${cooks.length} ${cooks.length === 1 ? "time" : "times"}`
              : "Ready to cook?"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasPreviousCooks && (
          <Accordion type="single" collapsible className="mb-4">
            <AccordionItem value="cooking-history" className="border-none">
              <AccordionTrigger className="py-2">History</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {cooks.map((cook, i) => (
                    <div
                      key={i}
                      className="flex flex-col space-y-1 border-b border-slate-100 pb-2 last:border-0"
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
        <CookingTimer recipeSlug={recipeSlug} />
      </CardContent>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cooking Session Details</DialogTitle>
            <DialogDescription>
              View and edit your cooking session
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Rating Section */}
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
                    className="p-1 hover:text-amber-400"
                  >
                    {renderStar(star, hoveredRating || editingRating)}
                  </button>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {editingRating ? `${editingRating} stars` : "Click to rate"}
              </span>
            </div>

            {/* Notes Section */}
            {selectedCook?.notes && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <p className="whitespace-pre-wrap rounded-md border border-slate-200 p-3 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-300">
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
              {isSaving ? "Saving..." : "Save Rating"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
