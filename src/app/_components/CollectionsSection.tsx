import { Suspense } from "react";
import Link from "next/link";
import { CollectionCard } from "./CollectionCard";
import { ArrowRight } from "lucide-react";
import { CreateCollectionDialog } from "./CreateCollectionDialog";

type CollectionsSectionProps = {
  collections: Collection[];
};

/**
 * Collections section for logged-in users.
 * Shows horizontal scroll of collections or minimal empty state.
 * @param collections - Array of user's collections
 */
export function CollectionsSection({
  collections,
}: CollectionsSectionProps): JSX.Element {
  if (!collections || collections.length === 0) {
    return (
      <section id="collections" className="py-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
            Your Collections
          </h2>
          <CreateCollectionDialog />
        </div>
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 py-8 dark:border-neutral-800 dark:bg-neutral-900/50">
          <p className="text-[15px] text-neutral-500 dark:text-neutral-400">
            No collections yet — create one to organize your recipes
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="collections" className="py-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
          Your Collections
        </h2>
        <div className="flex items-center gap-2">
          <CreateCollectionDialog buttonText="Create" />
          <Link
            href="/collections"
            className="flex items-center gap-1 text-[14px] font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            See all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {collections.slice(0, 5).map((collection) => (
          <div key={collection.id} className="w-[280px] shrink-0">
            <Suspense fallback={<CollectionCardSkeleton />}>
              <CollectionCard collection={collection} />
            </Suspense>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Skeleton loader for collection card.
 */
export function CollectionCardSkeleton(): JSX.Element {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-neutral-200/60 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="relative aspect-[4/3] animate-pulse bg-neutral-100 dark:bg-neutral-800" />
      <div className="p-5">
        <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
        <div className="mb-2 h-4 w-full animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
      </div>
    </div>
  );
}

