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
  title?: string;
  description?: string;
}

/**
 * Modal gate for anonymous users attempting interactive features.
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback to close the modal
 * @param title - Optional custom title
 * @param description - Optional custom description
 */
export function AuthGateModal({
  isOpen,
  onClose,
  title = "Unlock smart recipe controls",
  description = "Adjust time, servings, and difficulty with a free account.",
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
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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

