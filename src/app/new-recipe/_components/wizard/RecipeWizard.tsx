"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Save, FolderOpen, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  RecipeWizardSchema,
  WIZARD_STEPS,
  DEFAULT_WIZARD_VALUES,
  type RecipeWizardFormData,
  type WizardStepId,
} from "./types";
import { WizardBasics } from "./WizardBasics";
import { WizardIngredients } from "./WizardIngredients";
import { WizardSteps } from "./WizardSteps";
import { WizardDifficulty } from "./WizardDifficulty";
import { WizardPreview } from "./WizardPreview";
import { WizardPublish } from "./WizardPublish";
import { submitRecipeWizard, saveDraft } from "./actions";
import {
  saveDraftToStorage,
  loadDraftFromStorage,
  getAllDrafts,
  deleteDraftFromStorage,
  formatDraftDate,
  type DraftMetadata,
} from "./draftUtils";

type TagOption = {
  id: number;
  name: string;
  tagType: string;
};

type IngredientOption = {
  id: number;
  name: string;
};

interface RecipeWizardProps {
  availableTags: TagOption[];
  availableIngredients: IngredientOption[];
}

/**
 * Multi-step recipe authoring wizard.
 * Implements the v2 authoring flow: Basics -> Ingredients -> Steps -> Difficulty -> Preview -> Publish
 * @param availableTags - Available tags for recipe categorization
 * @param availableIngredients - Available ingredients for autocomplete
 */
