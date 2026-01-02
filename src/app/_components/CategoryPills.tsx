import { cn } from "~/lib/utils";
import { Globe, UtensilsCrossed, Leaf } from "lucide-react";

type Tag = {
  id: number;
  name: string;
  tagType: "Cuisine" | "Meal" | "Diet";
};

type CategoryPillsProps = {
  tags: Tag[];
  onSelect: (tagId: number | null) => void;
  selectedTagId?: number | null;
  showAllOption?: boolean;
};

/**
 * Horizontal scrollable row of category pills for filtering recipes.
 * Replaces the dropdown category selector for better discoverability.
 * @param tags - Array of tags to display as pills
 * @param onSelect - Callback when a tag is selected
 * @param selectedTagId - Currently selected tag ID
 * @param showAllOption - Whether to show an "All" pill (default: true)
 */
export function CategoryPills({
  tags,
  onSelect,
  selectedTagId = null,
  showAllOption = true,
}: CategoryPillsProps): JSX.Element {
  const getTagIcon = (tagType: string): JSX.Element | null => {
    const iconClass = "h-3.5 w-3.5 opacity-70";
    switch (tagType) {
      case "Cuisine":
        return <Globe className={iconClass} />;
      case "Meal":
        return <UtensilsCrossed className={iconClass} />;
      case "Diet":
        return <Leaf className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative -mx-1">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-1 pb-1">
        {showAllOption && (
          <button
            onClick={() => onSelect(null)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-150",
              selectedTagId === null
                ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white",
            )}
          >
            All Recipes
          </button>
        )}
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onSelect(tag.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-150",
              selectedTagId === tag.id
                ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white",
            )}
          >
            {getTagIcon(tag.tagType)}
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton loader for category pills.
 */
export function CategoryPillsSkeleton(): JSX.Element {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-800"
        />
      ))}
    </div>
  );
}
