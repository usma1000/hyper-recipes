"use client";

import React from "react";
import { Button } from "@/components/ui/button";

function getStepContent(step: number) {
  switch (step) {
    case 1:
      return <div>Step 1</div>;
    case 2:
      return <div>Step 2</div>;
    case 3:
      return <div>Step 3</div>;
    default:
      return <div>Unknown step</div>;
  }
}

function MultiStepForm() {
  const [currentStep, setCurrentStep] = React.useState(1);

  return (
    <div>
      {getStepContent(currentStep)}
      <div className="flex justify-between gap-4">
        <Button
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1}
        >
          Back
        </Button>
        <Button onClick={() => setCurrentStep(currentStep + 1)}>Next</Button>
      </div>
    </div>
  );
}

export default MultiStepForm;
