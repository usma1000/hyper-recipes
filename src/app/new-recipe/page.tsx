import { NextPage } from "next";
import MultiStepForm from "./_components/MultiStepForm";
import { getStepContent } from "./_components/functions";

// import { useRouter } from "next/navigation";
// import { UploadButton } from "~/utils/uploadthing";

const MAX_STEPS = 4;

const NewRecipePage: NextPage = () => {
  // const router = useRouter();

  return (
    <div>
      <h1 className="mb-8">Add New Recipe</h1>
      <MultiStepForm maxSteps={MAX_STEPS} getContentByNumber={getStepContent} />
    </div>
  );
};

export default NewRecipePage;
