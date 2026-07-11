/**
 * Subtle product nudge footer for logged-in homepage.
 * Encourages users to save tweaks and notes without being pushy.
 */
export function FooterMicroCTA(): JSX.Element {
  return (
    <div className="mt-12 flex flex-col items-center justify-center py-8 text-center">
      <p className="text-[15px] font-medium text-foreground/80 dark:text-muted-foreground/40">
        Pro tip: Save your best tweaks.
      </p>
      <p className="mt-1 text-[13px] text-muted-foreground dark:text-muted-foreground">
        Hyper Recipes gets better when you keep your swaps and notes.
      </p>
    </div>
  );
}

