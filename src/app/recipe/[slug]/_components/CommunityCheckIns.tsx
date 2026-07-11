"use client";

import { format } from "date-fns";
import { Star, StarHalf, Users } from "lucide-react";
import type { PublicCheckIn, RecipeCookStats } from "~/server/queries/cookingHistory";

interface CommunityCheckInsProps {
  stats: RecipeCookStats;
  checkIns: PublicCheckIn[];
}

/**
 * Renders a compact star row for a rating value.
 * @param rating - Rating from 0-5
 */
function StarRating({ rating }: { rating: number }): JSX.Element {
  return (
    <div className="flex text-accent" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => {
        const difference = value - rating;
        if (difference <= 0) {
          return <Star key={value} size={14} className="fill-current" />;
        }
        if (difference > 0 && difference < 1) {
          return <StarHalf key={value} size={14} className="fill-current" />;
        }
        return <Star key={value} size={14} className="text-muted" />;
      })}
    </div>
  );
}

/**
 * Community check-ins section: aggregate stats and public cook reviews.
 * @param stats - Aggregate cook count and average rating
 * @param checkIns - Public check-ins with display names
 */
export function CommunityCheckIns({
  stats,
  checkIns,
}: CommunityCheckInsProps): JSX.Element {
  const { cookCount, avgRating } = stats;

  return (
    <section className="mt-10 space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Community cooks
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Check-ins from cooks who made this recipe.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {avgRating != null && (
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <Star className="h-4 w-4 fill-accent text-accent" aria-hidden />
              {avgRating.toFixed(1)}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" aria-hidden />
            {cookCount === 0
              ? "No cooks yet"
              : cookCount === 1
                ? "1 cook tried this"
                : `${cookCount} cooks tried this`}
          </span>
        </div>
      </div>

      {checkIns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 px-5 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Be the first to cook this and share how it went.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {checkIns.map((checkIn) => (
            <li
              key={checkIn.id}
              className="rounded-2xl border border-border/70 bg-card/80 px-4 py-4 sm:px-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {checkIn.displayName}
                  </span>
                  <StarRating rating={checkIn.rating} />
                </div>
                <time
                  className="text-xs text-muted-foreground"
                  dateTime={new Date(checkIn.cookedAt).toISOString()}
                >
                  {format(new Date(checkIn.cookedAt), "MMM d, yyyy")}
                </time>
              </div>
              {checkIn.notes && (
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                  {checkIn.notes}
                </p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                Cooked in {checkIn.timeMinutes} min
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
