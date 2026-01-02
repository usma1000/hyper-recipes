"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

/**
 * Final signup CTA section for anonymous users.
 * Calm, centered design with clear value proposition.
 */
export function FooterCTA(): JSX.Element {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-neutral-900 px-8 py-14 text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/50 via-transparent to-neutral-950/30" />
      
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative z-10">
        <h2 className="mb-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Unlock smart recipes in seconds.
        </h2>
        <p className="mb-8 text-[15px] text-neutral-400">
          Free account. Google login. Start cooking smarter today.
        </p>
        <SignInButton mode="modal">
          <Button 
            size="lg" 
            className="h-12 rounded-xl bg-white px-8 text-[15px] font-medium text-neutral-900 shadow-lg transition-all hover:bg-neutral-100 hover:shadow-xl"
          >
            Create free account
          </Button>
        </SignInButton>
      </div>
    </section>
  );
}
