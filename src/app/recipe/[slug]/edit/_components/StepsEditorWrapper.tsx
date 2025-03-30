"use client";

import { EditorRoot } from "novel";
import StepsEditor from "../../_components/StepsEditor";

export default function StepsEditorWrapper({
  steps,
  recipeId,
}: {
  steps: any;
  recipeId: number;
}) {
  return (
    <EditorRoot>
      <StepsEditor steps={steps} isAdmin={true} recipeId={recipeId} />
    </EditorRoot>
  );
}
