import {useState, useMemo, useEffect} from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {iconLibrary as icons} from "@/components/iconLibrary.tsx";
import {DaySchedule} from "./daySchedule";
import {DialogTrigger} from "@radix-ui/react-dialog";
import {toast} from "sonner";
import {getApiDayAvailability} from "@/api/apiCalls.ts";


export interface TimeSlot {
    start: number;
    end: number;
    dayIndex: number;
    date: Date;
}

export interface ApiDayAvailability {
    day: string;
    timeslots: { timeFrom: string; timeUntil: string }[];
}

interface WeekScheduleDialogProps {
    disabled: boolean;
    onConfirm: (selectedSlot: TimeSlot) => void;
    classDetails?: string;
    courseId: string;
}


export default function WeekScheduleDialog({
                                               disabled,
                                               courseId,
                                               onConfirm,
                                               classDetails,
                                           }: WeekScheduleDialogProps) {
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [apiDayAvailability, setApiDayAvailability] = useState<ApiDayAvailability[]>([]);


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
    const currentWeekStart = getWeekStart(currentWeekOffset);


    /**
     * Generates an array of 7 Date objects representing the current week (Monday → Sunday).
     *
     * The value is memoized to avoid unnecessary recalculations and re-renders.
     * It only updates when `currentWeekStart` changes.
     *
     * @returns {Date[]} Array of 7 dates for the week view in the availability calendar.
     */
    const weekDays = useMemo(() => {
        // Generate an array [Monday, Tuesday, ..., Sunday]
        return Array.from({length: 7}).map((_, i) => {
            const d = new Date(currentWeekStart);
            d.setDate(d.getDate() + i);
            return d;
        });
    }, [currentWeekStart]);

    /**
     * Indicates whether the user can navigate backward in the calendar.
     *
     * Prevents moving to weeks before the current one.
     */
    const canGoBack = currentWeekOffset > 0;


    /**
     * Determines whether the user can navigate forward in the calendar.
     *
     * Calculates the start date of the next week and compares it
     * to the `oneMonthFromToday` limit. The result is memoized to avoid
     * unnecessary recalculations and re-renders.
     *
     * @returns {boolean} True if the next week is within one month from today.
     */
        // Memoization rationale:
        // Without useMemo, this comparison would re-run on every render,
        // even if the dependent values (`currentWeekOffset`, `oneMonthFromToday`) didn t change.
        // useMemo keeps a stable boolean reference, reducing unnecessary component re-renders.

    const canGoForward = useMemo(() => {
            const nextWeekStart = getWeekStart(currentWeekOffset + 1);
            return nextWeekStart <= oneMonthFromToday;
        }, [currentWeekOffset, oneMonthFromToday]);


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

        // Find availability entry for the specific day.
        const dayData = apiDayAvailability.find((d) => d.day === dayStr);

        // Return an empty array if no availability is found.
        if (!dayData) return [];

        // Map availability data to TimeSlot objects used in the calendar.
        return dayData.timeslots.map((ts) => ({
            start: parseInt(ts.timeFrom.split(":")[0], 10),
            end: parseInt(ts.timeUntil.split(":")[0], 10),
            dayIndex,
            date: new Date(date),
        }));
    };


    // -- FUNCTIONS USED TO FORMAT DATA FROM API --

    const formatTime = (hour: number) => `${hour.toString().padStart(2, "0")}:00`;
    const formatDate = (date: Date) =>
        date.toLocaleDateString("en-US", {month: "short", day: "numeric"});
    const getDayName = (date: Date) =>
        date.toLocaleDateString("en-US", {weekday: "long"});

    //to prevent user from going too far in the list
    const isDateTooFar = (date: Date) => date > oneMonthFromToday;

    //checks whether the selected slot is the one selected (based on properties)
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
        }
    };

    const handleCancel = () => {
        setSelectedSlot(null);
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Button disabled={disabled}>Setup class</Button>
            </DialogTrigger>
            <DialogContent className="overflow-y-auto sm:max-w-6xl gap-4">
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
                            <icons.ChevronLeft className="h-4 w-4"/>
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
                            <icons.ChevronRight className="h-4 w-4"/>
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
                    <DialogClose asChild>
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type={"submit"}
                        onClick={handleConfirm}
                        disabled={!selectedSlot}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
