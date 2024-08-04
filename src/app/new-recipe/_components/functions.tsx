"use client";

import BasicInfoForm from "./BasicInfoForm";
import ImageForm from "./ImageForm";
import RecipeInstructionsForm from "./RecipeInstructionsForm";
import TagsAndIngredientsForm from "./TagsAndIngredientsForm";

export function getStepContent(step: number) {
  switch (step) {
    case 1:
      return <BasicInfoForm />;
    case 2:
      return <ImageForm />;
    case 3:
      return <TagsAndIngredientsForm />;
    case 4:
      return <RecipeInstructionsForm />;
    default:
      return <div>Unknown step</div>;
  }
}
