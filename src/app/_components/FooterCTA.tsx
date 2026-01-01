"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

/**
 * Footer-adjacent CTA section for anonymous users.
 * Final conversion prompt with warm gradient background.
 */
export function FooterCTA(): JSX.Element {
  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-10 text-center text-white">
      <h2 className="mb-2 text-2xl font-bold">Ready to start your kitchen journey?</h2>
      <p className="mb-6 text-amber-100">
        Join and start saving your favorite recipes today
      </p>
      <Button size="lg" variant="secondary" className="px-8">
        <SignInButton mode="modal">
          Sign up free
        </SignInButton>
      </Button>
    </section>
  );
}

