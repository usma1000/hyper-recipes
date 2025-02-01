import { NextPage } from "next";
import CreateRecipeForm from "./_components/CreateRecipeForm";
// import { getAllTagNames } from "~/server/queries";

// import { useRouter } from "next/navigation";
// import { UploadButton } from "~/utils/uploadthing";

const NewRecipePage: NextPage = async () => {
  // const rawTags = await getAllTagNames();
  // const allTags = rawTags.map((tag) => ({
  //   value: tag.id.toString(),
  //   label: tag.name,
  // }));
  // const router = useRouter();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-8">Add New Recipe</h1>
      <CreateRecipeForm />
    </div>
  );
};

export default NewRecipePage;
