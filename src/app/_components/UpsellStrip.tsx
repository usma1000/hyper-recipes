import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

/**
 * Compact upsell strip promoting Pro features.
 * Displays value proposition with CTA linking to pricing page.
 * Renders for both anonymous and logged-in users on the homepage.
 */
export function UpsellStrip(): JSX.Element {
  return (
    <div className="border-b border-neutral-200/60 bg-neutral-50/80 py-3 dark:border-neutral-800 dark:bg-neutral-900/30">
      <div className="container mx-auto flex flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between sm:gap-4">
        <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
          <p className="text-sm font-medium text-neutral-900 dark:text-white sm:text-base">
            Unlock Pro: meal planning, smarter swaps, and premium features.
          </p>
          <p className="hidden text-xs text-neutral-500 dark:text-neutral-400 md:block">
            Monthly or annual. Cancel anytime.
          </p>
        </div>
        <Link
          href="/pricing"
          className={buttonVariants({
            variant: "default",
            size: "sm",
            className: "shrink-0",
          })}
        >
          View pricing
        </Link>
      </div>
    </div>
  );
}

