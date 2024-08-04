import React, { Fragment } from "react";
import clsx from "clsx";
import { Check } from "lucide-react";
import { Separator } from "~/components/ui/separator";

type StepperIndicatorProps = {
  activeStep: number;
  maxSteps: number;
};

function StepperIndicator({ activeStep, maxSteps }: StepperIndicatorProps) {
  const steps = Array.from({ length: maxSteps }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center">
      {steps.map((step) => (
        <Fragment key={step}>
          <div
            className={clsx(
              "m-2 flex h-10 w-10 items-center justify-center rounded-full border-[2px]",
              step < activeStep && "bg-primary text-white",
              step === activeStep && "border-primary text-primary",
            )}
          >
            {step >= activeStep ? step : <Check size={16} />}
          </div>
          {step !== maxSteps && (
            <Separator
              orientation="horizontal"
              className={clsx(
                "h-[2px] w-24 bg-gray-200",
                step <= activeStep - 1 && "bg-primary",
              )}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}

export default StepperIndicator;
