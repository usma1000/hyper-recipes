"use client";

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Sparkles, Zap } from "lucide-react";
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
      <section className="relative overflow-hidden border-b border-slate-200 bg-neutral-50 px-4 py-16 dark:border-slate-800 dark:bg-neutral-900">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute left-1/4 top-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-200/30 to-orange-100/20 blur-3xl dark:from-amber-500/10 dark:to-orange-500/5" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tl from-orange-200/25 to-amber-100/15 blur-3xl dark:from-orange-500/10 dark:to-amber-500/5" />

        <div className="container relative z-10 mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            Currently Free • Premium Coming Soon
          </Badge>
          <h1 className="mb-4 text-balance text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
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
          <Card className="relative flex flex-col border-2 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-2xl">Free</CardTitle>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-slate-500 dark:text-slate-400">
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
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Browse all recipes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Save & like recipes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Basic personalization (diet, dislikes)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Light gamification (XP, streaks)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Limited collections
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
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
          <Card className="relative flex flex-col border-2 border-amber-500/50 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:border-amber-500/30 dark:from-amber-950/20 dark:to-orange-950/10">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <CardTitle className="text-2xl">Hyper+</CardTitle>
                <Badge variant="secondary" className="ml-auto text-xs">
                  Coming Soon
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$6</span>
                <span className="text-slate-500 dark:text-slate-400">
                  /month
                </span>
              </div>
              <CardDescription className="mt-2 text-sm italic text-slate-600 dark:text-slate-400">
                *Pricing not final—subject to change
              </CardDescription>
              <CardDescription className="mt-2 text-base">
                Unlock the full potential of your kitchen
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Everything in Free
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-medium">Unlimited</span> meal planning
                    & collections
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Smart shopping lists
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    AI recipe customization (faster, swaps, vegan, macros)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    &quot;Cook with what I have&quot; pantry mode
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Advanced recommendations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-slate-400" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
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
                className="w-full rounded-xl border-amber-500/50 bg-amber-50/50 text-amber-900 hover:bg-amber-100/70 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-100 dark:hover:bg-amber-950/50"
                disabled
              >
                Join Hyper+ waitlist
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="border-t border-slate-200 bg-slate-50/50 px-4 py-16 dark:border-slate-800 dark:bg-slate-950/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-semibold tracking-tight">
            Feature Comparison
          </h2>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-50">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-slate-50">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-slate-50">
                    Hyper+
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                    Recipe browsing
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-400" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                    Save & favorite recipes
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-400" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                    Collections
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    Limited
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-400" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                    Meal planning
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    Limited
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-400" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                    Smart shopping lists
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400">—</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-400" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                    AI recipe customization
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400">—</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-400" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                    Pantry mode
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400">—</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-400" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                    Advanced recommendations
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400">—</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-400" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                    Skill trees & analytics
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-400">—</span>
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
          <h2 className="mb-8 text-center text-3xl font-semibold tracking-tight">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="premium-live"
              className="rounded-lg border border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <AccordionTrigger className="text-left">
                Is Hyper+ available yet?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-400">
                Not yet! We&apos;re still building the premium features. Hyper+
                is coming soon, and we&apos;ll let you know as soon as it&apos;s
                ready. Early users will get priority access when we launch.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="free-forever"
              className="rounded-lg border border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <AccordionTrigger className="text-left">
                Will the free tier always be available?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-400">
                Yes! The free tier will always remain available. We believe
                everyone should have access to great recipes and cooking tools.
                Hyper+ is about unlocking additional power features, not
                removing what&apos;s already free.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="early-access"
              className="rounded-lg border border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <AccordionTrigger className="text-left">
                How do I get early access to Hyper+?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-400">
                Join the waitlist when it becomes available! Early users and
                active community members will be the first to know when Hyper+
                launches. We&apos;re building this with you in mind.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="pricing-final"
              className="rounded-lg border border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <AccordionTrigger className="text-left">
                Is the $6/month pricing final?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-400">
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
      <section className="border-t border-slate-200 bg-neutral-900 px-4 py-16 dark:border-slate-800">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white">
            Ready to start cooking?
          </h2>
          <p className="mb-8 text-neutral-400">
            Join thousands of home cooks discovering new recipes every day
          </p>
          <SignedOut>
            <Button
              size="lg"
              className="h-12 rounded-xl bg-white px-8 text-[15px] font-medium text-neutral-900 shadow-lg transition-all hover:bg-neutral-100 hover:shadow-xl"
              asChild
            >
              <SignInButton mode="modal">Sign up free</SignInButton>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-white/20 bg-transparent px-8 text-[15px] font-medium text-white transition-all hover:bg-white/10"
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
