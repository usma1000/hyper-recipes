import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";

/**
 * 404 Not Found page with back button.
 */
export default function NotFound(): JSX.Element {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16">
      <div className="text-center">
        <h1 className="font-display text-6xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">
          Page Not Found
        </h2>
        <p className="mt-2 text-[15px] text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className={buttonVariants({
              variant: "default",
              size: "default",
            })}
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
