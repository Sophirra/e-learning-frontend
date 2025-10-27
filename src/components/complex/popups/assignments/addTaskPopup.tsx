import { useState } from "react";
import {
  FilterDropdown,
  type SelectableItem,
} from "@/components/complex/filterDropdown.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { AddAssignmentPopup } from "@/components/complex/popups/assignments/addAssignmentPopup.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { CopyAssignmentPopup } from "@/components/complex/popups/assignments/copyAssignmentPopup.tsx";
import { CopyQuizPopup } from "@/components/complex/popups/assignments/copyQuizPopup.tsx";
import { DialogClose } from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";

export function AddTaskPopup(
  classId: string,
  courseId?: string,
  studentId?: string,
  buttonOutline?: boolean,
  allowOnlyAssignment?: boolean,
  extendedName?: boolean,
) {
  const navigate = useNavigate();
  //TODO: download data from backend
  let availableClasses = [
    { className: "class1", classId: "course1_id" },
    { className: "class2", classId: "course2_id" },
  ];
  let availableStudents = [
    { studentName: "student1", studentId: "student1_id" },
    { studentName: "student2", studentId: "student2_id" },
  ];
  let [selectedClass, setSelectedClass] = useState<SelectableItem[]>([]);
  let [selectedStudent, setSelectedStudent] = useState<SelectableItem[]>([]);
  let [selectedTaskType, setSelectedTaskType] = useState<SelectableItem[]>([
    { name: "Assignment", value: "0" },
  ]);

  return (
    <Dialog
      onOpenChange={() => {
        setSelectedClass(
          courseId ? [{ value: courseId, name: "courseId" }] : [],
        );
        setSelectedStudent(
          studentId ? [{ value: studentId, name: "studentId" }] : [],
        );
        setSelectedTaskType([{ name: "Assignment", value: "0" }]);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={buttonOutline ? "outline" : "ghost"}
          disabled={!classId}
        >
          <icons.Plus />
          {extendedName ? "Add new task" : "Add"}
        </Button>
      </DialogTrigger>
      <DialogContent className={"sm:max-w-[425px]"}>
        <DialogHeader>
          <DialogTitle>Add new task to class</DialogTitle>
          <DialogDescription>Choose class and task type</DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4"}>
          <FilterDropdown
            key={"class"}
            items={availableClasses.map((c) => {
              return { name: c.className, value: c.classId };
            })}
            placeholder={"Select class"}
            label={"Class"}
            emptyMessage={"Select class"}
            onSelectionChange={setSelectedClass}
            multiselect={false}
          />
          <FilterDropdown
            key={"student"}
            disabled={selectedClass.length == 0}
            label={"For student"}
            placeholder={"Select student"}
            emptyMessage={"Select student"}
            items={availableStudents.map((s) => {
              return { name: s.studentName, value: s.studentId };
            })}
            onSelectionChange={setSelectedStudent}
            multiselect={false}
          />
          {allowOnlyAssignment ? null : (
            <FilterDropdown
              key={"taskType"}
              disabled={
                selectedStudent.length == 0 || selectedClass.length == 0
              }
              items={[
                { name: "Assignment", value: "0" },
                { name: "Quiz", value: "1" },
              ]}
              placeholder={"Select task type"}
              label={"Task type"}
              emptyMessage={"Select task type"}
              onSelectionChange={setSelectedTaskType}
              multiselect={false}
            />
          )}

          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            {selectedTaskType.length > 0 &&
            selectedClass.length > 0 &&
            selectedStudent.length > 0 ? (
              selectedTaskType[0].name == "Quiz" ? (
                <CopyQuizPopup />
              ) : (
                <CopyAssignmentPopup />
              )
            ) : (
              <Button variant={"outline"} disabled={true}>
                Copy
              </Button>
            )}
            {selectedTaskType.length > 0 &&
            selectedClass.length > 0 &&
            selectedStudent.length > 0 ? (
              selectedTaskType[0].name == "Quiz" ? (
                <DialogClose asChild>
                  <Button
                    onClick={() =>
                      navigate(`/quizzes/create`, {
                        state: { classId: "selectedClassId" },
                      })
                    }
                  >
                    Add new quiz
                  </Button>
                </DialogClose>
              ) : (
                <AddAssignmentPopup classId={classId} />
              )
            ) : (
              <Button variant={"outline"} disabled={true}>
                Add
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
