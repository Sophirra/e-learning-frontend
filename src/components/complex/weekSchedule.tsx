import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { DaySchedule } from "./daySchedule";

interface TimeSlot {
  start: number;
  end: number;
  dayIndex: number;
  date: Date;
}

interface ApiDayAvailability {
  day: string; // "2025-08-25"
  timeslots: { timeFrom: string; timeUntil: string }[];
}

interface WeekScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availability: ApiDayAvailability[]; // tutaj lista z API
  onConfirm: (selectedSlot: TimeSlot) => void;
  classDetails: string;
}

export default function WeekScheduleDialog({
                                             open,
                                             onOpenChange,
                                             availability,
                                             onConfirm,
                                             classDetails,
                                           }: WeekScheduleDialogProps) {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const today = new Date();
  const oneMonthFromToday = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const getWeekStart = (weekOffset: number) => {
    const date = new Date(today);
    const dayOfWeek = date.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    date.setDate(date.getDate() + mondayOffset + weekOffset * 7);
    return date;
  };

  const currentWeekStart = getWeekStart(currentWeekOffset);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentWeekStart]);

  const canGoBack = currentWeekOffset > 0;
  const canGoForward = useMemo(() => {
    const nextWeekStart = getWeekStart(currentWeekOffset + 1);
    return nextWeekStart <= oneMonthFromToday;
  }, [currentWeekOffset, oneMonthFromToday]);

  const generateTimeSlots = (date: Date, dayIndex: number): TimeSlot[] => {
    const dayStr = date.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const dayData = availability.find(d => d.day === dayStr);

    if (!dayData) return [];

    return dayData.timeslots.map(ts => ({
      start: parseInt(ts.timeFrom.split(":")[0], 10),
      end: parseInt(ts.timeUntil.split(":")[0], 10),
      dayIndex,
      date: new Date(date),
    }));
  };

  const formatTime = (hour: number) => `${hour.toString().padStart(2, "0")}:00`;
  const formatDate = (date: Date) =>
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const getDayName = (date: Date) =>
      date.toLocaleDateString("en-US", { weekday: "long" });

  const isDateTooFar = (date: Date) => date > oneMonthFromToday;

  const isSlotSelected = (slot: TimeSlot) =>
      selectedSlot &&
      selectedSlot.start === slot.start &&
      selectedSlot.dayIndex === slot.dayIndex &&
      selectedSlot.date.toDateString() === slot.date.toDateString();

  const handleSlotSelect = (slot: TimeSlot) => {
    if (isDateTooFar(slot.date)) return;
    setSelectedSlot(slot);
  };

  const handleConfirm = () => {
    if (selectedSlot) {
      onConfirm(selectedSlot);
      setSelectedSlot(null);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setSelectedSlot(null);
    onOpenChange(false);
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="overflow-y-auto sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle>Select a time slot for {classDetails}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                  disabled={!canGoBack}
              >
                <icons.ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-lg font-semibold">
                {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
              </div>

              <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                  disabled={!canGoForward}
              >
                <icons.ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
              {weekDays.map((date, dayIndex) => (
                  <DaySchedule
                      key={dayIndex}
                      date={date}
                      dayIndex={dayIndex}
                      timeSlots={generateTimeSlots(date, dayIndex)}
                      isActive={!isDateTooFar(date)}
                      isSelected={isSlotSelected}
                      onSelect={handleSlotSelect}
                      formatTime={formatTime}
                      getDayName={getDayName}
                      formatDate={formatDate}
                  />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedSlot}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
