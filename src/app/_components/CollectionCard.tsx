import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Soup } from "lucide-react";

type CollectionCardProps = {
  collection: Collection;
};

/**
 * Collection card component displaying collection with cover image.
 * Uses first recipe's hero image as cover, or placeholder if empty.
 * @param collection - The collection to display
 */
export function CollectionCard({
  collection,
}: CollectionCardProps): JSX.Element {
  const firstRecipe = collection.recipes[0]?.recipe;
  const recipeCount = collection.recipes.length;

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group block h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-foreground/15 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {firstRecipe?.heroImage?.url ? (
          <Image
            src={firstRecipe.heroImage.url}
            alt={firstRecipe.heroImage.name}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Soup size={48} className="text-muted-foreground/40" />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="mb-2 font-display text-[17px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
          {collection.title}
        </h3>
        {collection.description && (
          <p className="mb-2 line-clamp-2 text-[14px] leading-relaxed text-muted-foreground">
            {collection.description}
          </p>
        )}
        <p className="text-[13px] text-muted-foreground">
          {recipeCount} {recipeCount === 1 ? "recipe" : "recipes"}
        </p>
      </div>
    </Link>
  );
}
