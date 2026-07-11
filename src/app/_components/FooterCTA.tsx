"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

/**
 * Final signup CTA section for anonymous users.
 * Calm, centered design with clear value proposition.
 */
export function FooterCTA(): JSX.Element {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary px-8 py-14 text-center text-primary-foreground">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-herb/20 blur-2xl" />

      <div className="relative z-10">
        <h2 className="mb-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">
          Unlock smart recipes in seconds.
        </h2>
        <p className="mb-8 text-[15px] text-primary-foreground/70">
          Free account. Google login. Start cooking smarter today.
        </p>
        <SignInButton mode="modal">
          <Button
            size="lg"
            variant="secondary"
            className="h-12 bg-card px-8 text-[15px] font-medium text-foreground hover:bg-card/90"
          >
            Create free account
          </Button>
        </SignInButton>
      </div>
    </section>
  );
}
