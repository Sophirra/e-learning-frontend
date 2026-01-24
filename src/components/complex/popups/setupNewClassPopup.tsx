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
import type { CourseBrief, TimeSlot } from "@/types.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { useEffect, useState } from "react";
import {
  FilterDropdown,
  type SelectableItem,
} from "@/components/complex/filterDropdown.tsx";
import WeekSchedulePopup from "@/components/complex/calendar/schedules/weekSchedulePopup.tsx";
import { getUserId } from "@/api/api.ts";
import { toast } from "sonner";
import { setupNextClass } from "@/api/api calls/apiClasses.ts";
import { getStudentCourses } from "@/api/api calls/apiStudents.ts";

export function SetupNewClassPopup() {
  const [courses, setCourses] = useState<CourseBrief[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<SelectableItem[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getStudentCourses(getUserId());
        setCourses(data);
      } catch (e: any) {
        toast.error("Failed to fetch courses: " + e.message);
      }
    };
    fetchCourses();
  }, []);

  async function setupClass(timeslot: TimeSlot) {
    try {
      const classDate = timeslot.date;
      classDate.setHours(timeslot.start, 0, 0, 0);
      await setupNextClass(classDate.toISOString(), selectedCourse[0].value);
      setOpen(false);
      toast.success("Class setup successfully.");
    } catch (e: any) {
      toast.error("Failed to setup class: " + e.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            {selectedCourse.length > 0 && "for " + selectedCourse[0].name}
          </DialogTitle>
          <DialogDescription>
            After you choose the time, your class request will be sent to the
            teacher.
          </DialogDescription>
        </DialogHeader>
        <FilterDropdown
          items={courses.map((c) => ({ value: c.id, name: c.name }))}
          multiselect={false}
          placeholder={"Select course"}
          emptyMessage={"No course selected"}
          defaultValues={
            selectedCourse.length > 0 ? [selectedCourse[0].value] : undefined
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
          <WeekSchedulePopup
            disabled={selectedCourse.length == 0}
            onConfirm={setupClass}
            courseId={selectedCourse.length > 0 ? selectedCourse[0].value : ""}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
