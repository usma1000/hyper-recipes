import Image from "next/image";
import { cn } from "~/lib/utils";

interface AchievementBadgeProps {
  name: string;
  isEarned: boolean;
  imagePath: string;
  description: string;
  className?: string;
}

export default function AchievementBadge({
  name,
  isEarned,
  imagePath,
  description,
  className,
}: AchievementBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "relative h-48 w-48 transition-all",
          !isEarned && "opacity-30 grayscale",
          className,
        )}
      >
        <Image
          src={imagePath}
          alt={`${name} badge`}
          fill
          className="object-contain"
        />
      </div>
      <span
        className={cn("text-sm font-medium", !isEarned && "text-slate-500")}
      >
        {name}
      </span>
      <span className="text-center text-xs text-slate-500">{description}</span>
    </div>
  );
}
