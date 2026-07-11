import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/80 bg-background py-6 text-foreground">
      <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-medium"
        >
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-sm bg-accent transition-transform duration-300 group-hover:scale-125"
          />
          <span className="font-display tracking-tight">Hyper Recipes</span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-sm font-normal text-muted-foreground">
            © {currentYear} Hyper Recipes.{" "}
            <Link
              href="/pricing"
              className="underline decoration-border underline-offset-4 hover:text-foreground"
            >
              Pricing
            </Link>{" "}
            ·{" "}
            <Link
              href="/privacy"
              className="underline decoration-border underline-offset-4 hover:text-foreground"
            >
              Privacy
            </Link>{" "}
            ·{" "}
            <Link
              href="/terms"
              className="underline decoration-border underline-offset-4 hover:text-foreground"
            >
              Terms
            </Link>
          </span>
          <ModeToggle />
        </div>
      </div>
    </footer>
  );
}
