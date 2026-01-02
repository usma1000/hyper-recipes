"use client";

import { useState } from "react";
import { type JSONContent } from "novel";
import { ChevronDown, Lightbulb, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StepCard } from "./StepCard";
import { cn } from "~/lib/utils";

interface StepsListProps {
  steps: JSONContent | null;
  onStartCookMode: () => void;
}

/**
 * Extracts plain text steps from Novel editor JSON format.
 * @param content - Novel editor JSON content
 * @returns Array of step strings
 */
function extractStepsFromContent(content: JSONContent | null): string[] {
  if (!content?.content) return [];

  const steps: string[] = [];

  const extractText = (node: JSONContent): string => {
    if (node.type === "text" && node.text) {
      return node.text;
    }
    if (node.content) {
      return node.content.map(extractText).join("");
    }
    return "";
  };

  for (const node of content.content) {
    if (node.type === "orderedList" || node.type === "bulletList") {
      for (const item of node.content ?? []) {
        const text = extractText(item).trim();
        if (text) {
          steps.push(text);
        }
      }
    } else if (node.type === "paragraph" || node.type === "heading") {
      const text = extractText(node).trim();
      if (text && text !== "There are no steps for this one.") {
        steps.push(text);
      }
    }
  }

  return steps;
}

/**
 * Steps list with decision support callouts.
 * Parses Novel editor JSON and renders scannable step cards.
 * @param steps - Novel editor JSON content
 * @param onStartCookMode - Callback to enter cook mode
 */
export function StepsList({
  steps,
  onStartCookMode,
}: StepsListProps): JSX.Element {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showCommonFixes, setShowCommonFixes] = useState(false);
  const [showKeyCues, setShowKeyCues] = useState(false);

  const stepStrings = extractStepsFromContent(steps);

  const toggleStepCompletion = (index: number): void => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Steps</h2>
        <Button onClick={onStartCookMode}>Start Cook Mode</Button>
      </div>

      {stepStrings.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No steps available for this recipe.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {stepStrings.map((step, index) => (
            <StepCard
              key={index}
              stepNumber={index + 1}
              content={step}
              isCompleted={completedSteps.has(index)}
              onClick={() => toggleStepCompletion(index)}
            />
          ))}
        </div>
      )}

      <div className="mt-6 space-y-2">
        <Collapsible open={showCommonFixes} onOpenChange={setShowCommonFixes}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between font-normal"
            >
              <span className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Common fixes
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  showCommonFixes && "rotate-180"
                )}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pt-2">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Too thick? Add a splash of water.</li>
              <li>Too thin? Simmer 2-3 minutes longer.</li>
              <li>Too salty? Add acid or unsalted starch.</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={showKeyCues} onOpenChange={setShowKeyCues}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between font-normal"
            >
              <span className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Key cues
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  showKeyCues && "rotate-180"
                )}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pt-2">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Look for glossy sauce.</li>
              <li>Aromatics should be fragrant, not browned.</li>
              <li>Taste and adjust before serving.</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
}

export { extractStepsFromContent };

