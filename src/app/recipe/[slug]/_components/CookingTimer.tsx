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
import { Pause, Play, Square, Timer } from "lucide-react";
import { useRouter } from "next/navigation";

type TimerState = {
  seconds: number;
  isRunning: boolean;
  startTime: number;
  lastTickTime: number;
};

export default function CookingTimer({ recipeSlug }: { recipeSlug: string }) {
  const router = useRouter();
  const timerKey = `cookingTimer-${recipeSlug}`;
  const [timerState, setTimerState] = useState<TimerState>(() => {
    // Try to restore state from localStorage on initial load
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(timerKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const elapsed = Math.floor((Date.now() - parsed.lastTickTime) / 1000);
        return {
          ...parsed,
          seconds: parsed.seconds + (parsed.isRunning ? elapsed : 0),
          lastTickTime: Date.now(),
        };
      }
    }
    return {
      seconds: 0,
      isRunning: false,
      startTime: 0,
      lastTickTime: Date.now(),
    };
  });
  const [showConfirmStop, setShowConfirmStop] = useState(false);

  const { seconds, isRunning } = timerState;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimerState((prev) => {
          const newState = {
            ...prev,
            seconds: prev.seconds + 1,
            lastTickTime: Date.now(),
          };
          // Save to localStorage on each tick
          localStorage.setItem(timerKey, JSON.stringify(newState));
          return newState;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerKey]);

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
    };
    setTimerState(newState);
    localStorage.setItem(timerKey, JSON.stringify(newState));
  };

  const handlePause = () => {
    const newState = { ...timerState, isRunning: false };
    setTimerState(newState);
    localStorage.setItem(timerKey, JSON.stringify(newState));
  };

  const handleStop = () => setShowConfirmStop(true);

  const confirmStop = () => {
    const roundedMinutes = Math.round(seconds / 60);
    localStorage.removeItem(timerKey);
    setShowConfirmStop(false);
    router.push(`/recipe/${recipeSlug}/rate?time=${roundedMinutes}`);
  };

  return (
    <div className="space-y-2">
      {seconds > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-lg font-bold">
              {formatTime(seconds)}
            </span>
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
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
