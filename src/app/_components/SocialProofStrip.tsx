/**
 * Light credibility section for anonymous users.
 * Minimal design reinforcing the product-first approach.
 */
export function SocialProofStrip(): JSX.Element {
  return (
    <div className="rounded-2xl border border-neutral-200/60 bg-neutral-50 px-8 py-10 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
      <p className="text-lg font-medium text-neutral-900 dark:text-white">
        Built for home cooks who want better results—not more scrolling.
      </p>
      <p className="mt-2 text-[14px] text-neutral-500 dark:text-neutral-400">
        Designed as a cooking tool first, not a content farm.
      </p>
    </div>
  );
}
