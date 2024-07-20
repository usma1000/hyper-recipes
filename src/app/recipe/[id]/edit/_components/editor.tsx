"use client";

import {
  EditorRoot,
  EditorContent,
  type JSONContent,
  type EditorInstance,
} from "novel";
import { useEffect, useState } from "react";
import { defaultExtensions } from "./extensions";
import { defaultEditorContent } from "./content";
import { useDebouncedCallback } from "use-debounce";

const extensions = [...defaultExtensions];

export default function Editor() {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    null,
  );
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState();

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      setCharsCount(editor.storage.characterCount.words());
      window.localStorage.setItem("novel-content", JSON.stringify(json));
      setSaveStatus("Saved");
    },
    500,
  );

  useEffect(() => {
    const content = window.localStorage.getItem("novel-content");
    if (content) {
      setInitialContent(JSON.parse(content));
    } else setInitialContent(defaultEditorContent);
  }, []);

  if (!initialContent) return null;

  return (
    <div className="relative w-full max-w-screen-lg">
      <div className="absolute right-5 top-5 z-10 mb-5 flex gap-2">
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
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
          }}
          className="relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
          editorProps={{
            attributes: {
              class:
                "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
        />
      </EditorRoot>
    </div>
  );
}
