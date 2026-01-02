"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}

/**
 * Parses quantity string and extracts numeric value and unit.
 * @param quantity - Original quantity string
 * @returns Object with numeric value and unit
 */
function parseQuantity(quantity: string): { value: number | null; unit: string } {
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
    scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(2).replace(/\.?0+$/, "");

  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Ingredients panel with checkboxes and optional collapsible behavior.
 * Displays quantity bold with prep notes aligned.
 * @param ingredients - Array of ingredient items
 * @param servingsMultiplier - Multiplier for scaling quantities
 * @param collapsible - Whether to render as collapsible (for mobile)
 * @param defaultOpen - Default open state when collapsible
 */
export function IngredientsPanel({
  ingredients,
  servingsMultiplier = 1,
  collapsible = false,
  defaultOpen = true,
}: IngredientsPanelProps): JSX.Element {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
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

  const content = (
    <>
      {ingredients.length === 0 ? (
        <p className="text-sm text-muted-foreground">Ingredients unavailable.</p>
      ) : (
        <ul className="space-y-3">
          {ingredients.map(({ ingredient, quantity, ingredientId }) => {
            const isChecked = checkedItems[ingredientId] ?? false;
            const scaledQuantity = formatScaledQuantity(quantity, servingsMultiplier);

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
                    "flex-1 cursor-pointer text-sm leading-tight",
                    isChecked && "text-muted-foreground line-through"
                  )}
                >
                  <span className="font-semibold">{scaledQuantity}</span>{" "}
                  {ingredient.name}
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
      <Card>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Ingredients</CardTitle>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">{content}</CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Ingredients</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}

