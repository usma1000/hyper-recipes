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
    <div className="flex items-center justify-center gap-8 py-6 md:gap-16">
      {STATS.map((stat) => (
        <div key={stat.label} className="flex items-center gap-2 text-slate-600">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            {stat.icon}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

