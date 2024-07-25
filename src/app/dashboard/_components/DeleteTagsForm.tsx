"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { onDeleteTagSubmit } from "./actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";

type PropTypes = {
  tags: {
    value: number;
    label: string;
  }[];
};

export const DeleteTagsFormSchema = z.object({
  tagId: z.number(),
});

export default function DeleteTagsForm({ tags }: PropTypes) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof DeleteTagsFormSchema>>({
    resolver: zodResolver(DeleteTagsFormSchema),
    defaultValues: {
      tagId: undefined,
    },
  });

  const {
    formState: { isLoading, isSubmitting, isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) {
      const tagName = tags.find(
        (tag) => tag.value === form.getValues("tagId"),
      )?.label;
      toast(`${tagName} successfully deleted.`);
      form.reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => onDeleteTagSubmit(e.tagId))}
        className="relative flex h-full flex-col justify-between gap-4"
      >
        {isLoading ||
          (isSubmitting && (
            <div className="absolute left-0 top-0 z-10 h-full w-full bg-white bg-opacity-50">
              <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                <LoadingSpinner />
              </div>
            </div>
          ))}
        <FormField
          control={form.control}
          name="tagId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tag to Delete</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="justify-between"
                    >
                      {field.value
                        ? tags.find((tag) => tag.value === field.value)?.label
                        : "Select a tag..."}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search tags..." />
                    <CommandList>
                      <CommandEmpty>No tags found...</CommandEmpty>
                      <CommandGroup>
                        {tags.map((tag) => (
                          <CommandItem
                            key={tag.value}
                            value={tag.label}
                            onSelect={() => {
                              form.setValue("tagId", tag.value);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === tag.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {tag.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the tag you would like to delete.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || isSubmitting}>
          Delete Tag
        </Button>
      </form>
    </Form>
  );
}
