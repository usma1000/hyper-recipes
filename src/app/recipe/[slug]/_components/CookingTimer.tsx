"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pause, Play, Square, Timer, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type TimerState = {
  seconds: number;
  isRunning: boolean;
  startTime: number;
  lastTickTime: number;
  recipeSlug: string;
};

export default function CookingTimer({ recipeSlug }: { recipeSlug: string }) {
  const router = useRouter();
  const [timerState, setTimerState] = useState<TimerState>({
    seconds: 0,
    isRunning: false,
    startTime: 0,
    lastTickTime: Date.now(),
    recipeSlug,
  });
  const [showConfirmStop, setShowConfirmStop] = useState(false);
  const [showRecipeConflict, setShowRecipeConflict] = useState(false);
  const [otherRecipeSlug, setOtherRecipeSlug] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to restore state from localStorage on initial load
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cookingTimer");
      if (saved) {
        const parsed = JSON.parse(saved);
        const elapsed = Math.floor((Date.now() - parsed.lastTickTime) / 1000);

        if (parsed.recipeSlug !== recipeSlug) {
          // Timer exists for another recipe
          setOtherRecipeSlug(parsed.recipeSlug);
          setShowRecipeConflict(true);
          setIsLoading(false);
          return;
        }

        setTimerState({
          ...parsed,
          seconds: parsed.seconds + (parsed.isRunning ? elapsed : 0),
          lastTickTime: Date.now(),
        });
      }
      setIsLoading(false);
    }
  }, [recipeSlug]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerState?.isRunning) {
      interval = setInterval(() => {
        setTimerState((prev) => {
          const newState = {
            ...prev,
            seconds: prev.seconds + 1,
            lastTickTime: Date.now(),
          };
          // Save to localStorage on each tick
          localStorage.setItem("cookingTimer", JSON.stringify(newState));
          return newState;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerState.isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    const newState = {
      ...timerState,
      isRunning: true,
      startTime: timerState.seconds === 0 ? Date.now() : timerState.startTime,
      recipeSlug,
    };
    setTimerState(newState);
    localStorage.setItem("cookingTimer", JSON.stringify(newState));
  };

  const handlePause = () => {
    if (!timerState) return;

    const newState = { ...timerState, isRunning: false };
    setTimerState(newState);
    localStorage.setItem("cookingTimer", JSON.stringify(newState));
  };

  const handleStop = () => setShowConfirmStop(true);

  const confirmStop = () => {
    if (!timerState) return;

    const roundedMinutes = Math.round(timerState.seconds / 60);
    localStorage.removeItem("cookingTimer");
    setShowConfirmStop(false);
    router.push(`/recipe/${recipeSlug}/rate?time=${roundedMinutes}`);
  };

  const handleCancel = () => {
    localStorage.removeItem("cookingTimer");
    setTimerState({
      seconds: 0,
      isRunning: false,
      startTime: 0,
      lastTickTime: Date.now(),
      recipeSlug,
    });
    setShowConfirmStop(false);
  };

  const handleSwitchToNewRecipe = () => {
    localStorage.removeItem("cookingTimer");
    setShowRecipeConflict(false);
    setTimerState({
      seconds: 0,
      isRunning: false,
      startTime: 0,
      lastTickTime: Date.now(),
      recipeSlug,
    });
  };

  if (isLoading) {
    return <div className="h-10 animate-pulse rounded bg-slate-100"></div>; // Loading state
  }

  const { seconds, isRunning } = timerState;

  return (
    <div className="space-y-2">
      {seconds > 0 ? (
        <div className="space-y-2 rounded-md bg-slate-50 p-4 shadow-sm">
          <div className="flex flex-col items-center justify-between">
            <div className="font-mono text-lg font-bold">
              {formatTime(seconds)}
            </div>
            <div className="flex gap-1">
              {isRunning ? (
                <Button size="icon" variant="ghost" onClick={handlePause}>
                  <Pause className="h-4 w-4" />
                </Button>
              ) : (
                <Button size="icon" variant="ghost" onClick={handleStart}>
                  <Play className="h-4 w-4" />
                </Button>
              )}
              <Button size="icon" variant="ghost" onClick={handleStop}>
                <Square className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Don't stress! It's not a race. This timer is just for your
            reference!
          </p>
        </div>
      ) : (
        <Button onClick={handleStart} className="w-full gap-2">
          <Timer className="h-4 w-4" />
          Start Cooking
        </Button>
      )}

      <AlertDialog open={showConfirmStop} onOpenChange={setShowConfirmStop}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Stop Cooking Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will end your current cooking session. You can rate and add
              notes before finishing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Cooking</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStop}>
              Finish & Rate
            </AlertDialogAction>
            <Button variant="outline" onClick={handleCancel}>
              Cancel Timer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showRecipeConflict}
        onOpenChange={setShowRecipeConflict}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Timer Running on Another Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              You have a cooking timer already running for a different recipe.
              What would you like to do?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Link href={`/recipe/${otherRecipeSlug}`} passHref>
              <Button variant="default" className="w-full sm:w-auto">
                Go to Active Recipe
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleSwitchToNewRecipe}
              className="w-full sm:w-auto"
            >
              Start New Timer
            </Button>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
