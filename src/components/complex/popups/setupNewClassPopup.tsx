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
import { Button } from "@/components/ui/button.tsx";
import type { CourseBrief } from "@/api/types.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { useState } from "react";
import {
  FilterDropdown,
  type SelectableItem,
} from "@/components/complex/filterDropdown.tsx";
import WeekScheduleDialog, {
  type TimeSlot,
} from "@/components/complex/schedules/availabilityWeekSchedule.tsx";

export function SetupNewClassPopup({ course }: { course: string }) {
  //TODO: add data from backend
  let courses: CourseBrief[] = [
    { id: "1", name: "Course A" },
    { id: "2", name: "Course B" },
  ];

  const [selectedCourse, setSelectedCourse] = useState<SelectableItem[]>(() => {
    if (course) {
      const foundCourse = courses.find((c) => c.id === course);
      return foundCourse
        ? [{ value: foundCourse.id, name: foundCourse.name }]
        : [];
    }

    return [];
  });
  let selectedFrom: string = course ? "outside" : "inside";

  //TODO: send the request to backend
  function setupClass(timeslot: TimeSlot) {}
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"}>
          Setup new class
          <icons.Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Setup new class{" "}
            {selectedCourse.length > 0 && "for " + selectedCourse[0].value}
          </DialogTitle>
          <DialogDescription>
            After you choose the time, your class request will be sent to the
            teacher.
          </DialogDescription>
        </DialogHeader>
        <FilterDropdown
          items={courses.map((c) => ({ value: c.id, name: c.name }))}
          disabled={selectedFrom == "outside"}
          multiselect={false}
          placeholder={"Select course"}
          emptyMessage={"No course selected"}
          defaultValue={
            selectedCourse.length > 0 ? selectedCourse[0].value : undefined
          }
          onSelectionChange={setSelectedCourse}
          reset={false}
        />
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <WeekScheduleDialog
            disabled={selectedCourse.length == 0}
            availability={[]}
            onConfirm={setupClass}
            courseId={selectedCourse.length > 0 ? selectedCourse[0].value : ""}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
