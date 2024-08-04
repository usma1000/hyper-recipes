"use client";

export function getStepContent(step: number) {
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
