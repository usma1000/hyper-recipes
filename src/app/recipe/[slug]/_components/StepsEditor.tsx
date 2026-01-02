"use client";

import {
  EditorContent,
  type JSONContent,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandList,
  EditorCommandItem,
} from "novel";
import { useState, useMemo, useRef } from "react";
import { defaultExtensions } from "./extensions";
import { slashCommand, suggestionItems } from "./slash-command";
import { onSaveSteps } from "./actions";
import { handleCommandNavigation } from "novel/extensions";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X } from "lucide-react";

const extensions = [...defaultExtensions, slashCommand];

const DEFAULT_CONTENT: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "There are no steps for this one." }],
    },
  ],
};

interface StepsEditorProps {
  recipeId: number;
  steps: JSONContent;
}

export default function StepsEditor({
  recipeId,
  steps,
}: StepsEditorProps): JSX.Element {
  const { user, isLoaded } = useUser();
  const isAdmin = isLoaded && user?.publicMetadata?.role === "admin";
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editorKey, setEditorKey] = useState<number>(0);
  const editorContentRef = useRef<JSONContent | null>(null);

  const initialContent = useMemo<JSONContent>(() => {
    return steps ?? DEFAULT_CONTENT;
  }, [steps]);

  const handleEdit = (): void => {
    editorContentRef.current = null;
    setIsEditing(true);
    setEditorKey((prev) => prev + 1);
  };

  const handleDiscard = (): void => {
    editorContentRef.current = null;
    setIsEditing(false);
    setEditorKey((prev) => prev + 1);
  };

  const handleSave = async (): Promise<void> => {
    if (!editorContentRef.current) return;

    setIsSaving(true);
    await onSaveSteps(recipeId, JSON.stringify(editorContentRef.current));
    setIsSaving(false);
    setIsEditing(false);
  };

  if (!isLoaded) {
    return (
      <div className="prose-headings:font-title font-default prose prose-lg max-w-full animate-pulse dark:prose-invert">
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="mt-2 h-4 w-full rounded bg-slate-200" />
        <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {isAdmin && (
        <div className="absolute -top-[74px] right-0 z-10 mb-5 flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDiscard}
                disabled={isSaving}
              >
                <X className="mr-1 h-4 w-4" />
                Discard
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="mr-1 h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      )}
      <EditorContent
        key={editorKey}
        immediatelyRender={false}
        initialContent={initialContent}
        extensions={extensions}
        onUpdate={({ editor }) => {
          editorContentRef.current = editor.getJSON();
        }}
        editable={isEditing}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          attributes: {
            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full [&_h3:not(:first-child)]:mt-4`,
          },
        }}
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command && item.command(val)}
                className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>
      </EditorContent>
    </div>
  );
}
