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

export default function CookingTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showConfirmStop, setShowConfirmStop] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => setShowConfirmStop(true);

  const confirmStop = () => {
    setIsRunning(false);
    setSeconds(0);
    setShowConfirmStop(false);
    // TODO: Save cooking session
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
            Don't stress, this timer is just for your reference!
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
