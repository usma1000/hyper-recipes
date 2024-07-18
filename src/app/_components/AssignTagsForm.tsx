"use client";

import { useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";

export default function AssignTagsForm({
  allTags,
}: {
  allTags: { value: string; label: string }[];
}) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <form>
      <MultiSelect
        options={allTags}
        onValueChange={setSelectedTags}
        defaultValue={selectedTags}
        placeholder="Select tags"
        className="mb-4"
      />
      <Button type="submit">Apply</Button>
    </form>
  );
}
