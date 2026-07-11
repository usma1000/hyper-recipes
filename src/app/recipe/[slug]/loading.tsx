import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton matching the redesigned recipe page layout.
 */
export default function RecipeLoading(): JSX.Element {
  return (
    <div>
      <div className="relative h-[42vh] min-h-[280px] w-full bg-muted sm:h-[52vh] sm:min-h-[360px]">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute inset-x-0 bottom-0 container pb-8">
          <Skeleton className="mb-3 h-3 w-40 bg-background/30" />
          <Skeleton className="mb-3 h-12 w-2/3 max-w-xl bg-background/40" />
          <Skeleton className="h-4 w-1/2 max-w-md bg-background/30" />
        </div>
      </div>

      <div className="border-b border-border/80">
        <div className="container flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </div>

      <div className="container py-8 lg:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <aside className="w-full shrink-0 space-y-4 lg:w-80">
            <div className="rounded-2xl border border-border/70 p-5">
              <Skeleton className="mb-4 h-6 w-28" />
              <div className="space-y-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </aside>

          <main className="min-w-0 flex-1 space-y-4">
            <Skeleton className="h-8 w-32" />
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="rounded-2xl bg-card/40 p-5">
                <div className="flex gap-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-2 pt-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
