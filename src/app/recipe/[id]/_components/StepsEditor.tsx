"use client";

import {
  EditorContent,
  type JSONContent,
  type EditorInstance,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandList,
  EditorCommandItem,
} from "novel";
import { useState } from "react";
import { defaultExtensions } from "./extensions";
import { useDebouncedCallback } from "use-debounce";
import { slashCommand, suggestionItems } from "./slash-command";
import { useParams } from "next/navigation";
import { onSaveSteps } from "./actions";
import { useUser } from "@clerk/nextjs";
import { handleCommandNavigation } from "novel/extensions";

const extensions = [...defaultExtensions, slashCommand];

export default function Editor({ steps }: { steps: JSONContent }) {
  const [initialContent, setInitialContent] = useState<JSONContent>(steps);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState();

  const { isSignedIn } = useUser();

  const { id } = useParams();

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      setCharsCount(editor.storage.characterCount.words());
      await onSaveSteps(Number(id), json);
      return setSaveStatus("Saved");
    },
    500,
  );

  if (!initialContent)
    setInitialContent({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "There are no steps for this one." }],
        },
      ],
    });

  return (
    <div className="relative w-full">
      {isSignedIn && (
        <div className="absolute -top-14 right-0 z-10 mb-5 flex gap-2">
          <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
            {saveStatus}
          </div>
          <div
            className={
              charsCount
                ? "rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground"
                : "hidden"
            }
          >
            {charsCount} Words
          </div>
        </div>
      )}
      <EditorContent
        initialContent={initialContent}
        extensions={extensions}
        onUpdate={({ editor }) => {
          debouncedUpdates(editor);
          setSaveStatus("Unsaved");
        }}
        editable={isSignedIn}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          attributes: {
            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
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
