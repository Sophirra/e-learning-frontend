import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { ClassBrief } from "@/api/types.ts";
import { Link } from "react-router-dom";

export function CalendarSummary({ classes }: { classes: ClassBrief[] }) {
  return (
    <Summary label="Calendar" labelIcon={icons.Calendar} canHide={true}>
      {classes === null || classes.length === 0 ? (
        <div
          key="no-classes-key"
          className="flex flex-row gap-0"
          style={{ width: "100%" }}
        >
          <Label className="ml-4 mt-2">No upcoming classes</Label>
        </div>
      ) : (
        classes.map((classItem) => (
          <div
            key={`${classItem.courseId}}`}
            className="flex flex-row gap-0"
            style={{ width: "100%" }}
          >
            <Button variant="link" className="w-300px" asChild>
              <Link
                to={`/calendar?courseId=${encodeURIComponent(classItem.courseId)}`}
              >
                {classItem.courseName}
              </Link>
            </Button>
            <Label>
              {`${classItem.startTime.toLocaleDateString("pl", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })} at ${classItem.startTime.toLocaleTimeString("pl", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}`}
            </Label>
          </div>
        ))
      )}
    </Summary>
  );
}
