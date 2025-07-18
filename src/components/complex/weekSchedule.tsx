import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DaySchedule } from "./daySchedule";

interface TimeSlot {
  start: number;
  end: number;
  dayIndex: number;
  date: Date;
}

interface DayAvailability {
  [key: number]: number[][];
}

interface WeekScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availability: DayAvailability;
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
  const oneMonthFromToday = new Date(
    today.getTime() + 30 * 24 * 60 * 60 * 1000,
  );

  const getWeekStart = (weekOffset: number) => {
    const date = new Date(today);
    const dayOfWeek = date.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    date.setDate(date.getDate() + mondayOffset + weekOffset * 7);
    return date;
  };

  const currentWeekStart = getWeekStart(currentWeekOffset);

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentWeekStart]);

  const canGoBack = currentWeekOffset > 0;

  const canGoForward = useMemo(() => {
    const nextWeekStart = getWeekStart(currentWeekOffset + 1);
    return nextWeekStart <= oneMonthFromToday;
  }, [currentWeekOffset, oneMonthFromToday]);

  const generateTimeSlots = (dayIndex: number, date: Date): TimeSlot[] => {
    const dayOfWeek = date.getDay();
    const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const dayAvailability = availability[adjustedDayOfWeek] || [];
    const slots: TimeSlot[] = [];
    dayAvailability.forEach(([start, end]) => {
      for (let hour = start; hour < end; hour++) {
        slots.push({
          start: hour,
          end: hour + 1,
          dayIndex,
          date: new Date(date),
        });
      }
    });
    return slots;
  };

  const formatTime = (hour: number) => `${hour.toString().padStart(2, "0")}:00`;
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const getDayName = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "long" });
  const isDateTooFar = (date: Date) => date > oneMonthFromToday;

  const isSlotSelected = (slot: TimeSlot) => {
    return (
      selectedSlot &&
      selectedSlot.start === slot.start &&
      selectedSlot.dayIndex === slot.dayIndex &&
      selectedSlot.date.toDateString() === slot.date.toDateString()
    );
  };

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
              <ChevronLeft className="h-4 w-4" />
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
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
            {weekDays.map((date, dayIndex) => (
              <DaySchedule
                key={dayIndex}
                date={date}
                dayIndex={dayIndex}
                timeSlots={generateTimeSlots(dayIndex, date)}
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
