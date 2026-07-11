"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "~/lib/utils";

interface IngredientItem {
  quantity: string;
  recipeId: number;
  ingredientId: number;
  ingredient: {
    id: number;
    name: string;
    description: string | null;
  };
}

interface IngredientsPanelProps {
  ingredients: IngredientItem[];
  servingsMultiplier?: number;
  collapsible?: boolean;
  defaultOpen?: boolean;
  isLoading?: boolean;
}

/**
 * Parses quantity string and extracts numeric value and unit.
 * @param quantity - Original quantity string
 * @returns Object with numeric value and unit
 */
function parseQuantity(quantity: string): {
  value: number | null;
  unit: string;
} {
  const match = quantity.match(/^([\d./]+)\s*(.*)$/);
  if (!match) return { value: null, unit: quantity };

  const numStr = match[1];
  let value: number;

  if (numStr?.includes("/")) {
    const parts = numStr.split("/");
    value = parseFloat(parts[0] ?? "0") / parseFloat(parts[1] ?? "1");
  } else {
    value = parseFloat(numStr ?? "0");
  }

  return { value: isNaN(value) ? null : value, unit: match[2]?.trim() ?? "" };
}

/**
 * Formats a scaled quantity for display.
 * @param quantity - Original quantity string
 * @param multiplier - Scaling multiplier
 * @returns Formatted quantity string
 */
function formatScaledQuantity(quantity: string, multiplier: number): string {
  const { value, unit } = parseQuantity(quantity);
  if (value === null) return quantity;

  const scaled = value * multiplier;
  const formatted =
    scaled % 1 === 0
      ? scaled.toString()
      : scaled.toFixed(2).replace(/\.?0+$/, "");

  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Ingredients checklist with optional collapsible behavior.
 * @param ingredients - Array of ingredient items
 * @param servingsMultiplier - Multiplier for scaling quantities
 * @param collapsible - Whether to render as collapsible (for mobile)
 * @param defaultOpen - Default open state when collapsible
 * @param isLoading - Whether adapted ingredients are loading
 */
export function IngredientsPanel({
  ingredients,
  servingsMultiplier = 1,
  collapsible = false,
  defaultOpen = true,
  isLoading = false,
}: IngredientsPanelProps): JSX.Element {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>(
    {},
  );
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    const saved = localStorage.getItem("ingredientChecks");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<number, boolean>;
        setCheckedItems(parsed);
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ingredientChecks", JSON.stringify(checkedItems));
  }, [checkedItems]);

  const handleCheckChange = (ingredientId: number, checked: boolean): void => {
    setCheckedItems((prev) => ({
      ...prev,
      [ingredientId]: checked,
    }));
  };

  const list = (
    <>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Updating ingredients...</p>
      ) : ingredients.length === 0 ? (
        <p className="text-sm text-muted-foreground">Ingredients unavailable.</p>
      ) : (
        <ul className="space-y-3">
          {ingredients.map(({ ingredient, quantity, ingredientId }) => {
            const isChecked = checkedItems[ingredientId] ?? false;
            const scaledQuantity = formatScaledQuantity(
              quantity,
              servingsMultiplier,
            );

            return (
              <li key={ingredientId} className="flex items-start gap-3">
                <Checkbox
                  id={`ingredient-${ingredientId}`}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleCheckChange(ingredientId, checked === true)
                  }
                  className="mt-0.5"
                />
                <label
                  htmlFor={`ingredient-${ingredientId}`}
                  className={cn(
                    "flex-1 cursor-pointer text-sm leading-snug",
                    isChecked && "text-muted-foreground line-through",
                  )}
                >
                  <span className="font-semibold tabular-nums text-foreground">
                    {scaledQuantity}
                  </span>{" "}
                  <span className="text-foreground/90">{ingredient.name}</span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );

  if (collapsible) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <h2 className="font-display text-lg font-semibold tracking-tight">
                Ingredients
              </h2>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t border-border/60 px-5 py-4">{list}</div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
      <div className="border-b border-border/60 px-5 py-4">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Ingredients
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Check off as you go
        </p>
      </div>
      <div className="px-5 py-4">{list}</div>
    </div>
  );
}
