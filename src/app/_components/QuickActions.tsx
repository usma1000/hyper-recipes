"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { PlusCircle, Heart, Trophy } from "lucide-react";
import { cn } from "~/lib/utils";

type QuickAction = {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  variant: "primary" | "default";
  adminOnly?: boolean;
};

const ACTIONS: QuickAction[] = [
  {
    href: "/new-recipe",
    icon: <PlusCircle className="h-5 w-5" />,
    label: "Add Recipe",
    description: "Create new",
    variant: "primary",
    adminOnly: true,
  },
  {
    href: "/#favorites",
    icon: <Heart className="h-5 w-5" />,
    label: "Favorites",
    description: "Your saved",
    variant: "default",
  },
  {
    href: "/kitchen-journey",
    icon: <Trophy className="h-5 w-5" />,
    label: "Journey",
    description: "Your progress",
    variant: "default",
  },
];

/**
 * Quick actions row for logged-in users.
 * Provides fast access to primary user tasks.
 */
export function QuickActions(): JSX.Element {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const visibleActions = ACTIONS.filter(
    (action) => !action.adminOnly || isAdmin
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-3">
      {visibleActions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-150",
            action.variant === "primary"
              ? "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
          )}
        >
          {action.icon}
          <div>
            <p className="text-[14px] font-medium">{action.label}</p>
            <p
              className={cn(
                "text-[12px]",
                action.variant === "primary"
                  ? "text-neutral-400 dark:text-neutral-500"
                  : "text-neutral-500 dark:text-neutral-400"
              )}
            >
              {action.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
