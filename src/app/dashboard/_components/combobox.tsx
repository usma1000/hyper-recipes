"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "~/lib/utils";
import { CommandList } from "cmdk";
import { FormControl } from "../../../components/ui/form";

export function Combobox({
  defaultValue,
  recipeNames,
  form,
}: {
  defaultValue: number;
  recipeNames: {
    id: number;
    name: string;
  }[];
  form: any;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<number | null>(defaultValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {value
              ? recipeNames.find((recipe) => recipe.id === value)?.name
              : "Select a recipe..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search recipes..." />
          <CommandList>
            <CommandEmpty>No recipes found.</CommandEmpty>
            <CommandGroup>
              {recipeNames.map((recipe) => (
                <CommandItem
                  key={recipe.id}
                  value={recipe.id.toString()}
                  onSelect={(currentValue) => {
                    setValue(parseInt(currentValue));
                    form.setValue("recipeId", parseInt(currentValue));
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === recipe.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {recipe.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
