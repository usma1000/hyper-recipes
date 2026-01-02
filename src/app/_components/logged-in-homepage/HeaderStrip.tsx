"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Top header strip for the logged-in homepage.
 * Shows greeting with exact spec copy and Create Recipe button.
 */
export function HeaderStrip(): JSX.Element {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white md:text-3xl">
          What are you cooking today?
        </h1>
        <p className="mt-1 text-[15px] text-neutral-500 dark:text-neutral-400">
          Pick something fast, or continue where you left off.
        </p>
      </div>

      {isAdmin && (
        <Link href="/new-recipe">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create recipe
          </Button>
        </Link>
      )}
    </div>
  );
}

