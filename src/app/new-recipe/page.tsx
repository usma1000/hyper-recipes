import { NextPage } from "next";
import MultiStepForm from "./_components/MultiStepForm";

// import { useRouter } from "next/navigation";
// import { UploadButton } from "~/utils/uploadthing";

const NewRecipePage: NextPage = () => {
  // const router = useRouter();

  return (
    <div>
      <h1>Add New Recipe</h1>
      <MultiStepForm />
    </div>
  );
};

export default NewRecipePage;
