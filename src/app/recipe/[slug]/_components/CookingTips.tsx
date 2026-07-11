"use client";

import { ArrowRightLeft, Lightbulb, Wrench } from "lucide-react";
import type { IngredientSwap } from "./AdaptThisRecipe";

interface CookingTipsProps {
  swaps?: IngredientSwap[];
}

/**
 * Formats a swap quantity for display.
 * @param quantity - Numeric quantity
 * @param unit - Unit string
 * @returns Formatted quantity string
 */
function formatSwapQuantity(quantity: number, unit: string): string {
  const formatted =
    quantity % 1 === 0
      ? quantity.toString()
      : quantity.toFixed(2).replace(/\.?0+$/, "");
  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Cooking support card: key cues, common fixes, and ingredient swaps stacked
 * for quick scanning while cooking.
 * @param swaps - Ingredient substitution suggestions from the adapted view
 */
export function CookingTips({ swaps = [] }: CookingTipsProps): JSX.Element {
  return (
    <section className="mt-8" aria-label="Cooking tips">
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
        <div className="border-b border-border/60 px-5 py-4">
          <h3 className="font-display text-lg font-semibold tracking-tight">
            While you cook
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Cues, fixes, and swaps
          </p>
        </div>

        <div className="divide-y divide-border/60">
          <div className="px-5 py-4">
            <div className="mb-2.5 flex items-center gap-2 text-sm font-medium">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-herb-muted text-herb">
                <Lightbulb className="h-3.5 w-3.5" aria-hidden />
              </span>
              Key cues
            </div>
            <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
              <li>Look for glossy sauce.</li>
              <li>Aromatics should be fragrant, not browned.</li>
              <li>Taste and adjust before serving.</li>
            </ul>
          </div>

          <div className="px-5 py-4">
            <div className="mb-2.5 flex items-center gap-2 text-sm font-medium">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-herb-muted text-herb">
                <Wrench className="h-3.5 w-3.5" aria-hidden />
              </span>
              Common fixes
            </div>
            <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
              <li>Too thick? Add a splash of water.</li>
              <li>Too thin? Simmer 2–3 minutes longer.</li>
              <li>Too salty? Add acid or unsalted starch.</li>
            </ul>
          </div>

          <div className="px-5 py-4">
            <div className="mb-2.5 flex items-center gap-2 text-sm font-medium">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-herb-muted text-herb">
                <ArrowRightLeft className="h-3.5 w-3.5" aria-hidden />
              </span>
              Swaps
              {swaps.length > 0 ? (
                <span className="text-xs font-normal text-muted-foreground">
                  ({swaps.length})
                </span>
              ) : null}
            </div>
            {swaps.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No swap suggestions for this recipe yet.
              </p>
            ) : (
              <div className="space-y-3">
                {swaps.map((swap) => (
                  <div key={swap.originalIngredientId}>
                    <p className="text-sm font-medium text-foreground">
                      {swap.originalName}
                    </p>
                    <ul className="mt-1 space-y-1">
                      {swap.substitutes.map((sub) => (
                        <li
                          key={sub.ingredientId}
                          className="text-sm text-muted-foreground"
                        >
                          <span className="text-foreground">
                            {sub.ingredientName}
                          </span>
                          {" — "}
                          {formatSwapQuantity(sub.quantity, sub.unit)}
                          {sub.notes ? ` (${sub.notes})` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
