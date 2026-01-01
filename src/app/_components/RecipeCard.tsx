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
      className="group block h-full overflow-hidden rounded-2xl border border-neutral-200/60 bg-white transition-all duration-200 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:shadow-neutral-950/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
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
            <Soup size={48} className="text-neutral-300 dark:text-neutral-600" />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="mb-2 text-[17px] font-semibold leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-700 dark:text-white dark:group-hover:text-neutral-200">
          {recipe.name}
        </h3>
        <p className="line-clamp-2 text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          {recipe.description}
        </p>
      </div>
    </Link>
  );
}

export default RecipeCard;
