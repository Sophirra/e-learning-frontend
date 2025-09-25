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
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { AddAssignmentPopup } from "@/components/complex/popups/addAssignmentPopup.tsx";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";

export function AddTaskPopup() {
  let [selectedClass, setSelectedClass] = useState<SelectableItem[]>([]);
  let [selectedStudent, setSelectedStudent] = useState<SelectableItem[]>([]);
  let [selectedTaskType, setSelectedTaskType] = useState<SelectableItem[]>([]);
  //TODO: download data from backend
  let availableClasses = [
    { className: "class1", classId: "course1_id" },
    { className: "class2", classId: "course2_id" },
  ];
  let availableStudents = [
    { studentName: "student1", studentId: "student1_id" },
    { studentName: "student2", studentId: "student2_id" },
  ];
  let [addAssignmentOpen, setAddAssignmentOpen] = useState<string | null>(null);
  let [addQuizOpen, setAddQuizOpen] = useState(false);
  let [selectAssignmentOpen, setSelectAssignmentOpen] = useState(false);
  let [selectQuizOpen, setSelectQuizOpen] = useState(false);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"ghost"}>
            <icons.Plus />
            Add
          </Button>
        </DialogTrigger>
        <DialogContent className={"sm:max-w-[425px]"}>
          <DialogHeader>
            <DialogTitle>Add new task to class</DialogTitle>
            <DialogDescription>Choose class and task type</DialogDescription>
          </DialogHeader>
          <div className={"flex flex-col gap-4"}>
            {/*//TODO: sformatować ładnie*/}
            <FilterDropdown
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
            <FilterDropdown
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

            <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
              <Button
                disabled={
                  selectedTaskType.length == 0 ||
                  selectedClass.length == 0 ||
                  selectedStudent.length == 0
                }
                onSelect={() => {
                  selectedTaskType && selectedClass && selectedStudent
                    ? selectedTaskType[0].name == "quiz"
                      ? openQuizLibrary(selectedClass[0].value)
                      : openAssignmentLibrary(selectedClass[0].value)
                    : null;
                }}
              >
                Copy existent
              </Button>
              <AddAssignmentPopup />
              <Button
                variant={"outline"}
                disabled={
                  selectedTaskType.length == 0 ||
                  selectedClass.length == 0 ||
                  selectedStudent.length == 0
                }
                onSelect={() => {
                  selectedTaskType && selectedClass && selectedStudent
                    ? selectedTaskType[0].name == "quiz"
                      ? openAddQuiz(selectedClass[0].value)
                      : {}
                    : // : setAddAssignmentOpen(selectedClass[0].value)
                      null;
                }}
              ></Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      {/*<AddAssignmentPopup*/}
      {/*  classId={addAssignmentOpen}*/}
      {/*  setOpen={setAddAssignmentOpen}*/}
      {/*/>*/}
    </>
  );
}
