"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import StepperIndicator from "./StepperIndicator";

type MultiStepFormProps = {
  maxSteps: number;
  getContentByNumber: (step: number) => React.ReactNode;
};

function MultiStepForm({ maxSteps, getContentByNumber }: MultiStepFormProps) {
  const [activeStep, setActiveStep] = React.useState(1);

  return (
    <div>
      <StepperIndicator activeStep={activeStep} maxSteps={maxSteps} />
      {getContentByNumber(activeStep)}
      <div className="flex justify-between gap-4">
        <Button
          onClick={() => setActiveStep(activeStep - 1)}
          disabled={activeStep === 1}
        >
          Back
        </Button>
        <Button
          onClick={() => setActiveStep(activeStep + 1)}
          disabled={activeStep === maxSteps}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default MultiStepForm;
