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

interface MobileStickyBarProps {
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onStartCookMode: () => void;
  servings: number;
  onServingsChange: (servings: number) => void;
}

/**
 * Mobile sticky bottom bar with quick action buttons.
 * Contains Cook Mode, Adapt drawer trigger, and Save button.
 * @param recipeId - The recipe ID
 * @param isFavorite - Whether the recipe is favorited
 * @param onToggleFavorite - Callback to toggle favorite
 * @param onStartCookMode - Callback to start cook mode
 * @param servings - Current servings
 * @param onServingsChange - Callback when servings change
 */
export function MobileStickyBar({
  isFavorite,
  onToggleFavorite,
  onStartCookMode,
  servings,
  onServingsChange,
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
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
        <div className="container flex items-center justify-between gap-2 px-4 py-3">
          <Button onClick={onStartCookMode} className="flex-1">
            Start Cook Mode
          </Button>
          <Button variant="outline" size="icon" onClick={handleAdaptClick}>
            <Sliders className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleSaveClick}>
            {isFavorite ? (
              <BookmarkCheck className="h-4 w-4 fill-current" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
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

