import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { RecipeGridSkeleton } from "./_components/RecipeGrid";
import { FavoritesSectionSkeleton } from "./_components/FavoritesSection";

/**
 * Loading skeleton for homepage.
 * Matches the distinct layouts for anonymous and logged-in users.
 */
export default function Loading(): JSX.Element {
  return (
    <>
      <SignedOut>
        <div className="flex flex-col">
          <section className="relative flex min-h-[300px] w-full items-center justify-center overflow-hidden border-b border-border bg-background px-4 py-16">
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-herb-muted/40 to-transparent" />

            <div className="container relative z-10 mx-auto max-w-2xl text-center">
              <Skeleton className="mx-auto mb-4 h-10 w-3/4 sm:h-12" />
              <Skeleton className="mx-auto mb-8 h-5 w-2/3 max-w-md" />
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </section>

          <div className="container space-y-16 py-12">
            <section>
              <div className="mb-8">
                <Skeleton className="mb-1 h-6 w-48" />
                <Skeleton className="mb-5 h-4 w-64" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }, (_, i) => (
                    <Skeleton key={i} className="h-9 w-20 rounded-md" />
                  ))}
                </div>
              </div>
              <RecipeGridSkeleton count={9} />
            </section>

            <section className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <Skeleton className="aspect-[4/3] bg-muted md:aspect-auto md:min-h-[320px]" />
                <div className="flex flex-col justify-center p-8 md:p-10">
                  <Skeleton className="mb-3 h-3 w-32" />
                  <Skeleton className="mb-3 h-8 w-3/4 md:h-9" />
                  <Skeleton className="mb-8 h-16 w-full" />
                  <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
              </div>
            </section>

            <div className="rounded-2xl border border-border bg-muted/50 px-8 py-10">
              <Skeleton className="mx-auto mb-2 h-5 w-80 max-w-full" />
              <Skeleton className="mx-auto h-4 w-56 max-w-full" />
            </div>

            <section className="relative overflow-hidden rounded-2xl bg-primary px-8 py-12 text-center">
              <div className="relative z-10">
                <Skeleton className="mx-auto mb-3 h-8 w-80 max-w-full bg-primary-foreground/20 md:h-9" />
                <Skeleton className="mx-auto mb-8 h-4 w-64 max-w-full bg-primary-foreground/20" />
                <Skeleton className="mx-auto h-12 w-32 rounded-xl bg-card/20" />
              </div>
            </section>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="container space-y-6 py-6">
          <div className="flex items-center justify-between py-6">
            <div>
              <Skeleton className="mb-1 h-8 w-64 md:h-9" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-2.5">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="hidden sm:block">
                <Skeleton className="mb-1 h-4 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>

          <FavoritesSectionSkeleton />

          <section>
            <div className="mb-8">
              <Skeleton className="mb-1 h-6 w-48" />
              <Skeleton className="mb-5 h-4 w-64" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="h-9 w-20 rounded-md" />
                ))}
              </div>
            </div>
            <RecipeGridSkeleton count={9} />
          </section>
        </div>
      </SignedIn>
    </>
  );
}
