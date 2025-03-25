import AchievementBadge from "./_components/AchievementBadge";
import {
  BakingLegendBadge,
  FirstRecipeBadge,
  SpicyMasterBadge,
} from "./_components/badges";

type Badge = {
  name: string;
  description: string;
  isEarned: boolean;
  category: string;
};

const badges: Badge[] = [
  // Basic Check-In Badges
  {
    name: "First Cook",
    description: "Check in your first recipe",
    isEarned: true,
    category: "Basic Check-In Badges",
  },
  {
    name: "Five-Star Chef",
    description: "Check in 5 recipes",
    isEarned: false,
    category: "Basic Check-In Badges",
  },
  {
    name: "Recipe Master",
    description: "Check in 10 recipes",
    isEarned: false,
    category: "Basic Check-In Badges",
  },
  {
    name: "Kitchen Warrior",
    description: "Check in 25 recipes",
    isEarned: false,
    category: "Basic Check-In Badges",
  },
  {
    name: "Culinary Legend",
    description: "Check in 50+ recipes",
    isEarned: false,
    category: "Basic Check-In Badges",
  },

  // Photo Badges
  {
    name: "Food Photographer",
    description: "Upload a photo for 1 check-in",
    isEarned: false,
    category: "Photo Badges",
  },
  {
    name: "Shutter Chef",
    description: "Upload photos for 10 check-ins",
    isEarned: false,
    category: "Photo Badges",
  },
  {
    name: "Instagram-Worthy",
    description: "Upload high-rated photos",
    isEarned: false,
    category: "Photo Badges",
  },

  // Streak Badges
  {
    name: "Weekend Warrior",
    description: "Cook 2 days in a row",
    isEarned: false,
    category: "Cooking Streak Badges",
  },
  {
    name: "One-Week Streak",
    description: "Cook 7 days in a row",
    isEarned: false,
    category: "Cooking Streak Badges",
  },
  {
    name: "Iron Chef",
    description: "Cook 30 days in a row",
    isEarned: false,
    category: "Cooking Streak Badges",
  },

  // Cuisine Badges
  {
    name: "Italian Explorer",
    description: "Cook 3 Italian recipes",
    isEarned: false,
    category: "Cuisine Badges",
  },
  {
    name: "Sushi Sensei",
    description: "Cook 3 Japanese recipes",
    isEarned: true,
    category: "Cuisine Badges",
  },
  {
    name: "Taco Titan",
    description: "Cook 3 Mexican recipes",
    isEarned: false,
    category: "Cuisine Badges",
  },
  {
    name: "Mediterranean Maven",
    description: "Cook 3 Mediterranean recipes",
    isEarned: false,
    category: "Cuisine Badges",
  },
  {
    name: "Global Gourmet",
    description: "Cook 10+ recipes from different cuisines",
    isEarned: false,
    category: "Cuisine Badges",
  },

  // Ingredient Badges
  {
    name: "Garlic Lover",
    description: "Cook 5 recipes with garlic",
    isEarned: false,
    category: "Ingredient Badges",
  },
  {
    name: "Spicy Adventurer",
    description: "Cook 3 spicy dishes",
    isEarned: true,
    category: "Ingredient Badges",
  },
  {
    name: "Sweet Tooth",
    description: "Cook 3 dessert recipes",
    isEarned: false,
    category: "Ingredient Badges",
  },

  // Challenge Badges
  {
    name: "Speed Chef",
    description: "Cook a recipe in under 15 minutes",
    isEarned: false,
    category: "Challenge Badges",
  },
  {
    name: "Clean Cook",
    description: "Check in a recipe with zero spills",
    isEarned: false,
    category: "Challenge Badges",
  },
  {
    name: "Dinner Party Pro",
    description: "Cook a meal for 4+ people",
    isEarned: false,
    category: "Challenge Badges",
  },
];

export default function BadgesPage() {
  // Group badges by category
  const groupedBadges = badges.reduce(
    (acc, badge) => {
      if (!acc[badge.category]) {
        acc[badge.category] = [];
      }
      (acc[badge.category] as Badge[]).push(badge);
      return acc;
    },
    {} as Record<string, Badge[]>,
  );

  return (
    <div className="container space-y-12 py-8">
      {Object.entries(groupedBadges).map(([category, categoryBadges]) => (
        <section key={category}>
          <h2 className="mb-6 text-2xl font-bold">{category}</h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {categoryBadges.map((badge) => (
              <div
                key={badge.name}
                className="flex flex-col items-center gap-2"
              >
                <AchievementBadge
                  name={badge.name}
                  isEarned={badge.isEarned}
                  svg={<FirstRecipeBadge />} // Temporary: reusing existing SVG
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
