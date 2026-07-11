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

  const pillBase =
    "flex shrink-0 items-center gap-1.5 rounded-md px-4 py-2 text-[13px] font-medium transition-all duration-150";
  const pillActive = "bg-primary text-primary-foreground shadow-soft";
  const pillIdle =
    "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground";

  return (
    <div className="relative -mx-1">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-1 pb-1">
        {showAllOption && (
          <button
            onClick={() => onSelect(null)}
            className={cn(
              pillBase,
              selectedTagId === null ? pillActive : pillIdle,
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
              pillBase,
              selectedTagId === tag.id ? pillActive : pillIdle,
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
          className="h-9 w-24 shrink-0 animate-pulse rounded-md bg-muted"
        />
      ))}
    </div>
  );
}
