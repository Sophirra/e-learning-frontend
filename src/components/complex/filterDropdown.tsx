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
  /** Callback when selection changes (always returns array, even if single select) */
  onSelectionChange?: (selected: string[]) => void;
  /** Enable selecting multiple values */
  multiselect?: boolean;
  /** Show search bar */
  searchable?: boolean;
  /** Show reset button */
  reset?: boolean;
}

export function FilterDropdown({
                                 label,
                                 placeholder,
                                 searchPlaceholder = "Search...",
                                 emptyMessage,
                                 items,
                                 onSelectionChange,
                                 multiselect = true,
                                 searchable = true,
                                 reset = true,
                               }: FilterDropdownProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleSelect = (selected: string) => {
    let newSelection: string[];

    if (multiselect) {
      // toggle wybór
      newSelection = selectedValues.includes(selected)
          ? selectedValues.filter((v) => v !== selected)
          : [...selectedValues, selected];
    } else {
      // pojedynczy wybór
      newSelection = selectedValues.includes(selected) ? [] : [selected];
      setOpen(false);
    }

    setSelectedValues(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleReset = () => {
    setSelectedValues([]);
    onSelectionChange?.([]);
  };

  return (
      <div className="flex flex-col gap-2">
        {(label || reset) && (
            <div className="flex items-center justify-between gap-2 h-9">
              {label && <Label>{label}</Label>}
              {reset && selectedValues.length > 0 && (
                  <Button variant="ghost" size="icon" onClick={handleReset}>
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
              {searchable && (
                  <CommandInput placeholder={searchPlaceholder} />
              )}
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                    <CommandItem key={item} onSelect={() => handleSelect(item)}>
                      <icons.Check
                          className={cn(
                              "mr-2 h-4 w-4",
                              selectedValues.includes(item)
                                  ? "opacity-100"
                                  : "opacity-0"
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
