import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import type {
  ApiDayAvailability,
  DayAvailability,
  TimeSlot,
} from "@/api/types.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { cn } from "@/lib/utils.ts";
import { useEffect, useState } from "react";
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
import {
  FilterDropdown,
  type SelectableItem,
} from "@/components/complex/filterDropdown.tsx";
import { toast } from "sonner";

type DayScheduleProps = {
  key: number;
  date: Date;
  timeSlots: TimeSlot[];
  isActive: boolean;
  isSelected: (slot: TimeSlot) => boolean | null;
  onSelect?: (slot: TimeSlot) => void;
  updateDaySlots?: (dayState: DayAvailability) => void;
  //sets the mode of the tile:
  //  class: can only select set up class tiles - meant for teacher calendar
  //  time: can select only empty tile - for student class setup
  //  add: cannot select tiles with classes, can deselect teacher availability
  //       tiles and select new slots for availability - for teacher availability
  //       definition
  displayMode: "class" | "time" | "add";
};

export function DaySchedule({
  key,
  date,
  timeSlots,
  isActive,
  isSelected,
  onSelect,
  displayMode,
  updateDaySlots,
}: DayScheduleProps) {
  const hasSlots = timeSlots.length > 0;
  const [toDelete, setToDelete] = useState<TimeSlot[]>([]);
  const [toAdd, setToAdd] = useState<TimeSlot[]>([]);

  function setDaySlots() {
    if (!updateDaySlots) {
      console.log("lost in update day slots: no passed function found");
      return;
    }
    const daySlots: DayAvailability = {
      day: date,
      timeslots: [],
    };
    const hours = Array(24).fill(0);
    timeSlots.forEach((slot) => {
      hours[slot.start] = 1;
    });
    toDelete.forEach((slot) => {
      hours[slot.start] = 0;
    });
    toAdd.forEach((slot) => {
      hours[slot.start] = 1;
    });
    let series = false;
    let start: number = 0;
    let end: number;
    for (let i: number = 0; i < hours.length; i++) {
      if (hours[i] === 0) {
        if (series) {
          end = i;
          daySlots.timeslots.push({ timeFrom: start, timeUntil: end });
          console.log("ended series at: ", end, ", started: ", start);
          series = false;
        }
      } else if (!series) {
        series = true;
        start = i;
      }
    }
    console.log("updated day", daySlots);
    updateDaySlots(daySlots);
  }

  function handleDelete(slot: TimeSlot) {
    if (displayMode !== "add") return;
    console.log("toDelete");
    if (toDelete.includes(slot)) {
      setToDelete(toDelete.filter((s) => s !== slot));
    } else setToDelete([...toDelete, slot]);
    // setDaySlots();
  }

  function handleAdd(slot: TimeSlot) {
    if (displayMode !== "add") return;
    console.log("toAdd");
    if (toAdd.includes(slot)) {
      setToAdd(toAdd.filter((s) => s !== slot));
      timeSlots.splice(timeSlots.indexOf(slot), 1);
      setAvailableSlots((prev) =>
        prev.map((s) =>
          s.time === slot.start ? { ...s, available: true } : s,
        ),
      );
    } else {
      setToAdd([...toAdd, slot]);
      timeSlots.push(slot);
      setAvailableSlots((prev) =>
        prev.map((s) =>
          s.time === slot.start ? { ...s, available: false } : s,
        ),
      );
      timeSlots.sort((a, b) => a.start - b.start);
    }
    // setDaySlots();
  }

  const [availableSlots, setAvailableSlots] = useState<
    { time: number; available: boolean }[]
  >([
    { time: 6, available: true },
    { time: 7, available: true },
    { time: 8, available: true },
    { time: 9, available: true },
    { time: 10, available: true },
    { time: 11, available: true },
    { time: 12, available: true },
    { time: 13, available: true },
    { time: 14, available: true },
    { time: 15, available: true },
    { time: 16, available: true },
    { time: 17, available: true },
    { time: 18, available: true },
    { time: 19, available: true },
    { time: 20, available: true },
    { time: 21, available: true },
    { time: 22, available: true },
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
    if (!onSelect) {
      console.log("lost in handle select: no passed function found");
      return;
    }
    if (displayMode !== "add") {
      onSelect(slot);
    } else {
      if (toAdd.includes(slot)) {
        handleAdd(slot);
        setDaySlots();
      } else {
        handleDelete(slot);
        setDaySlots();
      }
    }
  }

  useEffect(() => {
    if (timeSlots.length == 0) return;
    setAvailableSlots((prev) =>
      prev.map((s) =>
        timeSlots.some((t) => t.start === s.time)
          ? { ...s, available: false }
          : s,
      ),
    );
    // for (let slot in timeSlots){
    //     setAvailableSlots(...)
    //     availableSlots[slot.time - 7].available = false;
    // }
  }, [timeSlots]);

  // useEffect(() => {
  //   setDaySlots();
  // }, [toAdd, toDelete]);

  function createSlotToAdd(startTime: number) {
    handleAdd({
      start: startTime,
      end: startTime + 1,
      date: date,
      dayIndex: key,
    });
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
            {displayMode == "add" && (
              <AddSlotPopup
                onConfirm={createSlotToAdd}
                availableSlots={availableSlots}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
function AddSlotPopup({
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
        <Button className={"w-1/1"} variant={"outline"}>
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
