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
import type { CourseBrief, TimeSlot } from "@/api/types.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { useEffect, useState } from "react";
import {
  FilterDropdown,
  type SelectableItem,
} from "@/components/complex/filterDropdown.tsx";
import WeekSchedulePopup from "@/components/complex/schedules/weekSchedulePopup.tsx";
import { getUserId } from "@/api/api.ts";
import { toast } from "sonner";
import { setupClass as setupClassApi } from "@/api/api calls/apiClasses.ts";
import { getStudentCourses } from "@/api/api calls/apiStudents.ts";

export function SetupNewClassPopup() {
  const [courses, setCourses] = useState<CourseBrief[]>([]);

  const [selectedCourse, setSelectedCourse] = useState<SelectableItem[]>([]);
  // () => {
  // if (courseId) {
  //   const foundCourse = courses.find((c) => c.id === courseId);
  //   console.log(foundCourse);
  //   return foundCourse
  //     ?
  //   [{ value: foundCourse.id, name: foundCourse.name }]
  // : [];
  // }
  // return [];
  // }
  // const selectedFrom: string = courseId ? "outside" : "inside";

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getStudentCourses(getUserId());
      setCourses(data);
    };
    fetchCourses();
  }, []);

  //TODO: send the request to backend
  async function setupClass(timeslot: TimeSlot) {
    try {
      await setupClassApi();
    } catch (e: any) {
      toast.error("Failed to setup class: " + e.message);
    }
  }

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
