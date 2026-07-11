"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import AchievementBadge from "./_components/AchievementBadge";
import { fetchBadgeCatalog } from "~/app/_actions/gamification";
import { BADGE_DEFINITIONS } from "~/server/gamification/badgeDefinitions";

type BadgeRow = {
  name: string;
  description: string;
  isEarned: boolean;
  category: string;
  imagePath: string;
};

/**
 * Badge catalog page showing earned vs locked badges from the shared definitions.
 */
export default function BadgesPage(): JSX.Element {
  const { user, isLoaded } = useUser();
  const [badges, setBadges] = useState<BadgeRow[]>(
    BADGE_DEFINITIONS.map((badge) => ({
      name: badge.name,
      description: badge.description,
      category: badge.category,
      imagePath: badge.imagePath,
      isEarned: false,
    })),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!isLoaded) return;
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const catalog = await fetchBadgeCatalog();
        setBadges(catalog);
      } catch (error) {
        console.error("Failed to load badge catalog:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, [user, isLoaded]);

  const groupedBadges = badges.reduce(
    (acc, badge) => {
      if (!acc[badge.category]) {
        acc[badge.category] = [];
      }
      acc[badge.category]!.push(badge);
      return acc;
    },
    {} as Record<string, BadgeRow[]>,
  );

  return (
    <div className="container space-y-12 py-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold">Badges</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isLoading
            ? "Loading your badges..."
            : user
              ? "Earn badges by logging cooks and exploring the kitchen."
              : "Sign in to see which badges you have earned."}
        </p>
      </div>

      {Object.entries(groupedBadges).map(([category, categoryBadges]) => (
        <section key={category}>
          <h2 className="mb-6 text-2xl font-bold">{category}</h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
            {categoryBadges.map((badge) => (
              <div
                key={badge.name}
                className="flex flex-col items-center gap-2"
              >
                <AchievementBadge
                  name={badge.name}
                  isEarned={badge.isEarned}
                  imagePath={badge.imagePath}
                  description={badge.description}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
