import { NextPage } from "next";
import CreateRecipeForm from "./_components/CreateRecipeForm";

// import { useRouter } from "next/navigation";
// import { UploadButton } from "~/utils/uploadthing";

const NewRecipePage: NextPage = () => {
  // const router = useRouter();

  return (
    <div>
      <h1>Add New Recipe</h1>
      <p className="font-bold text-red-500">
        This is a placeholder form. It doesn't do anything yet.
      </p>
      <CreateRecipeForm />
    </div>
  );
};

export default NewRecipePage;
