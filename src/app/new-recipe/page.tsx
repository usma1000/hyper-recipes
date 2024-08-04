import { NextPage } from "next";
import CreateRecipeForm from "./_components/CreateRecipeForm";

// import { useRouter } from "next/navigation";
// import { UploadButton } from "~/utils/uploadthing";

const NewRecipePage: NextPage = () => {
  // const router = useRouter();

  return (
    <div>
      <h1 className="mb-8">Add New Recipe</h1>
      <CreateRecipeForm />
    </div>
  );
};

export default NewRecipePage;
