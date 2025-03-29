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
  imagePath: string;
};

const badges: Badge[] = [
  // Basic Check-In Badges
  {
    name: "First Cook",
    description: "Check in your first recipe",
    isEarned: true,
    category: "Basic Check-In Badges",
    imagePath: "/badges/first-cook.png",
  },
  {
    name: "Five-Star Chef",
    description: "Check in 5 recipes",
    isEarned: false,
    category: "Basic Check-In Badges",
    imagePath: "/badges/five-star-chef.png",
  },
  {
    name: "Recipe Master",
    description: "Check in 10 recipes",
    isEarned: false,
    category: "Basic Check-In Badges",
    imagePath: "/badges/recipe-master.png",
  },
  {
    name: "Kitchen Warrior",
    description: "Check in 25 recipes",
    isEarned: false,
    category: "Basic Check-In Badges",
    imagePath: "/badges/kitchen-warrior.png",
  },
  {
    name: "Culinary Legend",
    description: "Check in 50+ recipes",
    isEarned: false,
    category: "Basic Check-In Badges",
    imagePath: "/badges/culinary-legend.png",
  },

  // Photo Badges
  {
    name: "Food Photographer",
    description: "Upload a photo for 1 check-in",
    isEarned: false,
    category: "Photo Badges",
    imagePath: "/badges/food-photographer.png",
  },
  {
    name: "Shutter Chef",
    description: "Upload photos for 10 check-ins",
    isEarned: false,
    category: "Photo Badges",
    imagePath: "/badges/shutter-chef.png",
  },
  {
    name: "Instagram-Worthy",
    description: "Upload high-rated photos",
    isEarned: false,
    category: "Photo Badges",
    imagePath: "/badges/instagram-worthy.png",
  },

  // Streak Badges
  {
    name: "Weekend Warrior",
    description: "Cook 2 days in a row",
    isEarned: false,
    category: "Cooking Streak Badges",
    imagePath: "/badges/weekend-warrior.png",
  },
  {
    name: "One-Week Streak",
    description: "Cook 7 days in a row",
    isEarned: false,
    category: "Cooking Streak Badges",
    imagePath: "/badges/one-week-streak.png",
  },
  {
    name: "Iron Chef",
    description: "Cook 30 days in a row",
    isEarned: false,
    category: "Cooking Streak Badges",
    imagePath: "/badges/iron-chef.png",
  },

  // Cuisine Badges
  {
    name: "Italian Explorer",
    description: "Cook 3 Italian recipes",
    isEarned: true,
    category: "Cuisine Badges",
    imagePath: "/badges/italian-explorer.png",
  },
  {
    name: "Masala Master",
    description: "Cook 3 Indian recipes",
    isEarned: true,
    category: "Cuisine Badges",
    imagePath: "/badges/masala-master.png",
  },
  {
    name: "Sushi Sensei",
    description: "Cook 3 Japanese recipes",
    isEarned: true,
    category: "Cuisine Badges",
    imagePath: "/badges/sushi-sensei.png",
  },
  {
    name: "Taco Titan",
    description: "Cook 3 Mexican recipes",
    isEarned: false,
    category: "Cuisine Badges",
    imagePath: "/badges/taco-titan.png",
  },
  {
    name: "Mediterranean Maven",
    description: "Cook 3 Mediterranean recipes",
    isEarned: false,
    category: "Cuisine Badges",
    imagePath: "/badges/mediterranean-maven.png",
  },
  {
    name: "Global Gourmet",
    description: "Cook 10+ recipes from different cuisines",
    isEarned: false,
    category: "Cuisine Badges",
    imagePath: "/badges/global-gourmet.png",
  },

  // Ingredient Badges
  {
    name: "Garlic Lover",
    description: "Cook 5 recipes with garlic",
    isEarned: false,
    category: "Ingredient Badges",
    imagePath: "/badges/garlic-lover.png",
  },
  {
    name: "Spicy Adventurer",
    description: "Cook 3 spicy dishes",
    isEarned: true,
    category: "Ingredient Badges",
    imagePath: "/badges/spicy-adventurer.png",
  },
  {
    name: "Sweet Tooth",
    description: "Cook 3 dessert recipes",
    isEarned: false,
    category: "Ingredient Badges",
    imagePath: "/badges/sweet-tooth.png",
  },

  // Challenge Badges
  {
    name: "Speed Chef",
    description: "Cook a recipe in under 15 minutes",
    isEarned: false,
    category: "Challenge Badges",
    imagePath: "/badges/speed-chef.png",
  },
  {
    name: "Clean Cook",
    description: "Check in a recipe with zero spills",
    isEarned: false,
    category: "Challenge Badges",
    imagePath: "/badges/clean-cook.png",
  },
  {
    name: "Dinner Party Pro",
    description: "Cook a meal for 4+ people",
    isEarned: false,
    category: "Challenge Badges",
    imagePath: "/badges/dinner-party-pro.png",
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
