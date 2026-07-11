"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Bookmark, BookmarkCheck, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { AdaptThisRecipe } from "./AdaptThisRecipe";
import { AuthGateModal } from "./AuthGateModal";

type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";

interface MobileStickyBarProps {
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onStartCookMode: () => void;
  servings: number;
  onServingsChange: (servings: number) => void;
  difficulty?: DifficultyLevel;
  onDifficultyChange?: (difficulty: DifficultyLevel) => void;
  hasV2Data?: boolean;
}

/**
 * Mobile sticky bottom bar with save, tucked adapt drawer, and deemphasized cook mode.
 * @param isFavorite - Whether the recipe is favorited
 * @param onToggleFavorite - Callback to toggle favorite
 * @param onStartCookMode - Callback to start cook mode
 * @param servings - Current servings
 * @param onServingsChange - Callback when servings change
 * @param difficulty - Current difficulty level (v2)
 * @param onDifficultyChange - Callback when difficulty changes (v2)
 * @param hasV2Data - Whether this recipe has v2 difficulty variations
 */
export function MobileStickyBar({
  isFavorite,
  onToggleFavorite,
  onStartCookMode,
  servings,
  onServingsChange,
  difficulty,
  onDifficultyChange,
  hasV2Data = false,
}: MobileStickyBarProps): JSX.Element {
  const { isSignedIn, isLoaded } = useUser();
  const [showAdaptDrawer, setShowAdaptDrawer] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);

  const handleAdaptClick = (): void => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setShowAuthGate(true);
      return;
    }
    setShowAdaptDrawer(true);
  };

  const handleSaveClick = (): void => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setShowAuthGate(true);
      return;
    }
    onToggleFavorite();
  };

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
        <div className="container flex items-center justify-between gap-2 px-4 py-3">
          <Button
            onClick={handleSaveClick}
            className="flex-1 shadow-soft"
            aria-label={isFavorite ? "Remove favorite" : "Save favorite"}
          >
            {isFavorite ? (
              <BookmarkCheck className="mr-1.5 h-4 w-4 fill-current" />
            ) : (
              <Bookmark className="mr-1.5 h-4 w-4" />
            )}
            {isFavorite ? "Saved" : "Save"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleAdaptClick}
            aria-label="Adapt recipe"
          >
            <Sliders className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onStartCookMode}
            className="text-muted-foreground"
          >
            Cook Mode
          </Button>
        </div>
      </div>

      <Drawer open={showAdaptDrawer} onOpenChange={setShowAdaptDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Adapt this recipe</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <AdaptThisRecipe
              servings={servings}
              onServingsChange={onServingsChange}
              difficulty={difficulty}
              onDifficultyChange={onDifficultyChange}
              hasV2Data={hasV2Data}
              embedded
            />
          </div>
        </DrawerContent>
      </Drawer>

      <AuthGateModal
        isOpen={showAuthGate}
        onClose={() => setShowAuthGate(false)}
      />
    </>
  );
}
