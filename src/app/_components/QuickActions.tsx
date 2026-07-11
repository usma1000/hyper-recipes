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
              ? "bg-primary text-white hover:bg-muted dark:bg-card dark:text-foreground dark:hover:bg-muted"
              : "border border-border bg-card text-foreground/80 hover:border-foreground/15 hover:bg-muted dark:border-border dark:bg-card dark:text-foreground dark:hover:border-border dark:hover:bg-muted"
          )}
        >
          {action.icon}
          <div>
            <p className="text-[14px] font-medium">{action.label}</p>
            <p
              className={cn(
                "text-[12px]",
                action.variant === "primary"
                  ? "text-muted-foreground dark:text-muted-foreground"
                  : "text-muted-foreground dark:text-muted-foreground"
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
