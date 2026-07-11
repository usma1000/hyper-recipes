"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

/**
 * Full-screen cook mode with always-visible ingredients and one step at a time.
 * Desktop: ingredients sidebar + step stage. Mobile: ingredients strip above step.
 * @param isOpen - Whether cook mode is active
 * @param onClose - Callback to exit cook mode
 * @param steps - Array of step strings
 * @param ingredients - Array of ingredients for quick reference
 */
export function CookModeOverlay({
  isOpen,
  onClose,
  steps,
  ingredients,
}: CookModeOverlayProps): JSX.Element | null {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

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

  const handleNext = useCallback((): void => {
    setCurrentStep((prev) => {
      if (prev < steps.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, [steps.length]);

  const handleBack = useCallback((): void => {
    setCurrentStep((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

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
  }, [isOpen, onClose, handleNext, handleBack]);

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
  const progress =
    steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  const ingredientsList = (
    <ul className="space-y-2.5">
      {ingredients.length === 0 ? (
        <li className="text-sm text-muted-foreground">
          Ingredients unavailable.
        </li>
      ) : (
        ingredients.map(({ ingredient, quantity, ingredientId }) => (
          <li key={ingredientId} className="text-sm leading-snug">
            <span className="font-semibold tabular-nums">{quantity}</span>{" "}
            <span className="text-foreground/85">{ingredient.name}</span>
          </li>
        ))
      )}
    </ul>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-herb transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header className="flex items-center justify-between border-b border-border/70 px-4 py-3">
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </span>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="mr-1.5 h-4 w-4" />
          Exit
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-border/70 bg-card/50 lg:w-80 lg:border-b-0 lg:border-r lg:overflow-y-auto">
          <div className="px-4 py-3 lg:px-5 lg:py-5">
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground lg:text-base lg:normal-case lg:tracking-tight lg:text-foreground">
              Ingredients
            </h2>
            <div className="max-h-36 overflow-y-auto pr-1 lg:max-h-none">
              {ingredientsList}
            </div>
          </div>
        </aside>

        <main className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-8">
            <div className="max-w-2xl text-center animate-rise">
              <div
                className={cn(
                  "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full font-display text-xl font-semibold",
                  isCurrentStepCompleted
                    ? "bg-herb-muted text-herb"
                    : "bg-accent/10 text-accent",
                )}
              >
                {isCurrentStepCompleted ? (
                  <Check className="h-7 w-7" />
                ) : (
                  currentStep + 1
                )}
              </div>
              <p
                className={cn(
                  "font-display text-2xl leading-snug tracking-tight md:text-3xl md:leading-snug",
                  isCurrentStepCompleted && "text-muted-foreground",
                )}
              >
                {steps[currentStep]}
              </p>
            </div>
          </div>

          <footer className="border-t border-border/70 px-4 py-4">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
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
                className="max-w-xs flex-1"
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
        </main>
      </div>
    </div>
  );
}
