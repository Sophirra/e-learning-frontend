import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { DaySchedule } from "./daySchedule.tsx";
import { addMonths } from "date-fns";
import type {
  ApiDayAvailability,
  ClassSchedule,
  TimeSlot,
} from "@/api/types.ts";

type ScheduleProps = {
  startDate: Date;
  daysCount: number;
  endDate?: Date;
  apiDayAvailability?: ApiDayAvailability[];
  classes?: ClassSchedule[];
  displayMode: "time" | "class";
  onSelect: (slot: TimeSlot) => void;
  selectedClassId?: string;
};

export default function Schedule({
  startDate,
  daysCount,
  endDate,
  apiDayAvailability,
  displayMode,
  classes,
  onSelect,
  selectedClassId,
}: ScheduleProps) {
  const [intervalOffset, setIntervalOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    if (
      selectedClassId === null ||
      (selectedSlot && selectedSlot.classId !== selectedClassId)
    ) {
      setSelectedSlot(null);
    }
  }, [selectedClassId]);

  if (!endDate) {
    endDate = addMonths(startDate, 1);
  }
  let nextStart = useMemo(() => {
    const newStart = new Date(startDate);
    newStart.setDate(newStart.getDate() + intervalOffset * daysCount);
    return newStart;
  }, [intervalOffset]);
  /**
   * Generates an array of n Date objects representing the current day interval (Monday → Sunday).
   *
   * The value is memoized to avoid unnecessary recalculations and re-renders.
   * It only updates when `currentWeekStart` changes.
   *
   * @returns {Date[]} Array of n dates for the interval view in the availability calendar.
   */
  const weekDays = useMemo(() => {
    // Generate an array [Monday, Tuesday, ..., Sunday]
    return Array.from({ length: daysCount }).map((_, i) => {
      const d = new Date(nextStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [nextStart]);

  /**
   * Indicates whether the user can navigate backward in the calendar.
   *
   * Prevents moving to weeks before the current one.
   */
  const canGoBack = nextStart > startDate;

  /**
   * Determines whether the user can navigate forward in the calendar.
   *
   * Calculates the start date of the next displayed interval and compares it
   * to the `endDate` limit. The result is memoized to avoid
   * unnecessary recalculations and re-renders.
   *
   * @returns {boolean} True if the next week is within one month from today.
   */
  // Memoization rationale:
  // Without useMemo, this comparison would re-run on every render,
  // even if the dependent values (`intervalOffset`, `oneMonthFromToday`) didn't change.
  // useMemo keeps a stable boolean reference, reducing unnecessary component re-renders.

  const canGoForward = useMemo(() => {
    const newStart = new Date(nextStart);
    newStart.setDate(newStart.getDate() + intervalOffset * daysCount);
    return newStart <= endDate;
  }, [intervalOffset]);

  /**
   * Generates an array of time slots for a given day.
   *
   * Each time slot represents an available period (e.g., 9:00 - 10:00 ) for the user.
   * The function looks up availability data for the provided date,
   * formats it into `TimeSlot[]`, and returns it.
   *
   * @param date - The date for which to generate time slots.
   * @param dayIndex - The index of the day in the week (0 6).
   * @returns {TimeSlot[]} A list of formatted time slots for the given date.
   */
  const generateTimeSlots = (date: Date, dayIndex: number): TimeSlot[] => {
    // Format date as "YYYY-MM-DD" to match the structure in availability data.
    const dayStr = date.toISOString().slice(0, 10);
    let slots: TimeSlot[] = [];
    // Get availability first:
    if (apiDayAvailability) {
      // Find availability entry for the specific day.
      const dayData = apiDayAvailability.find((d) => d.day === dayStr);
      if (dayData) {
        // Map availability data to TimeSlot objects used in the calendar.
        slots = dayData.timeslots.map((ts) => ({
          start: parseInt(ts.timeFrom.split(":")[0], 10),
          end: parseInt(ts.timeUntil.split(":")[0], 10),
          dayIndex,
          date: new Date(date),
        }));
      }
    }
    //then look into booked classes:
    if (classes) {
      const dayData = classes.filter(
        (d) =>
          new Date(d.classDate).toDateString() ===
          new Date(date).toDateString(),
      );
      if (dayData) {
        slots = [
          ...slots,
          ...dayData.map((d) => ({
            start: parseInt(d.classStartTime.split(":")[0], 10),
            end: parseInt(d.classEndTime.split(":")[0], 10),
            dayIndex,
            date: new Date(date),
            courseName: d.courseName,
            studentName: d.studentName,
            classId: d.classId,
          })),
        ];
      }
    }
    slots.sort((a, b) => a.start - b.start);
    return slots;
  };

  //to prevent user from going too far in the list
  const isDateTooFar = (date: Date) => date > endDate;

  //checks whether the selected slot is the one selected (based on properties)
  const isSlotSelected = (slot: TimeSlot) =>
    selectedSlot &&
    selectedSlot.start === slot.start &&
    selectedSlot.dayIndex === slot.dayIndex &&
    selectedSlot.date.toDateString() === slot.date.toDateString();

  const handleSlotSelect = (slot: TimeSlot) => {
    if (isDateTooFar(slot.date)) return;
    setSelectedSlot(slot);
    onSelect(slot);
  };
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const gridCols =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      7: "grid-cols-7",
    }[daysCount] || "grid-cols-1";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setIntervalOffset(intervalOffset - 1);
            // console.log(intervalOffset);
          }}
          disabled={!canGoBack}
        >
          <icons.ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-lg font-semibold">
          {formatDate(weekDays[0])} -{" "}
          {formatDate(weekDays[weekDays.length - 1])}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setIntervalOffset(intervalOffset + 1);
            // console.log(intervalOffset);
          }}
          disabled={!canGoForward}
        >
          <icons.ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className={"grid " + gridCols + " gap-4"}>
        {weekDays.map((date, dayIndex) => (
          <DaySchedule
            key={dayIndex}
            date={date}
            timeSlots={generateTimeSlots(date, dayIndex)}
            isActive={!isDateTooFar(date)}
            isSelected={isSlotSelected}
            onSelect={handleSlotSelect}
            displayMode={displayMode}
          />
        ))}
      </div>
    </div>
  );
}
