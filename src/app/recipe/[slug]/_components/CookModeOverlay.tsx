"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Check, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "~/lib/utils";

interface IngredientItem {
  quantity: string;
  ingredientId: number;
  ingredient: {
    id: number;
    name: string;
  };
}

interface CookModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  steps: string[];
  ingredients: IngredientItem[];
  recipeName: string;
}

/**
 * Full-screen cook mode overlay for focused cooking.
 * Shows one step at a time with navigation controls.
 * @param isOpen - Whether cook mode is active
 * @param onClose - Callback to exit cook mode
 * @param steps - Array of step strings
 * @param ingredients - Array of ingredients for quick reference
 * @param recipeName - Name of the recipe
 */
export function CookModeOverlay({
  isOpen,
  onClose,
  steps,
  ingredients,
  recipeName,
}: CookModeOverlayProps): JSX.Element | null {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showIngredients, setShowIngredients] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setCompletedSteps(new Set());

      if ("wakeLock" in navigator) {
        navigator.wakeLock
          .request("screen")
          .catch((err) => console.log("Wake lock not available:", err));
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleBack();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep, steps.length, onClose]);

  const handleNext = useCallback((): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, steps.length]);

  const handleBack = useCallback((): void => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleMarkDone = (): void => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      newSet.add(currentStep);
      return newSet;
    });

    if (currentStep < steps.length - 1) {
      handleNext();
    }
  };

  if (!isOpen) return null;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const isCurrentStepCompleted = completedSteps.has(currentStep);
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <header className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowIngredients(true)}
            >
              <UtensilsCrossed className="mr-1.5 h-4 w-4" />
              Ingredients
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="mr-1.5 h-4 w-4" />
              Exit Cook Mode
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-6 py-8">
          <div className="max-w-2xl text-center">
            <div
              className={cn(
                "mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold",
                isCurrentStepCompleted
                  ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-primary/10 text-primary"
              )}
            >
              {isCurrentStepCompleted ? (
                <Check className="h-8 w-8" />
              ) : (
                currentStep + 1
              )}
            </div>
            <p
              className={cn(
                "text-2xl leading-relaxed md:text-3xl",
                isCurrentStepCompleted && "text-muted-foreground"
              )}
            >
              {steps[currentStep]}
            </p>
          </div>
        </main>

        <footer className="border-t px-4 py-4">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isFirstStep}
              className="w-24"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleMarkDone}
              disabled={isCurrentStepCompleted}
              className="flex-1 max-w-xs"
            >
              <Check className="mr-1.5 h-4 w-4" />
              Done
            </Button>

            <Button
              variant="outline"
              onClick={handleNext}
              disabled={isLastStep}
              className="w-24"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </footer>
      </div>

      <Drawer open={showIngredients} onOpenChange={setShowIngredients}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Ingredients</DrawerTitle>
          </DrawerHeader>
          <div className="max-h-[60vh] overflow-y-auto px-4 pb-8">
            {ingredients.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Ingredients unavailable.
              </p>
            ) : (
              <ul className="space-y-2">
                {ingredients.map(({ ingredient, quantity, ingredientId }) => (
                  <li key={ingredientId} className="text-sm">
                    <span className="font-semibold">{quantity}</span>{" "}
                    {ingredient.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

