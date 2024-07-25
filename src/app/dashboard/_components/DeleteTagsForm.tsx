import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function DeleteTagsForm() {
  return (
    <>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a tag to delete" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Tag 1">Tag 1</SelectItem>
          <SelectItem value="Tag 2">Tag 2</SelectItem>
          <SelectItem value="Tag 3">Tag 3</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit">Delete Tag</Button>
    </>
  );
}
