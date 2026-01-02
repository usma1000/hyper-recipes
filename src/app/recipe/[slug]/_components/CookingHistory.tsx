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
} from "@/components/ui/dialog";
import CookingTimer from "./CookingTimer";
import { fetchCookingHistory } from "~/app/_actions/cookingHistory";
import { getRecipeIdBySlug } from "~/app/_actions/recipes";

type Cook = {
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
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);
  const [showNotesDialog, setShowNotesDialog] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      try {
        const recipeId = await getRecipeIdBySlug(recipeSlug);
        const sessions = await fetchCookingHistory(recipeId);

        const transformedCooks: Cook[] = sessions.map((session) => ({
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

    loadHistory();
  }, [recipeSlug]);

  const handleNotesClick = (notes: string | null) => {
    setSelectedNotes(notes);
    setShowNotesDialog(true);
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
                        {cook.hasNotes && (
                          <Button
                            variant="link"
                            className="h-6 p-0 text-xs"
                            onClick={() => handleNotesClick(cook.notes)}
                          >
                            Notes
                          </Button>
                        )}
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

      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cooking Notes</DialogTitle>
            <DialogDescription>
              Notes from your cooking session
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {selectedNotes || "No notes available"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
