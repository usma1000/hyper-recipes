"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { PlusCircle, Heart, Trophy, Search } from "lucide-react";
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
    icon: <PlusCircle className="h-6 w-6" />,
    label: "Add Recipe",
    description: "Create new",
    variant: "primary",
    adminOnly: true,
  },
  {
    href: "/#favorites",
    icon: <Heart className="h-6 w-6" />,
    label: "Favorites",
    description: "Your saved",
    variant: "default",
  },
  {
    href: "/kitchen-journey",
    icon: <Trophy className="h-6 w-6" />,
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
    <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
      {visibleActions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:scale-[1.02]",
            action.variant === "primary"
              ? "bg-amber-600 text-white hover:bg-amber-700"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          )}
        >
          {action.icon}
          <div>
            <p className="font-medium">{action.label}</p>
            <p
              className={cn(
                "text-xs",
                action.variant === "primary"
                  ? "text-amber-100"
                  : "text-slate-500"
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

