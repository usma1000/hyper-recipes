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
        <h1 className="text-6xl font-bold text-neutral-900 dark:text-white">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-semibold text-neutral-700 dark:text-neutral-300">
          Page Not Found
        </h2>
        <p className="mt-2 text-[15px] text-neutral-500 dark:text-neutral-400">
          The page you're looking for doesn't exist.
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
