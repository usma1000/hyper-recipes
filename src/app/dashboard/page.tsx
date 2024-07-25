import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateTagsForm from "./_components/CreateTagsForm";
import DeleteTagsForm from "./_components/DeleteTagsForm";
import { getAllTagNames } from "~/server/queries";

export default async function Page() {
  const rawTags = await getAllTagNames();
  const allTags = rawTags.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

  return (
    <div className="flex flex-col gap-8">
      <h1>Dashboard</h1>
      <div className="flex gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Tag</CardTitle>
            <CardDescription>
              Create a new tag of type "Cuisine" or "Meal" which can be applied
              to a recipe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateTagsForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Delete a Tag</CardTitle>
            <CardDescription>
              Delete a tag that is no longer needed. This will remove the tag
              from all recipes that it is applied.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteTagsForm tags={allTags} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
