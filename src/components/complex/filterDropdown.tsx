import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { cn } from "@/lib/utils.ts";
import { useState } from "react";

/**
 * A dropdown component with filtering capabilities.
 * Allows users to select a single option from a list of items with search functionality.
 */
interface FilterDropdownProps {
  /** The label displayed above the dropdown */
  label?: string;
  /** The placeholder text shown when no value is selected */
  placeholder: string;
  /** The placeholder text shown in the search input */
  searchPlaceholder?: string;
  /** The message shown when no items match the search criteria */
  emptyMessage: string;
  /** Array of items to be displayed in the dropdown */
  items: string[];
  /** Optional callback when selection changes */
  onSelectionChange?: (selected: string[]) => void;
  multiselect?: boolean;
  searchable?: boolean;
  reset?: boolean;
}

/**
 * FilterDropdown component that combines a popover with command palette for filtered selection
 */

export function FilterDropdown({
  label,
  placeholder,
  searchPlaceholder = "search",
  emptyMessage,
  items,
  onSelectionChange,
  multiselect = true,
  searchable = true,
  reset = true,
}: FilterDropdownProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  let handleSelect = (selected: string) => {
    let newSelection: string[];
    if (multiselect) {
      newSelection = selectedValues.includes(selected)
        ? selectedValues.filter((v) => v !== selected)
        : [...selectedValues, selected];
      setSelectedValues(newSelection);
    } else {
      newSelection = selectedValues.includes(selected) ? [] : [selected];
      setOpen(false);
    }
    setSelectedValues(newSelection);
    onSelectionChange(newSelection);
  };

  return (
    <div className="flex flex-col gap-2">
      {(label || reset) && (
        <div className="flex items-center justify-between gap-2 h-9">
          {label && <Label>{label}</Label>}
          {reset && selectedValues.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedValues([]);
                onSelectionChange?.([]);
              }}
            >
              <icons.Reset className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex gap-2">
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[180px] justify-between"
            >
              {selectedValues.length > 0
                ? multiselect
                  ? `${selectedValues.length} selected`
                  : selectedValues[0]
                : placeholder}
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-[180px] p-0">
          <Command>
            {searchable && <CommandInput placeholder={searchPlaceholder} />}
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem key={item} onSelect={(item) => handleSelect(item)}>
                  <icons.Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(item)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
