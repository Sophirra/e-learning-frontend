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
import { UploadFilePopup } from "@/components/complex/popups/uploadFilePopup.tsx";
import { CopyAssignmentPopup } from "@/components/complex/popups/assignments/copyAssignmentPopup.tsx";
import { CopyQuizPopup } from "@/components/complex/popups/assignments/copyQuizPopup.tsx";

export type PopupType =
  | "addTask"
  | "addAssignment"
  | "uploadFile"
  | "addQuiz"
  | "copyAssignment"
  | "copyQuiz";

export function AddTaskPopup() {
  let [openedPopup, setOpenedPopup] = useState<PopupType>("addTask");

  function AddTaskPopupContent({
    setOpenedPopup,
  }: {
    setOpenedPopup: (val: PopupType) => void;
  }) {
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
    let [selectedTaskType, setSelectedTaskType] = useState<SelectableItem[]>(
      [],
    );
    return (
      <div className={"sm:max-w-[425px]"}>
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
          <FilterDropdown
            key={"taskType"}
            disabled={selectedStudent.length == 0 || selectedClass.length == 0}
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
              onClick={() => {
                selectedTaskType && selectedClass && selectedStudent
                  ? selectedTaskType[0].name == "Quiz"
                    ? setOpenedPopup("copyQuiz")
                    : setOpenedPopup("copyAssignment")
                  : null;
              }}
            >
              Copy existent
            </Button>
            <Button
              variant={"outline"}
              disabled={
                selectedTaskType.length == 0 ||
                selectedClass.length == 0 ||
                selectedStudent.length == 0
              }
              onClick={() => {
                console.log(selectedTaskType, selectedClass, selectedStudent);
                selectedTaskType && selectedClass && selectedStudent
                  ? selectedTaskType[0].name == "Quiz"
                    ? setOpenedPopup("addQuiz")
                    : setOpenedPopup("addAssignment")
                  : // : setAddAssignmentOpen(selectedClass[0].value)
                    null;
                console.log("changed to", openedPopup);
              }}
            >
              Create new
            </Button>
          </DialogFooter>
        </div>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          onClick={() => {
            setOpenedPopup("addTask");
          }}
        >
          <icons.Plus />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className={"sm:max-w-[425px]"}>
        {openedPopup === "addTask" && (
          <AddTaskPopupContent setOpenedPopup={setOpenedPopup} />
        )}
        {openedPopup === "addAssignment" && (
          <AddAssignmentPopup setOpenedPopup={setOpenedPopup} />
        )}
        {openedPopup === "uploadFile" && (
          <UploadFilePopup setOpenedPopup={setOpenedPopup} />
        )}
        {openedPopup === "copyAssignment" && (
          <CopyAssignmentPopup setOpenedPopup={setOpenedPopup} />
        )}
        {openedPopup === "copyQuiz" && (
          <CopyQuizPopup setOpenedPopup={setOpenedPopup} />
        )}
      </DialogContent>
    </Dialog>
  );
}
