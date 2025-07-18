import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TimeSlot {
  start: number;
  end: number;
  dayIndex: number;
  date: Date;
}

interface DayScheduleProps {
  date: Date;
  dayIndex: number;
  timeSlots: TimeSlot[];
  isActive: boolean;
  isSelected: (slot: TimeSlot) => boolean | null;
  onSelect: (slot: TimeSlot) => void;
  formatTime: (hour: number) => string;
  getDayName: (date: Date) => string;
  formatDate: (date: Date) => string;
}

export function DaySchedule({
  date,
  dayIndex,
  timeSlots,
  isActive,
  isSelected,
  onSelect,
  formatTime,
  getDayName,
  formatDate,
}: DayScheduleProps) {
  const hasSlots = timeSlots.length > 0;

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
                className="text-xs h-8 w-full"
                onClick={() => onSelect(slot)}
              >
                {formatTime(slot.start)} - {formatTime(slot.end)}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
