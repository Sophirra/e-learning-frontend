import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { getApiDayAvailability } from "@/api/api calls/apiTeacher.ts";
import Schedule from "@/components/complex/calendar/schedules/schedule.tsx";
import type {
  ApiDayAvailability,
  TimeSlot,
  WeekScheduleDialogProps,
} from "@/types.ts";
import { ClassPaymentPopup } from "@/components/complex/popups/classPaymentPopup.tsx";

export default function WeekSchedulePopup({
  disabled,
  courseId,
  onConfirm,
  classDetails,
}: WeekScheduleDialogProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [apiDayAvailability, setApiDayAvailability] = useState<
    ApiDayAvailability[]
  >([]);

  const today = new Date();
  const oneMonthFromToday = new Date(today);
  oneMonthFromToday.setMonth(today.getMonth() + 1);

  /**
   * Loads teacher availability for the given course.
   *
   * This effect runs automatically whenever the `courseId` changes.
   * It requests data from the backend endpoint:
   * `/api/courses/{courseId}/teacher/availability`
   * via the `getApiDayAvailability()` helper function, then updates
   * the local state with the formatted availability data.
   *
   * Errors during the fetch are logged to the console and displayed
   * to the user using a toast notification.
   */
  useEffect(() => {
    if (!courseId) return;

    const fetchAvailability = async () => {
      try {
        const availability = await getApiDayAvailability(courseId);
        setApiDayAvailability(availability ?? []);
        console.log("Fetched availability:", availability);
      } catch (err) {
        console.error("Error fetching teacher availability:", err);
        toast.error("Could not load teacher availability.");
      }
    };

    fetchAvailability();
  }, [courseId]);
  /**
   * Returns the Date object representing the Monday of the week
   * that is `weekOffset` weeks away from the current week.
   *
   * Example:
   *  - getWeekStart(0) → Monday of the current week
   *  - getWeekStart(1) → Monday of next week
   *  - getWeekStart(3) → Monday in 3 weeks
   *
   * @param weekOffset Number of weeks to move forward or backward.
   * @returns {Date} The Date corresponding to that Monday.
   */
  const getWeekStart = (weekOffset: number): Date => {
    const date = new Date(today);
    const dayOfWeek = date.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    // Calculate how many days to move back to reach Monday.
    // If it's Sunday (0), go back 6 days. Otherwise, go back (dayOfWeek - 1).
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    // Move to Monday, then shift by the specified number of weeks.
    date.setDate(date.getDate() + mondayOffset + weekOffset * 7);

    return date;
  };
  const currentWeekStart = getWeekStart(0);

  const handleConfirm = () => {
    if (selectedSlot) {
      onConfirm(selectedSlot);
      setSelectedSlot(null);
    }
  };

  const handleCancel = () => {
    setSelectedSlot(null);
  };

  return (
    <Dialog>
      <DialogTrigger disabled={disabled} asChild>
        <Button disabled={disabled}>Setup class</Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto sm:max-w-6xl gap-4">
        <DialogHeader>
          <DialogTitle>Select a time slot for {classDetails}</DialogTitle>
        </DialogHeader>
        <Schedule
          startDate={currentWeekStart}
          daysCount={7}
          apiDayAvailability={apiDayAvailability}
          displayMode={"time"}
          onSelect={setSelectedSlot}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogClose>
          {/*<Button*/}
          {/*  type={"submit"}*/}
          {/*  onClick={handleConfirm}*/}
          {/*  disabled={!selectedSlot}*/}
          {/*>*/}
          {/*  Confirm*/}
          {/*</Button>*/}
          <ClassPaymentPopup
            disabled={!selectedSlot}
            onSuccess={handleConfirm}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