export function RecipeWizard({
  availableTags,
  availableIngredients,
}: RecipeWizardProps): JSX.Element {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [drafts, setDrafts] = useState<DraftMetadata[]>([]);
  const [showDraftDialog, setShowDraftDialog] = useState(false);

  const form = useForm<RecipeWizardFormData>({
    resolver: zodResolver(RecipeWizardSchema),
    defaultValues: DEFAULT_WIZARD_VALUES,
    mode: "onChange",
  });

  // Load drafts on mount
  useEffect(() => {
    setDrafts(getAllDrafts());
  }, []);

  const {
    formState: { isSubmitting, isDirty },
    trigger,
    getValues,
  } = form;

  const currentStep = WIZARD_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === WIZARD_STEPS.length - 1;
  const progress = ((currentStepIndex + 1) / WIZARD_STEPS.length) * 100;

  /**
   * Validates the current step fields before proceeding.
   * @returns True if validation passes
   */
  async function validateCurrentStep(): Promise<boolean> {
    const stepId = currentStep?.id;
    if (!stepId) return true;

    switch (stepId) {
      case "basics":
        return await trigger(["name", "description"]);
      case "ingredients":
        return await trigger("ingredients");
      case "steps":
        return await trigger("steps");
      case "difficulty":
        return await trigger(["easyVariation", "hardVariation"]);
      default:
        return true;
    }
  }

  /**
   * Handles navigation to the next step.
   */
  async function handleNext(): Promise<void> {
    const isValid = await validateCurrentStep();
    if (!isValid) {
      toast.error("Please fix the errors before continuing");
      return;
    }

    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }

  /**
   * Handles navigation to the previous step.
   */
  function handleBack(): void {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }

  /**
   * Handles clicking on a step indicator to jump to that step.
   * @param index - The step index to navigate to
   */
  async function handleStepClick(index: number): Promise<void> {
    // Only allow going to previous steps or current step
    if (index <= currentStepIndex) {
      setCurrentStepIndex(index);
      return;
    }

    // Validate current step before allowing forward navigation
    const isValid = await validateCurrentStep();
    if (isValid && index === currentStepIndex + 1) {
      setCurrentStepIndex(index);
    }
  }

  /**
   * Saves the current form data as a draft.
   */
  async function handleSaveDraft(): Promise<void> {
    setIsSaving(true);
    try {
      const data = getValues();
      // Save to localStorage
      saveDraftToStorage(data, currentStepIndex);
      // Also call server action for compatibility
      await saveDraft(data);
      toast.success("Draft saved successfully");
      // Refresh drafts list
      setDrafts(getAllDrafts());
    } catch (error) {
      toast.error("Failed to save draft");
      console.error("Save draft error:", error);
    } finally {
      setIsSaving(false);
    }
  }

  /**
   * Loads a draft and populates the form.
   * @param draftId - The draft ID to load
   */
  function handleLoadDraft(draftId: string): void {
    const draft = loadDraftFromStorage(draftId);
    if (!draft) {
      toast.error("Draft not found");
      return;
    }

    form.reset(draft.data);
    setCurrentStepIndex(draft.metadata.step);
    setShowDraftDialog(false);
    toast.success(`Loaded draft: ${draft.metadata.name}`);
  }

  /**
   * Deletes a draft.
   * @param draftId - The draft ID to delete
   */
  function handleDeleteDraft(draftId: string): void {
    deleteDraftFromStorage(draftId);
    setDrafts(getAllDrafts());
    toast.success("Draft deleted");
  }

  /**
   * Handles final form submission.
   * @param data - The complete form data
   */
  async function onSubmit(data: RecipeWizardFormData): Promise<void> {
    try {
      const result = await submitRecipeWizard(data);
      if (result.success && result.slug) {
        toast.success("Recipe created successfully!");
        router.push(`/recipe/${result.slug}`);
      } else {
        toast.error(result.error ?? "Failed to create recipe");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Submit error:", error);
    }
  }

  /**
   * Renders the current step content.
   */
  function renderStepContent(): JSX.Element {
    const stepId = currentStep?.id;

    switch (stepId) {
      case "basics":
        return <WizardBasics availableTags={availableTags} />;
      case "ingredients":
        return (
          <WizardIngredients
            availableIngredients={availableIngredients}
            onIngredientsUpdated={(updated) => {
              // Ingredients list can be updated when new ones are created
            }}
          />
        );
      case "steps":
        return <WizardSteps />;
      case "difficulty":
        return <WizardDifficulty />;
      case "preview":
        return <WizardPreview />;
      case "publish":
        return <WizardPublish onPublish={form.handleSubmit(onSubmit)} />;
      default:
        return <div>Unknown step</div>;
    }
  }

  return (
    <FormProvider {...form}>
      <div className="mx-auto max-w-4xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="mt-4 flex justify-between">
            {WIZARD_STEPS.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepClick(index)}
                disabled={index > currentStepIndex + 1}
                className={`flex flex-col items-center text-xs transition-colors ${
                  index === currentStepIndex
                    ? "text-primary font-semibold"
                    : index < currentStepIndex
                      ? "text-muted-foreground hover:text-primary cursor-pointer"
                      : "text-muted-foreground/50 cursor-not-allowed"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 mb-1 ${
                    index === currentStepIndex
                      ? "border-primary bg-primary text-primary-foreground"
                      : index < currentStepIndex
                        ? "border-primary bg-primary/10"
                        : "border-muted"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="hidden sm:block">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{currentStep?.title}</h2>
          <p className="text-muted-foreground">{currentStep?.description}</p>
        </div>

        {/* Step content */}
        <Card>
          <CardContent className="pt-6">
            {isSubmitting ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
                <span className="ml-2">Saving recipe...</span>
              </div>
            ) : (
              renderStepContent()
            )}
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isFirstStep || isSubmitting}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>

            <Dialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline">
                  <FolderOpen className="mr-1 h-4 w-4" />
                  Load Draft
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Saved Drafts</DialogTitle>
                  <DialogDescription>
                    Select a draft to resume editing, or delete drafts you no
                    longer need.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 space-y-2 overflow-y-auto">
                  {drafts.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No saved drafts yet. Save your progress to create a draft.
                    </p>
                  ) : (
                    drafts.map((draft) => (
                      <div
                        key={draft.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{draft.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Step {draft.step + 1}: {WIZARD_STEPS[draft.step]?.title ?? "Unknown"} • {formatDraftDate(draft.lastSaved)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleLoadDraft(draft.id)}
                          >
                            Load
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteDraft(draft.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {isDirty && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleSaveDraft}
                disabled={isSaving || isSubmitting}
              >
                <Save className="mr-1 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>
            )}
          </div>

          {!isLastStep && (
            <Button type="button" onClick={handleNext} disabled={isSubmitting}>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </FormProvider>
  );
}

