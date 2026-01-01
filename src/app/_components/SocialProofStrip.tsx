import { BookOpen, ListChecks, Heart } from "lucide-react";

type StatItem = {
  icon: React.ReactNode;
  value: string;
  label: string;
};

const STATS: StatItem[] = [
  {
    icon: <BookOpen className="h-5 w-5" />,
    value: "500+",
    label: "Recipes",
  },
  {
    icon: <ListChecks className="h-5 w-5" />,
    value: "Easy",
    label: "Step-by-step",
  },
  {
    icon: <Heart className="h-5 w-5" />,
    value: "Save",
    label: "Your favorites",
  },
];

/**
 * Minimal social proof strip for anonymous users.
 * Reinforces value without heavy marketing copy.
 */
export function SocialProofStrip(): JSX.Element {
  return (
    <div className="flex items-center justify-center gap-12 border-y border-neutral-100 py-8 dark:border-neutral-800 md:gap-20">
      {STATS.map((stat) => (
        <div key={stat.label} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            {stat.icon}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-neutral-900 dark:text-white">{stat.value}</p>
            <p className="text-[13px] text-neutral-400 dark:text-neutral-500">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
