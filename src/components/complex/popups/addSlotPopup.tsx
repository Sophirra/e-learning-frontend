import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import {
  FilterDropdown,
  type SelectableItem,
} from "@/components/complex/filterDropdown.tsx";
import { toast } from "sonner";

export function AddSlotPopup({
  onConfirm,
  availableSlots,
}: {
  onConfirm: (start: number) => void;
  availableSlots: { time: number; available: boolean }[];
}) {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        setSelectedTime(null);
      }}
    >
      <DialogTrigger asChild>
        <Button className={"w-1/1 min-w-30"} variant={"outline"}>
          <icons.Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add class slot</DialogTitle>
          <DialogDescription>Choose time for the slot:</DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4 pt-2"}>
          <FilterDropdown
            searchable={false}
            multiselect={false}
            reset={false}
            placeholder={"Select time slot"}
            emptyMessage={"No time selected"}
            items={availableSlots
              .filter((s) => s.available)
              .map((s): SelectableItem => {
                return {
                  value: String(s.time),
                  name: `${String(s.time).padStart(2, "0")}:00 - ${String(s.time + 1).padStart(2, "0")}:00`,
                };
              })}
            onSelectionChange={(selected) => {
              console.log("selected ", Number(selected[0].value));
              setSelectedTime(Number(selected[0].value));
            }}
          ></FilterDropdown>
          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            <Button
              variant={"outline"}
              onClick={() => {
                if (selectedTime == null) {
                  toast.error("Please select time slot");
                  return;
                }
                onConfirm(selectedTime);
                setOpen(false);
              }}
              disabled={selectedTime == null}
            >
              Confirm
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
