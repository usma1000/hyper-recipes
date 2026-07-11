export interface BadgeDefinition {
  name: string;
  description: string;
  category: string;
  /** Minimum total check-in count required to earn this badge. Null if not count-based. */
  checkInThreshold: number | null;
  imagePath: string;
}

export const CHECK_IN_XP = 10;

/**
 * Badge catalog. Check-in count badges are awarded automatically on save.
 * Other categories are defined for display but not auto-awarded yet.
 */
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    name: "First Cook",
    description: "Check in your first recipe",
    category: "Basic Check-In Badges",
    checkInThreshold: 1,
    imagePath: "/badges/first-cook.png",
  },
  {
    name: "Five-Star Chef",
    description: "Check in 5 recipes",
    category: "Basic Check-In Badges",
    checkInThreshold: 5,
    imagePath: "/badges/five-star-chef.png",
  },
  {
    name: "Recipe Master",
    description: "Check in 10 recipes",
    category: "Basic Check-In Badges",
    checkInThreshold: 10,
    imagePath: "/badges/recipe-master.png",
  },
  {
    name: "Kitchen Warrior",
    description: "Check in 25 recipes",
    category: "Basic Check-In Badges",
    checkInThreshold: 25,
    imagePath: "/badges/kitchen-warrior.png",
  },
  {
    name: "Culinary Legend",
    description: "Check in 50+ recipes",
    category: "Basic Check-In Badges",
    checkInThreshold: 50,
    imagePath: "/badges/culinary-legend.png",
  },
  {
    name: "Food Photographer",
    description: "Upload a photo for 1 check-in",
    category: "Photo Badges",
    checkInThreshold: null,
    imagePath: "/badges/food-photographer.png",
  },
  {
    name: "Shutter Chef",
    description: "Upload photos for 10 check-ins",
    category: "Photo Badges",
    checkInThreshold: null,
    imagePath: "/badges/shutter-chef.png",
  },
  {
    name: "Instagram-Worthy",
    description: "Upload high-rated photos",
    category: "Photo Badges",
    checkInThreshold: null,
    imagePath: "/badges/instagram-worthy.png",
  },
  {
    name: "Weekend Warrior",
    description: "Cook 2 days in a row",
    category: "Cooking Streak Badges",
    checkInThreshold: null,
    imagePath: "/badges/weekend-warrior.png",
  },
  {
    name: "One-Week Streak",
    description: "Cook 7 days in a row",
    category: "Cooking Streak Badges",
    checkInThreshold: null,
    imagePath: "/badges/one-week-streak.png",
  },
  {
    name: "Iron Chef",
    description: "Cook 30 days in a row",
    category: "Cooking Streak Badges",
    checkInThreshold: null,
    imagePath: "/badges/iron-chef.png",
  },
];

/**
 * Returns check-in count badges the user qualifies for at a given total.
 * @param checkInCount - Total cooking sessions for the user
 * @returns Badge definitions that meet the threshold
 */
export function getEarnedCheckInBadges(
  checkInCount: number,
): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter(
    (badge) =>
      badge.checkInThreshold !== null && checkInCount >= badge.checkInThreshold,
  );
}
