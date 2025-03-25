import { cn } from "~/lib/utils";

interface AchievementBadgeProps {
  name: string;
  isEarned: boolean;
  svg: React.ReactNode;
  description: string;
  className?: string;
}

export default function AchievementBadge({
  name,
  isEarned,
  svg,
  description,
  className,
}: AchievementBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "relative h-24 w-24 overflow-hidden rounded-full transition-all",
          !isEarned && "opacity-30 grayscale",
          className,
        )}
      >
        {svg}
      </div>
      <span
        className={cn("text-sm font-medium", !isEarned && "text-slate-500")}
      >
        {name}
      </span>
      <span className="text-center text-sm text-slate-500">{description}</span>
    </div>
  );
}
