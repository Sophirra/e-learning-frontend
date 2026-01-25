import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { ApiDayAvailability, TimeSlot } from "@/types.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { cn } from "@/lib/utils.ts";
import { useEffect, useState } from "react";
import { AddSlotPopup } from "@/components/complex/popups/addSlotPopup.tsx";

type DayScheduleProps = {
  key: number;
  date: Date;
  timeSlots: TimeSlot[];
  isActive: boolean;
  isSelected: (slot: TimeSlot) => boolean | null;
  onSelect?: (slot: TimeSlot) => void;
  updateDaySlots?: (dayState: ApiDayAvailability) => void;
  /**
    sets the mode of the tile:
    class: can only select set up class tiles - meant for teacher calendar
    time: can select only empty tile - for student class setup
    add: cannot select tiles with classes, can deselect teacher availability
         tiles and select new slots for availability - for teacher availability
         definition
  **/
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
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [toDelete, setToDelete] = useState<TimeSlot[]>([]);
  const [toAdd, setToAdd] = useState<TimeSlot[]>([]);

  function setDaySlots() {
    if (!updateDaySlots) {
      console.log("lost in update day slots: no passed function found");
      return;
    }
    const daySlots: ApiDayAvailability = {
      day: date.toISOString().slice(0, 10),
      timeslots: [],
    };
    const hours = Array(24).fill(0);
    slots.forEach((slot) => {
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
          daySlots.timeslots.push({
            timeFrom: start.toString() + ":00:00",
            timeUntil: end.toString() + ":00:00",
          });
          console.log("ended series at: ", end, ", started: ", start);
          series = false;
        }
      } else if (!series) {
        series = true;
        start = i;
      }
    }
    updateDaySlots(daySlots);
  }

  function handleDelete(slot: TimeSlot) {
    if (displayMode !== "add") return;
    if (toDelete.some((s) => s.start === slot.start)) {
      setToDelete((prev) => {
        const exists = prev.some((s) => s.start === slot.start);
        return exists
          ? prev.filter((s) => s.start !== slot.start)
          : [...prev, slot];
      });
    } else {
      setToDelete([...toDelete, slot]);
    }
  }

  function handleAdd(slot: TimeSlot) {
    if (displayMode !== "add") return;
    console.log("slots: ", slots);
    //if already exists then remove from the toAdd
    if (toAdd.some((s) => s.start === slot.start)) {
      console.log("removing slot: ", slot);
      //remove from the technical toAdd list
      setToAdd((prev) => {
        const exists = prev.some((s) => s.start === slot.start);
        return exists
          ? prev.filter((s) => s.start !== slot.start)
          : [...prev, slot];
      });
      //remove from visible slots
      setSlots((prev) => prev.filter((s) => s.start !== slot.start));
    } else {
      console.log("adding slot: ", slot);
      setToAdd([...toAdd, slot]);
      setSlots((prev) => [...prev, slot].sort((a, b) => a.start - b.start));
      // setSlots(slots.sort((a, b) => a.start - b.start));
    }
    console.log("toAdd: ", toAdd);
    console.log("slots: ", slots);
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
        // setDaySlots();
      } else {
        handleDelete(slot);
        // setDaySlots();
      }
    }
  }

  //to update changed day
  useEffect(() => {
    if (!timeSlots || (toDelete.length == 0 && toAdd.length == 0)) return;
    setDaySlots();
  }, [toAdd, toDelete]);

  //to download actual slots
  useEffect(() => {
    if (timeSlots.length != 0 && slots.length != 0) return;
    // console.log(slots);
    setSlots([...timeSlots]);
  }, [timeSlots]);

  useEffect(() => {
    setSlots(timeSlots);
    setToDelete([]);
    setToAdd([]);
  }, [date]);

  //to update available slots for adding new
  useEffect(() => {
    if (timeSlots.length == 0) return;
    setAvailableSlots((prev) =>
      prev.map((s) =>
        timeSlots.some((t) => t.start === s.time)
          ? { ...s, available: false }
          : s,
      ),
    );
  }, [slots]);

  function createSlotToAdd(startTime: number) {
    // console.log("day index: ", key);
    handleAdd({
      start: startTime,
      end: startTime + 1,
      date: date,
      dayIndex: key,
    });
    // setDaySlots();
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

      <CardContent className="space-y-1 w-fit">
        {!isActive ? (
          <div className="text-xs text-center text-muted-foreground py-4 w-32">
            Cannot book classes more than a month forward
          </div>
        ) : !hasSlots && !(displayMode == "add") ? (
          <div className="text-xs text-center text-muted-foreground py-4 w-32">
            No time slots available
          </div>
        ) : (
          <div className="space-y-1 w-fit">
            {slots.map((slot, slotIndex) => (
              <Button
                key={slotIndex}
                variant={getVariant(slot)}
                size="sm"
                className="text-xs h-fit min-h-8 w-full max-w-50 min-w-32 p-1"
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
