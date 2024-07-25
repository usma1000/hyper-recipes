import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="h-48 rounded-xl" />
      <div className="space-y-1.5 p-6">
        <Skeleton className="h-6" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    </div>
  );
}
