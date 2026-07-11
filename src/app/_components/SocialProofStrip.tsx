/**
 * Light credibility section for anonymous users.
 * Minimal design reinforcing the product-first approach.
 */
export function SocialProofStrip(): JSX.Element {
  return (
    <div className="rounded-2xl border border-border bg-muted/50 px-8 py-10 text-center">
      <p className="font-display text-lg font-medium text-foreground">
        Built for home cooks who want better results—not more scrolling.
      </p>
      <p className="mt-2 text-[14px] text-muted-foreground">
        Designed as a cooking tool first, not a content farm.
      </p>
    </div>
  );
}
