import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import { RecipeWithoutHeroImage } from "~/server/queries";

interface UnpublishedRecipesTableProps {
  recipes: RecipeWithoutHeroImage[];
}

const UnpublishedRecipesTable: React.FC<UnpublishedRecipesTableProps> = ({
  recipes,
}) => {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipe Name</TableHead>
              <TableHead>Date Created</TableHead>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UnpublishedRecipesTable;
