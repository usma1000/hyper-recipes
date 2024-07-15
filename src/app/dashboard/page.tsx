import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateTagsForm from "./_components/CreateTagsForm";
import { getAllRecipeNames } from "~/server/queries";

export default async function Page() {
  const recipeNames = await getAllRecipeNames();

  return (
    <div className="flex flex-col gap-8">
      <h1>Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Assign a Tag</CardTitle>
          <CardDescription>
            Select a recipe and choose the type of tag to assign it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTagsForm recipeNames={recipeNames} />
        </CardContent>
      </Card>
    </div>
  );
}
