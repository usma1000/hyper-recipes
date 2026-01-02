"use client";

import { useSignIn } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal gate for anonymous users attempting to use adapt controls.
 * Displays signup prompt with exact copy from spec.
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback to close the modal
 */
export function AuthGateModal({
  isOpen,
  onClose,
}: AuthGateModalProps): JSX.Element {
  const { signIn } = useSignIn();

  const handleCreateAccount = async (): Promise<void> => {
    try {
      await signIn?.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: window.location.href,
      });
    } catch (error) {
      console.error("Failed to initiate sign in:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unlock smart recipe controls</DialogTitle>
          <DialogDescription>
            Adjust time, servings, and ingredient swaps with a free account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={handleCreateAccount} className="w-full">
            Create free account
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Not now
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Google login &bull; takes ~10 seconds
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

