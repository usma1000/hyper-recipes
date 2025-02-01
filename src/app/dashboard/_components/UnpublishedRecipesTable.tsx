import Link from "next/link";
import { RecipeWithoutHeroImage } from "~/server/queries";

interface UnpublishedRecipesTableProps {
  recipes: RecipeWithoutHeroImage[];
}

const UnpublishedRecipesTable: React.FC<UnpublishedRecipesTableProps> = ({
  recipes,
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Recipe Name
          </th>
          <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Date Created
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {recipes.map((recipe) => (
          <tr key={recipe.id}>
            <td className="whitespace-nowrap px-6 py-4">
              <Link
                href={`/recipe/${recipe.id}`}
                className="text-primary underline"
              >
                {recipe.name}
              </Link>
            </td>
            <td className="whitespace-nowrap px-6 py-4">
              {recipe.createdAt
                ? new Date(recipe.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UnpublishedRecipesTable;
