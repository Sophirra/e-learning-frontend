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
import React, { useEffect, useState } from "react";

export type SelectableItem = { name: string; value: string };

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
  items: SelectableItem[];
  /** Callback when selection changes (always returns array, even if single select) */
  onSelectionChange?: (selected: SelectableItem[]) => void;
  /** Enable selecting multiple values */
  multiselect?: boolean;
  /** Show search bar */
  searchable?: boolean;
  /** Show reset button */
  reset?: boolean;
  disabled?: boolean;
  icon?: React.ComponentType<any>;
  /** key of the default items */
  defaultValues?: string[];
  className?: string;
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
  disabled = false,
  defaultValues = undefined,
  icon: Icon,
  className,
}: FilterDropdownProps) {
  const [selectedValues, setSelectedValues] = useState<SelectableItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSelect = (selected: SelectableItem) => {
    console.log("Selected:", selected);
    let newSelection: SelectableItem[];

    if (multiselect) {
      // toggle wybór
      newSelection = selectedValues.find((v) => v.value === selected.value)
        ? selectedValues.filter((v) => v.value !== selected.value)
        : [...selectedValues, selected];
    } else {
      // pojedynczy wybór
      newSelection = selectedValues.find((v) => v.value === selected.value)
        ? []
        : [selected];
      setOpen(false);
    }

    setSelectedValues(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleReset = () => {
    setSelectedValues([]);
    onSelectionChange?.([]);
  };

  useEffect(() => {
    if (!loaded) {
      if (defaultValues) {
        console.log("defaultValues", defaultValues);
        console.log("items", items);
        setSelectedValues(
          items.filter((item) => defaultValues.includes(item.value)),
        );
        if (selectedValues.length === defaultValues.length) {
          setLoaded(true);
        }
      }
    }
  }, [items]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {(label || reset) && (
        <div className="flex items-center justify-between gap-2 h-6">
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
              disabled={disabled}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn("min-w-[180px] w-full justify-start", className)}
            >
              {Icon ? <Icon /> : null}
              {selectedValues.length > 0
                ? multiselect
                  ? `${selectedValues.length} selected`
                  : selectedValues[0].name
                : placeholder}
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent className={cn("min-w-[180px] p-0", className)}>
          <Command>
            {searchable && <CommandInput placeholder={searchPlaceholder} />}
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => handleSelect(item)}
                >
                  <icons.Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.some((v) => v.value === item.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
