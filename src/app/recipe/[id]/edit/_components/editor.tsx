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
  const [initialContent, setInitialContent] = useState<undefined | JSONContent>(
    undefined,
  );

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      window.localStorage.setItem("novel-content", JSON.stringify(json));
    },
    500,
  );

  useEffect(() => {
    const content = window.localStorage.getItem("novel-content");
    if (content) {
      setInitialContent(JSON.parse(content));
    } else setInitialContent(defaultEditorContent);
  }, []);

  return (
    <div>
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
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
