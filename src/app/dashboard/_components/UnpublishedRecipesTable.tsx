"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { onPublishRecipe } from "~/app/recipe/[id]/_components/actions";
import { Button } from "~/components/ui/button";
import { RecipeWithoutHeroImage } from "~/server/queries";

interface UnpublishedRecipesTableProps {
  recipes: RecipeWithoutHeroImage[];
}

const UnpublishedRecipesTable: React.FC<UnpublishedRecipesTableProps> = ({
  recipes,
}) => {
  const router = useRouter();

  const handlePublish = async (recipeId: number) => {
    const result = await onPublishRecipe(recipeId, true);
    if (result.success) {
      toast.success(
        <div>
          Recipe published successfully.{" "}
          <Link href={`/recipe/${recipeId}`} className="text-primary underline">
            View Recipe
          </Link>
        </div>,
      );
      router.refresh();
    } else {
      toast.error("Failed to publish recipe");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Recipe Name</TableHead>
          <TableHead>Date Created</TableHead>
          <TableHead>Publish</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recipes.map((recipe) => (
          <TableRow key={recipe.id}>
            <TableCell className="whitespace-nowrap">
              <Link
                href={`/recipe/${recipe.id}`}
                className="text-primary underline"
              >
                {recipe.name}
              </Link>
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {recipe.createdAt
                ? new Date(recipe.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              <Button onClick={() => handlePublish(recipe.id)}>Publish</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UnpublishedRecipesTable;
