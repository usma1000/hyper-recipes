"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import StepperIndicator from "./StepperIndicator";
import clsx from "clsx";

type MultiStepFormProps = {
  maxSteps: number;
  getContentByNumber: (step: number) => React.ReactNode;
};

function MultiStepForm({ maxSteps, getContentByNumber }: MultiStepFormProps) {
  const [activeStep, setActiveStep] = React.useState(1);

  function handleNext() {
    if (activeStep === maxSteps) {
      // TODO: Handle form submission
      return;
    }
    setActiveStep(activeStep + 1);
  }

  return (
    <div className="flex flex-col gap-8">
      <StepperIndicator activeStep={activeStep} maxSteps={maxSteps} />
      {getContentByNumber(activeStep)}
      <div
        className={clsx(
          "flex gap-4",
          activeStep === 1 ? "justify-end" : "justify-between",
        )}
      >
        {activeStep > 1 && (
          <Button
            onClick={() => setActiveStep(activeStep - 1)}
            variant="secondary"
          >
            Back
          </Button>
        )}
        <Button onClick={handleNext}>
          {activeStep === maxSteps ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
}

export default MultiStepForm;
