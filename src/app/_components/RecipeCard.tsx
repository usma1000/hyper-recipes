import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Soup } from "lucide-react";

/**
 * Recipe card component with refined visual styling.
 * Features subtle hover states, refined shadows, and clean typography.
 */
function RecipeCard({ recipe }: { recipe: Recipe }): JSX.Element {
  return (
    <Link
      href={`/recipe/${recipe.slug}`}
      className="group block h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-foreground/15 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {recipe.heroImage?.url ? (
          <Image
            src={recipe.heroImage.url}
            alt={recipe.heroImage.name}
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
          {recipe.name}
        </h3>
        <p className="line-clamp-2 text-[14px] leading-relaxed text-muted-foreground">
          {recipe.description}
        </p>
      </div>
    </Link>
  );
}

export default RecipeCard;
