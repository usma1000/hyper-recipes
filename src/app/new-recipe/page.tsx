import { NextPage } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
// import { useRouter } from "next/navigation";
// import { UploadButton } from "~/utils/uploadthing";

const NewRecipePage: NextPage = () => {
  // const router = useRouter();

  return (
    <div className="space-y-6">
      <h1>Add New Recipe</h1>
      <p className="font-bold text-red-500">
        This is a plcaeholder form. It doesn't do anything yet.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Recipe Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Recipe Name</Label>
            <Input id="title" placeholder="Miso Ramen, French Omlette, etc." />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="A brief description of the recipe."
            />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input id="picture" type="file" />
          </div>
          {/* <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={() => {
          router.refresh();
        }}
      /> */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" placeholder="Japanese, Breakfast, etc." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="m-0 list-none">
            <li>
              <span className="inline-block rounded-sm bg-secondary px-4 py-1">
                1 cup flour
              </span>
            </li>
            <li>
              <span className="inline-block rounded-sm bg-secondary px-4 py-1">
                2 tbsp sugar
              </span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="items-end space-x-4 border-t p-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" placeholder="1 cup, 2 tbsp, etc." />
          </div>

          <div>
            <Label htmlFor="ingredient">Ingredient</Label>
            <Input id="ingredient" placeholder="Flour, Sugar, etc." />
          </div>

          <Button>Add Ingredient</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Preheat oven to 350 degrees</p>
          <p>Combine flour and sugar in a bowl</p>
        </CardContent>
      </Card>
      <Button className="self-start">Publish Recipe</Button>
    </div>
  );
};

export default NewRecipePage;
