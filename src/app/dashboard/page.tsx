import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateTagsForm from "./_components/CreateTagsForm";

export default async function Page() {
  return (
    <div className="flex flex-col gap-8">
      <h1>Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create New Tag</CardTitle>
          <CardDescription>
            Create a new tag of type "Cuisine" or "Meal" which can be applied to
            a recipe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTagsForm />
        </CardContent>
      </Card>
    </div>
  );
}
