"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, StarHalf } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RateRecipePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { time: string };
}) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [time, setTime] = useState(searchParams.time || "0");
  const [notes, setNotes] = useState("");

  const handleStarClick = (star: number, event: React.MouseEvent) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const clickX = event.clientX - rect.left;

    // If clicked on left half, subtract 0.5
    const finalRating = clickX < halfWidth ? star - 0.5 : star;
    setRating(finalRating);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save rating
    router.push(`/recipe/${params.slug}`);
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto max-w-md space-y-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Rate Your Cook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Stars */}
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
                  {renderStar(star, hoveredRating || rating)}
                </button>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {rating ? `${rating} stars` : "Click to rate"}
            </span>
          </div>

          {/* Cooking Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Cooking Time (minutes)
            </label>
            <Input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              min="1"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What worked well? What would you do differently next time?"
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full">
            Save Rating
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
