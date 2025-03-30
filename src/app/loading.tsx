import RecipeCardSkeleton from "./_components/RecipeCardSkeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col space-y-16 pb-16">
      {/* Hero Section Skeleton */}
      <section className="relative -mt-8 flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-b-3xl bg-gradient-to-r from-amber-50 to-orange-100 px-4 py-24 text-center md:px-8">
        <div className="container relative z-10 mx-auto max-w-4xl">
          <Skeleton className="mx-auto mb-6 h-12 w-3/4 md:h-16" />
          <Skeleton className="mx-auto mb-8 h-6 w-2/3" />
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              className="relative overflow-hidden border-2 border-amber-100"
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-100"></div>
              <CardHeader>
                <Skeleton className="mb-2 h-10 w-10" />
                <Skeleton className="mb-2 h-6 w-32" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Recipe Section Skeleton */}
      <section className="container">
        <div className="mb-8">
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <Skeleton className="h-64 md:h-auto" />
            <div className="flex flex-col justify-center p-8">
              <Skeleton className="mb-2 h-8 w-3/4" />
              <Skeleton className="mb-6 h-20 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </section>

      {/* Browse Recipes Section Skeleton */}
      <section className="container">
        <div className="mb-8">
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-slate-50 px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-9 w-36" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Browse by Tags Section Skeleton */}
      <section className="container">
        <div className="mb-8">
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="mt-6">
          {[...Array(2)].map((_, i) => (
            <Card
              key={i}
              className="mb-6 w-full overflow-hidden border-2 border-amber-50 shadow-sm"
            >
              <CardHeader className="bg-amber-50/50 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="mt-2 h-4 w-56" />
                  </div>
                  <Skeleton className="h-10 w-[200px]" />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {[...Array(3)].map((_, j) => (
                    <RecipeCardSkeleton key={j} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="container">
        <div className="overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white md:p-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <Skeleton className="mb-4 h-8 w-64 bg-white/30" />
              <Skeleton className="mb-8 h-16 w-full bg-white/30" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-10 w-32 bg-white/30" />
                <Skeleton className="h-10 w-32 bg-white/30" />
              </div>
            </div>
            <div className="hidden md:flex md:items-center md:justify-center">
              <div className="relative h-40 w-40 rounded-full border-4 border-white/30">
                <div className="absolute left-0 top-0 h-full w-full rounded-full bg-white/10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
