import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function RecipeCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="relative h-48">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-6">
        <Skeleton className="mb-2 h-4 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </div>
    </Card>
  );
}
