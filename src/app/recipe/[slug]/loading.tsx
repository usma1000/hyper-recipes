import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function RecipeLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-8">
        {/* Left Column */}
        <div className="flex-grow-[1] basis-64">
          {/* Navigation */}
          <div className="mb-8 flex justify-between align-middle">
            <Button variant="default" size="sm" disabled>
              <ArrowLeft size={16} /> Back
            </Button>
            <Skeleton className="h-9 w-24" />
          </div>

          {/* Ingredients Card */}
          <div className="sticky top-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex grow-[999] basis-0 flex-col gap-8">
          {/* Recipe Card */}
          <Card>
            <CardHeader>
              {/* Hero Image */}
              <div className="relative mb-8 h-96">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>

              {/* Title and Description */}
              <div className="flex items-end gap-2">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-8 w-8" /> {/* Favorite button */}
              </div>
              <Skeleton className="h-4 w-full" />

              {/* Tags */}
              <div className="flex flex-row gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20" />
                ))}
              </div>
            </CardHeader>
          </Card>

          {/* Steps Card */}
          <Card>
            <CardHeader className="mb-4 border-b border-slate-200">
              <CardTitle as="h2" className="text-3xl">
                Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-64" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
