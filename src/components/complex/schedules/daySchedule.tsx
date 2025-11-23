import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { TimeSlot } from "@/api/types.ts";

type DayScheduleProps = {
  date: Date;
  timeSlots: TimeSlot[];
  isActive: boolean;
  isSelected: (slot: TimeSlot) => boolean | null;
  onSelect: (slot: TimeSlot) => void;
  displayMode: "class" | "time";
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

  // -- FUNCTIONS USED TO FORMAT DATA FROM API --
  const formatTime = (hour: number) => `${hour.toString().padStart(2, "0")}:00`;
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const getDayName = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <Card
      className={`${!isActive || !hasSlots ? "opacity-50 bg-gray-50" : ""}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {getDayName(date)}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{formatDate(date)}</p>
      </CardHeader>

      <CardContent className="space-y-2">
        {!isActive ? (
          <div className="text-xs text-center text-muted-foreground py-4">
            Cannot book classes more than a month forward
          </div>
        ) : !hasSlots ? (
          <div className="text-xs text-center text-muted-foreground py-4">
            No time slots available
          </div>
        ) : (
          <div className="space-y-1">
            {timeSlots.map((slot, slotIndex) => (
              <Button
                key={slotIndex}
                variant={isSelected(slot) ? "default" : "outline"}
                size="sm"
                className="text-xs h-fit min-h-8 w-full max-w-60 p-1"
                onClick={() => onSelect(slot)}
                disabled={displayMode == "class" ? !slot.courseName : false}
              >
                <div className={"flex flex-col"}>
                  <p>{formatTime(slot.start) + " - " + formatTime(slot.end)}</p>
                  {displayMode == "class" && <p> {slot.courseName}</p>}
                  {displayMode == "class" && <p> {slot.studentName}</p>}
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
