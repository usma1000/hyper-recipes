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
      {/* Anonymous Homepage Loading */}
      <SignedOut>
        <div className="flex flex-col">
          {/* Compact Hero Skeleton */}
          <section className="relative flex min-h-[300px] w-full items-center justify-center overflow-hidden bg-neutral-50 px-4 py-16 dark:bg-neutral-900">
            <div
              className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-200/30 to-orange-100/20 blur-3xl dark:from-amber-500/10 dark:to-orange-500/5" />
            <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tl from-orange-200/25 to-amber-100/15 blur-3xl dark:from-orange-500/10 dark:to-amber-500/5" />

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
            {/* Recipe Grid with Category Pills Skeleton */}
            <section>
              <div className="mb-8">
                <Skeleton className="mb-1 h-6 w-48" />
                <Skeleton className="mb-5 h-4 w-64" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-9 w-20 rounded-full" />
                  ))}
                </div>
              </div>
              <RecipeGridSkeleton count={9} />
            </section>

            {/* Featured Recipe Spotlight Skeleton */}
            <section className="overflow-hidden rounded-2xl border border-neutral-200/60 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <Skeleton className="aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 md:aspect-auto md:min-h-[320px]" />
                <div className="flex flex-col justify-center p-8 md:p-10">
                  <Skeleton className="mb-3 h-3 w-32" />
                  <Skeleton className="mb-3 h-8 w-3/4 md:h-9" />
                  <Skeleton className="mb-8 h-16 w-full" />
                  <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
              </div>
            </section>

            {/* Social Proof Strip Skeleton */}
            <div className="flex items-center justify-center gap-12 border-y border-neutral-100 py-8 dark:border-neutral-800 md:gap-20">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div>
                    <Skeleton className="mb-1 h-4 w-12" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer CTA Skeleton */}
            <section className="relative overflow-hidden rounded-2xl bg-neutral-900 px-8 py-12 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/50 via-transparent to-neutral-950/30" />
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <div className="relative z-10">
                <Skeleton className="mx-auto mb-3 h-8 w-80 max-w-full md:h-9" />
                <Skeleton className="mx-auto mb-8 h-4 w-64 max-w-full" />
                <Skeleton className="mx-auto h-12 w-32 rounded-xl bg-white/20" />
              </div>
            </section>
          </div>
        </div>
      </SignedOut>

      {/* Logged-In Homepage Loading */}
      <SignedIn>
        <div className="container space-y-6 py-6">
          {/* Greeting Bar Skeleton */}
          <div className="flex items-center justify-between py-6">
            <div>
              <Skeleton className="mb-1 h-8 w-64 md:h-9" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 dark:border-neutral-800 dark:bg-neutral-900">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="hidden sm:block">
                <Skeleton className="mb-1 h-4 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>

          {/* Favorites Section Skeleton */}
          <FavoritesSectionSkeleton />

          {/* Recipe Grid with Category Pills Skeleton */}
          <section>
            <div className="mb-8">
              <Skeleton className="mb-1 h-6 w-48" />
              <Skeleton className="mb-5 h-4 w-64" />
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-9 w-20 rounded-full" />
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
