import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      <h1>Browse Recipes</h1>

      {/* Favorites Section Skeleton */}
      <section>
        <h2>My favorites</h2>
        <p className="text-sm text-slate-500">
          You can save any recipe to your favorites by clicking the star icon.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </section>

      {/* Browse by Tag Section Skeleton */}
      <section>
        <h2>Browse by Tag</h2>
        <p className="text-sm text-slate-500">
          Discover recipes by cuisine, meal type, or dietary preference.
        </p>
        <div className="mt-4">
          <div className="mb-4 flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-20" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section Skeleton */}
      <section>
        <h2>Featured</h2>
        <p className="text-sm text-slate-500">
          Some of our favorites, hand picked for you.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </section>
    </div>
  );
}
