"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ChevronDown, Minus, Plus, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AuthGateModal } from "./AuthGateModal";
import { cn } from "~/lib/utils";

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
  /** When true, starts collapsed (default). Pass false for drawer contexts. */
  defaultCollapsed?: boolean;
  /** Skip the collapsible chrome when already inside a drawer. */
  embedded?: boolean;
}

type TimeOption = "quick" | "standard" | "slow";
type DifficultyOption = "beginner" | "confident";

/**
 * Collapsed-by-default adapt controls for servings, time, and difficulty.
 * Swaps live near cooking tips instead. Auth-gated for anonymous users.
 * @param servings - Current servings state
 * @param onServingsChange - Callback when servings change
 * @param difficulty - Current difficulty level (v2)
 * @param onDifficultyChange - Callback when difficulty changes (v2)
 * @param hasV2Data - Whether this recipe has v2 difficulty variations
 * @param defaultCollapsed - Whether the panel starts collapsed
 * @param embedded - Skip collapsible chrome when already inside a drawer
 */
export function AdaptThisRecipe({
  servings,
  onServingsChange,
  difficulty = "MEDIUM",
  onDifficultyChange,
  hasV2Data = false,
  defaultCollapsed = true,
  embedded = false,
}: AdaptThisRecipeProps): JSX.Element {
  const { isSignedIn, isLoaded } = useUser();
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [isOpen, setIsOpen] = useState(!defaultCollapsed);
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

  const controls = (
    <div className="space-y-5">
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
          <ToggleGroupItem value="quick" aria-label="Quick" className="px-4">
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
        <p className="text-xs text-muted-foreground">Adjust steps and pacing</p>
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
              <ToggleGroupItem value="EASY" aria-label="Easy" className="px-4">
                Easy
              </ToggleGroupItem>
              <ToggleGroupItem
                value="MEDIUM"
                aria-label="Medium"
                className="px-4"
              >
                Medium
              </ToggleGroupItem>
              <ToggleGroupItem value="HARD" aria-label="Hard" className="px-4">
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
    </div>
  );

  return (
    <>
      {embedded ? (
        controls
      ) : (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="overflow-hidden rounded-xl border border-dashed border-border/80 bg-muted/30">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
              >
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
                  <span className="font-medium text-foreground/80">
                    Adapt this recipe
                  </span>
                  <span className="hidden text-xs sm:inline">
                    · servings, time, difficulty
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="border-t border-border/60 px-4 py-4">
                {controls}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      )}

      <AuthGateModal
        isOpen={showAuthGate}
        onClose={() => setShowAuthGate(false)}
      />
    </>
  );
}
