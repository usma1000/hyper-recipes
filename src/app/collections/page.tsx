import { Suspense } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { fetchMyCollections } from "../_actions/collections";
import { CollectionCardSkeleton } from "../_components/CollectionsSection";
import { CreateCollectionDialog } from "../_components/CreateCollectionDialog";
import { CollectionCardWithActions } from "./_components/CollectionCardWithActions";

/**
 * Collections page displaying all user's collections.
 * Redirects to home if user is not signed in.
 */
export default async function CollectionsPage(): Promise<JSX.Element> {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const collections = await fetchMyCollections();

  return (
    <>
      <SignedOut>
        <div className="container py-8">
          <p className="text-center text-muted-foreground">
            Please sign in to view your collections.
          </p>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="container py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground dark:text-foreground">
                Your Collections
              </h1>
              <p className="mt-2 text-[15px] text-muted-foreground dark:text-muted-foreground">
                {collections.length === 0
                  ? "You haven't created any collections yet."
                  : `${collections.length} ${collections.length === 1 ? "collection" : "collections"}`}
              </p>
            </div>
            <CreateCollectionDialog />
          </div>

          {collections.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/50 dark:border-border dark:bg-card/50">
              <p className="text-[15px] text-muted-foreground dark:text-muted-foreground">
                No collections yet
              </p>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }, (_, i) => (
                    <CollectionCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {collections.map((collection) => (
                  <CollectionCardWithActions
                    key={collection.id}
                    collection={collection}
                  />
                ))}
              </div>
            </Suspense>
          )}
        </div>
      </SignedIn>
    </>
  );
}
