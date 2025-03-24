import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Soup } from "lucide-react";

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="h-full overflow-hidden transition-all hover:-translate-y-1 hover:cursor-pointer hover:shadow-md">
      <Link href={`/recipe/${recipe.slug}`}>
        <div className="relative h-48">
          {recipe.heroImage?.url ? (
            <Image
              src={recipe.heroImage.url}
              alt={recipe.heroImage.name}
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 250px"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-200">
              <Soup size={64} className="m-auto text-gray-400" />
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle>{recipe.name}</CardTitle>
          <CardDescription>{recipe.description}</CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
}

export default RecipeCard;
