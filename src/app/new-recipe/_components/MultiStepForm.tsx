"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import StepperIndicator from "./StepperIndicator";

const MAX_STEPS = 3;

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
  const [activeStep, setActiveStep] = React.useState(1);

  return (
    <div>
      <StepperIndicator activeStep={activeStep} maxSteps={MAX_STEPS} />
      {getStepContent(activeStep)}
      <div className="flex justify-between gap-4">
        <Button
          onClick={() => setActiveStep(activeStep - 1)}
          disabled={activeStep === 1}
        >
          Back
        </Button>
        <Button
          onClick={() => setActiveStep(activeStep + 1)}
          disabled={activeStep === MAX_STEPS}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default MultiStepForm;
