import { Zap } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white py-4 text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50">
      <div className="container flex items-center justify-between font-semibold">
        <Link href="/" className="text-md flex align-middle font-semibold">
          <Zap size={16} />
          Hyper Recipes
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm font-normal">
            © {currentYear} Hyper Recipes. All rights reserved.{" "}
            <Link href="/" className="underline">
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link href="/" className="underline">
              Terms and Conditions
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
