"use client";

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Pricing page showcasing Free tier and upcoming Hyper+ premium features.
 * Designed to communicate value without enabling actual purchases.
 */
export default function PricingPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-background px-4 py-16">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-herb-muted/50 to-transparent" />

        <div className="container relative z-10 mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            Currently Free • Premium Coming Soon
          </Badge>
          <h1 className="mb-4 text-balance text-4xl font-semibold tracking-tight font-display text-foreground sm:text-5xl lg:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Start cooking with our free tier today. We&apos;re building
            something thoughtful for the kitchen—you&apos;re early, and we
            appreciate it.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {/* Free Tier */}
          <Card className="relative flex flex-col border-2 border-border">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-sm bg-accent" />
                <CardTitle className="text-2xl">Free</CardTitle>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">
                  /month
                </span>
              </div>
              <CardDescription className="mt-2 text-base">
                Everything you need to start your cooking journey
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-herb" />
                  <span className="text-sm text-foreground/80">
                    Browse all recipes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-herb" />
                  <span className="text-sm text-foreground/80">
                    Save & like recipes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-herb" />
                  <span className="text-sm text-foreground/80">
                    Basic personalization (diet, dislikes)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-herb" />
                  <span className="text-sm text-foreground/80">
                    Light gamification (XP, streaks)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-herb" />
                  <span className="text-sm text-foreground/80">
                    Limited collections
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-herb" />
                  <span className="text-sm text-foreground/80">
                    Limited meal planning
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <SignedOut>
                <Button size="lg" className="w-full rounded-xl" asChild>
                  <SignInButton mode="modal">Create free account</SignInButton>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-xl"
                  asChild
                >
                  <Link href="/">Continue to app</Link>
                </Button>
              </SignedIn>
            </CardFooter>
          </Card>

          {/* Hyper+ Tier */}
          <Card className="relative flex flex-col border-2 border-accent/40 bg-gradient-to-br from-accent/5 to-herb-muted/40">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <CardTitle className="text-2xl">Hyper+</CardTitle>
                <Badge variant="secondary" className="ml-auto text-xs">
                  Coming Soon
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$6</span>
                <span className="text-muted-foreground">
                  /month
                </span>
              </div>
              <CardDescription className="mt-2 text-sm italic text-muted-foreground">
                *Pricing not final—subject to change
              </CardDescription>
              <CardDescription className="mt-2 text-base">
                Unlock the full potential of your kitchen
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-herb" />
                  <span className="text-sm text-foreground/80">
                    Everything in Free
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-herb" />
                  <span className="text-sm text-foreground/80">
                    <span className="font-medium">Unlimited</span> meal planning
                    & collections
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-herb" />
                  <span className="text-sm text-foreground/80">
                    Smart shopping lists
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-herb" />
                  <span className="text-sm text-foreground/80">
                    AI recipe customization (faster, swaps, vegan, macros)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-herb" />
                  <span className="text-sm text-foreground/80">
                    &quot;Cook with what I have&quot; pantry mode
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-herb" />
                  <span className="text-sm text-foreground/80">
                    Advanced recommendations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-herb" />
                  <span className="text-sm text-muted-foreground">
                    Skill trees & progress analytics
                    <Badge variant="outline" className="ml-2 text-xs">
                      Planned
                    </Badge>
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-xl border-accent/40 bg-accent/5 text-accent hover:bg-accent/10"
                disabled
              >
                Join Hyper+ waitlist
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="border-t border-border bg-muted/40 px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-8 text-center font-display text-3xl font-semibold tracking-tight">
            Feature Comparison
          </h2>
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                    Hyper+
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-6 py-4 text-sm text-foreground/80">
                    Recipe browsing
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-herb" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-herb" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-foreground/80">
                    Save & favorite recipes
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-herb" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-herb" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-foreground/80">
                    Collections
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-muted-foreground">
                    Limited
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-herb" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-foreground/80">
                    Meal planning
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-muted-foreground">
                    Limited
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-herb" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-foreground/80">
                    Smart shopping lists
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-muted-foreground">—</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-herb" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-foreground/80">
                    AI recipe customization
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-muted-foreground">—</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-herb" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-foreground/80">
                    Pantry mode
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-muted-foreground">—</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-herb" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-foreground/80">
                    Advanced recommendations
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-muted-foreground">—</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-herb" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-foreground/80">
                    Skill trees & analytics
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-muted-foreground">—</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="outline" className="text-xs">
                      Planned
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center font-display text-3xl font-semibold tracking-tight">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="premium-live"
              className="rounded-lg border border-border bg-card px-6"
            >
              <AccordionTrigger className="text-left">
                Is Hyper+ available yet?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Not yet! We&apos;re still building the premium features. Hyper+
                is coming soon, and we&apos;ll let you know as soon as it&apos;s
                ready. Early users will get priority access when we launch.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="free-forever"
              className="rounded-lg border border-border bg-card px-6"
            >
              <AccordionTrigger className="text-left">
                Will the free tier always be available?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! The free tier will always remain available. We believe
                everyone should have access to great recipes and cooking tools.
                Hyper+ is about unlocking additional power features, not
                removing what&apos;s already free.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="early-access"
              className="rounded-lg border border-border bg-card px-6"
            >
              <AccordionTrigger className="text-left">
                How do I get early access to Hyper+?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Join the waitlist when it becomes available! Early users and
                active community members will be the first to know when Hyper+
                launches. We&apos;re building this with you in mind.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="pricing-final"
              className="rounded-lg border border-border bg-card px-6"
            >
              <AccordionTrigger className="text-left">
                Is the $6/month pricing final?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                The pricing shown is a placeholder and subject to change.
                We&apos;re still finalizing the exact features and pricing
                structure. We&apos;ll announce the final pricing before launch,
                and early users may receive special introductory pricing.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-primary px-4 py-16">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="mb-4 font-display text-3xl font-semibold tracking-tight text-primary-foreground">
            Ready to start cooking?
          </h2>
          <p className="mb-8 text-primary-foreground/70">
            Join thousands of home cooks discovering new recipes every day
          </p>
          <SignedOut>
            <Button
              size="lg"
              className="h-12 px-8 text-[15px] font-medium"
              asChild
            >
              <SignInButton mode="modal">Sign up free</SignInButton>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-primary-foreground/20 bg-transparent px-8 text-[15px] font-medium text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/">Continue to app</Link>
            </Button>
          </SignedIn>
        </div>
      </section>
    </div>
  );
}
