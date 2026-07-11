"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Minus, Plus, ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { AuthGateModal } from "./AuthGateModal";

type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";

export type IngredientSwap = {
  originalIngredientId: number;
  originalName: string;
  substitutes: Array<{
    ingredientId: number;
    ingredientName: string;
    quantity: number;
    unit: string;
    notes: string | null;
  }>;
};

interface AdaptThisRecipeProps {
  servings: number;
  onServingsChange: (servings: number) => void;
  difficulty?: DifficultyLevel;
  onDifficultyChange?: (difficulty: DifficultyLevel) => void;
  hasV2Data?: boolean;
  swaps?: IngredientSwap[];
}

type TimeOption = "quick" | "standard" | "slow";
type DifficultyOption = "beginner" | "confident";

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
 * Adapt this recipe card - the key differentiator feature.
 * Controls for servings, time, swaps, and difficulty.
 * Anonymous users see controls but are gated on interaction.
 * Now supports v2 difficulty levels (EASY/MEDIUM/HARD).
 * @param servings - Current servings state
 * @param onServingsChange - Callback when servings change
 * @param difficulty - Current difficulty level (v2)
 * @param onDifficultyChange - Callback when difficulty changes (v2)
 * @param hasV2Data - Whether this recipe has v2 difficulty variations
 * @param swaps - Ingredient substitution suggestions
 */
export function AdaptThisRecipe({
  servings,
  onServingsChange,
  difficulty = "MEDIUM",
  onDifficultyChange,
  hasV2Data = false,
  swaps = [],
}: AdaptThisRecipeProps): JSX.Element {
  const { isSignedIn, isLoaded } = useUser();
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [showSwapsDrawer, setShowSwapsDrawer] = useState(false);
  const [timeOption, setTimeOption] = useState<TimeOption>("standard");
  const [difficultyOption, setDifficultyOption] =
    useState<DifficultyOption>("confident");

  const requireAuth = (action: () => void): void => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setShowAuthGate(true);
      return;
    }
    action();
  };

  const handleServingsDecrease = (): void => {
    requireAuth(() => {
      if (servings > 1) {
        onServingsChange(servings - 1);
      }
    });
  };

  const handleServingsIncrease = (): void => {
    requireAuth(() => {
      onServingsChange(servings + 1);
    });
  };

  const handleTimeChange = (value: string): void => {
    if (!value) return;
    requireAuth(() => {
      setTimeOption(value as TimeOption);
    });
  };

  const handleDifficultyChange = (value: string): void => {
    if (!value) return;
    requireAuth(() => {
      setDifficultyOption(value as DifficultyOption);
    });
  };

  const handleV2DifficultyChange = (value: string): void => {
    if (!value || !onDifficultyChange) return;
    requireAuth(() => {
      onDifficultyChange(value as DifficultyLevel);
    });
  };

  const handleShowSwaps = (): void => {
    requireAuth(() => {
      setShowSwapsDrawer(true);
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Adapt this recipe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Servings</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleServingsDecrease}
                disabled={servings <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{servings}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleServingsIncrease}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Time</label>
            <ToggleGroup
              type="single"
              value={timeOption}
              onValueChange={handleTimeChange}
              className="justify-start"
            >
              <ToggleGroupItem
                value="quick"
                aria-label="Quick"
                className="px-4"
              >
                Quick
              </ToggleGroupItem>
              <ToggleGroupItem
                value="standard"
                aria-label="Standard"
                className="px-4"
              >
                Standard
              </ToggleGroupItem>
              <ToggleGroupItem value="slow" aria-label="Slow" className="px-4">
                Slow
              </ToggleGroupItem>
            </ToggleGroup>
            <p className="text-xs text-muted-foreground">
              Adjust steps and pacing
            </p>
          </div>

          <div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleShowSwaps}
            >
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              See swaps
              {swaps.length > 0 ? ` (${swaps.length})` : ""}
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            {hasV2Data ? (
              <>
                <ToggleGroup
                  type="single"
                  value={difficulty}
                  onValueChange={handleV2DifficultyChange}
                  className="justify-start"
                >
                  <ToggleGroupItem
                    value="EASY"
                    aria-label="Easy"
                    className="px-4"
                  >
                    Easy
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="MEDIUM"
                    aria-label="Medium"
                    className="px-4"
                  >
                    Medium
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="HARD"
                    aria-label="Hard"
                    className="px-4"
                  >
                    Hard
                  </ToggleGroupItem>
                </ToggleGroup>
                <p className="text-xs text-muted-foreground">
                  Recipe adapts to your skill level
                </p>
              </>
            ) : (
              <>
                <ToggleGroup
                  type="single"
                  value={difficultyOption}
                  onValueChange={handleDifficultyChange}
                  className="justify-start"
                >
                  <ToggleGroupItem
                    value="beginner"
                    aria-label="Beginner"
                    className="px-4"
                  >
                    Beginner
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="confident"
                    aria-label="Confident"
                    className="px-4"
                  >
                    Confident
                  </ToggleGroupItem>
                </ToggleGroup>
                <p className="text-xs text-muted-foreground">
                  More guidance vs. fewer prompts
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <AuthGateModal
        isOpen={showAuthGate}
        onClose={() => setShowAuthGate(false)}
      />

      <Drawer open={showSwapsDrawer} onOpenChange={setShowSwapsDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Ingredient Swaps</DrawerTitle>
            <DrawerDescription>
              Suggested alternatives for this recipe
            </DrawerDescription>
          </DrawerHeader>
          <div className="max-h-[60vh] space-y-4 overflow-y-auto p-4 pb-8">
            {swaps.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                No swap suggestions available for this recipe yet.
              </p>
            ) : (
              swaps.map((swap) => (
                <div
                  key={swap.originalIngredientId}
                  className="rounded-lg border p-3"
                >
                  <p className="text-sm font-medium">{swap.originalName}</p>
                  <ul className="mt-2 space-y-1.5">
                    {swap.substitutes.map((sub) => (
                      <li
                        key={sub.ingredientId}
                        className="text-sm text-muted-foreground"
                      >
                        <span className="font-medium text-foreground">
                          {sub.ingredientName}
                        </span>
                        {" — "}
                        {formatSwapQuantity(sub.quantity, sub.unit)}
                        {sub.notes ? ` (${sub.notes})` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
