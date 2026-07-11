import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

/**
 * Compact upsell strip promoting Pro features.
 * Displays value proposition with CTA linking to pricing page.
 * Renders for both anonymous and logged-in users on the homepage.
 */
export function UpsellStrip(): JSX.Element {
  return (
    <div className="border-b border-border/60 bg-herb-muted/60 py-3">
      <div className="container mx-auto flex flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between sm:gap-4">
        <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
          <p className="text-sm font-medium text-foreground sm:text-base">
            Unlock Pro: meal planning, smarter swaps, and premium features.
          </p>
          <p className="hidden text-xs text-muted-foreground md:block">
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
