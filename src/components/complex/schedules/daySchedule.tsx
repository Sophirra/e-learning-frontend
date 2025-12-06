import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { TimeSlot } from "@/api/types.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { cn } from "@/lib/utils.ts";
import { useState } from "react";
import { Select } from "react-day-picker";
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
import { MenubarItem } from "@/components/ui/menubar.tsx";
import Schedule from "@/components/complex/schedules/schedule.tsx";

type DayScheduleProps = {
  date: Date;
  timeSlots: TimeSlot[];
  isActive: boolean;
  isSelected: (slot: TimeSlot) => boolean | null;
  onSelect: (slot: TimeSlot) => void;
  //sets the mode of the tile:
  //  class: can only select set up class tiles - meant for teacher calendar
  //  time: can select only empty tile - for student class setup
  //  add: cannot select tiles with classes, can deselect teacher availability
  //       tiles and select new slots for availability - for teacher availability
  //       definition
  displayMode: "class" | "time" | "add";
};

export function DaySchedule({
  date,
  timeSlots,
  isActive,
  isSelected,
  onSelect,
  displayMode,
}: DayScheduleProps) {
  const hasSlots = timeSlots.length > 0;
  const [toDelete, setToDelete] = useState<TimeSlot[]>([]);
  const [toAdd, setToAdd] = useState<TimeSlot[]>([]);

  function handleDelete(slot: TimeSlot) {
    if (displayMode !== "add") return;
    if (toDelete.includes(slot)) {
      setToDelete(toDelete.filter((s) => s !== slot));
    } else setToDelete([...toDelete, slot]);
  }

  function handleAdd(slot: TimeSlot) {
    if (displayMode !== "add") return;
    if (toAdd.includes(slot)) {
      setToAdd(toAdd.filter((s) => s !== slot));
    } else setToAdd([...toAdd, slot]);
  }

  const [availableSlots, setAvailableSlots] = useState<number[]>([
    6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  ]);

  // -- FUNCTIONS USED TO FORMAT DATA FROM API --
  const formatTime = (hour: number) => `${hour.toString().padStart(2, "0")}:00`;
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const getDayName = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "long" });

  function getVariant(slot: TimeSlot) {
    return displayMode == "add"
      ? toDelete.some((s) => s.start == slot.start && s.end == slot.end)
        ? "secondary"
        : toAdd.some((s) => s.start == slot.start && s.end == slot.end)
          ? "default"
          : "outline"
      : isSelected(slot)
        ? "default"
        : "outline";
  }

  function handleSelect(slot: TimeSlot) {
    if (displayMode !== "add") {
      onSelect(slot);
    } else {
      if (toAdd.includes(slot)) {
        handleAdd(slot);
      } else {
        handleDelete(slot);
      }
    }
  }

  return (
    <Card
      className={cn(
        `${!isActive || (!hasSlots && !(displayMode == "add")) ? "opacity-50 bg-gray-50" : ""}`,
        "w-fit",
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {getDayName(date)}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{formatDate(date)}</p>
      </CardHeader>

      <CardContent className="space-y-2 w-fit">
        {!isActive ? (
          <div className="text-xs text-center text-muted-foreground py-4">
            Cannot book classes more than a month forward
          </div>
        ) : !hasSlots && !(displayMode == "add") ? (
          <div className="text-xs text-center text-muted-foreground py-4">
            No time slots available
          </div>
        ) : (
          <div className="space-y-1 w-31">
            {timeSlots.map((slot, slotIndex) => (
              <Button
                key={slotIndex}
                variant={getVariant(slot)}
                size="sm"
                className="text-xs h-fit min-h-8 w-full max-w-60 p-1"
                onClick={() => handleSelect(slot)}
                disabled={
                  displayMode == "class"
                    ? !slot.courseName
                    : displayMode == "add"
                      ? !!slot.courseName
                      : false
                }
              >
                <div className={"flex flex-col w-fit"}>
                  <p>{formatTime(slot.start) + " - " + formatTime(slot.end)}</p>
                  {displayMode != "time" && (
                    <p className={"text-wrap"}> {slot.courseName}</p>
                  )}
                  {displayMode != "time" && <p> {slot.studentName}</p>}
                </div>
                {displayMode == "add" && !slot.courseName ? (
                  toDelete.includes(slot) ? (
                    <icons.Plus />
                  ) : (
                    <icons.Trash />
                  )
                ) : undefined}
              </Button>
            ))}
            {displayMode == "add" && <AddSlotPopup />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AddSlotPopup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={"w-1/1"} variant={"outline"}>
          <icons.Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className={"min-w-5/7"}>
        <DialogHeader>
          <DialogTitle>Add class slot</DialogTitle>
          <DialogDescription>Choose time for the slot:</DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4 pt-2"}>
          <Schedule
            startDate={new Date()}
            daysCount={7}
            displayMode={"add"}
            onSelect={() => {}}
            classes={classes}
            apiDayAvailability={existingAvailability}
          />
          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            <Button
              variant={"outline"}
              onClick={() => {
                setupAvailability();
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
