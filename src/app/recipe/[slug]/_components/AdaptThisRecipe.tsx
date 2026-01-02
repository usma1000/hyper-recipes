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

interface AdaptThisRecipeProps {
  servings: number;
  onServingsChange: (servings: number) => void;
}

type TimeOption = "quick" | "standard" | "slow";
type DifficultyOption = "beginner" | "confident";

/**
 * Adapt this recipe card - the key differentiator feature.
 * Controls for servings, time, swaps, and difficulty.
 * Anonymous users see controls but are gated on interaction.
 * @param defaultServings - Original recipe servings
 * @param servings - Current servings state
 * @param onServingsChange - Callback when servings change
 */
export function AdaptThisRecipe({
  servings,
  onServingsChange,
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
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
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
          <div className="p-4 pb-8">
            <p className="text-center text-sm text-muted-foreground">
              No swap suggestions available for this recipe yet.
            </p>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

