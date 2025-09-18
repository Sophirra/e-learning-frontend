import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog.tsx";
import { useState } from "react";
import {
  FilterDropdown,
  type SelectableItem,
} from "@/components/complex/filterDropdown.tsx";

export type AnyTask = QuizTask | AssignmentTask;
interface TaskProps {
  id: string;
  name: string;
  completed: boolean;
  //TODO: tasks are downloaded by class/course, they do not point back to them
  courseName: string;
  className?: string;
}

interface QuizTask extends TaskProps {
  type: "quiz";
}

interface AssignmentTask extends TaskProps {
  type: "assignment";
  status: string;
  graded: boolean;
  grade?: number;
  comments?: string;
}

export function AssignmentSummary({
  assignments,
  student,
}: {
  assignments: AnyTask[];
  student: boolean;
}) {
  let [newTaskOpen, setNewTaskOpen] = useState(false);

  function composeTaskDetails(task: AnyTask) {
    let statusLabel = "";
    if (!task.completed) {
      statusLabel = "To be solved";
    } else if (task.type === "quiz") {
      statusLabel = "Completed";
    } else if (task.type === "assignment") {
      if (!task.graded) {
        statusLabel = "Waiting for grade";
      } else if (task.grade !== undefined) {
        statusLabel = "Graded " + task.grade;
        if (task.comments) statusLabel += " (" + task.comments + ")";
      } else {
        statusLabel = task.comments ?? "No grade found";
      }
    }
    return statusLabel;
  }

  return (
    <>
      <Summary
        label={"Assignments"}
        labelIcon={icons.ClipboardList}
        canHide={true}
        onAddButtonClick={
          !student
            ? undefined
            : () => {
                setNewTaskOpen(true);
              }
        }
      >
        {assignments
          ? assignments.map((task: AnyTask) => (
              <div
                className={"flex flex-row gap-0"}
                key={task.id}
                style={{ width: "100%" }}
              >
                <Button variant={"link"} className={"w-300px"}>
                  {task.name}:
                </Button>
                {/*HERE GET COURSE ASSIGNMENT BRIEF*/}
                <Label>{composeTaskDetails(task)}</Label>
              </div>
            ))
          : null}
      </Summary>
      <AddTaskPopup open={newTaskOpen} setOpen={setNewTaskOpen} />
    </>
  );
}

function AddTaskPopup({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTrigger>Add new task to class</DialogTrigger>
          <DialogDescription>Choose class and task type</DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4"}>
          {/*//TODO: naprawić żeby się nie zamykało przy wybieraniu wartości :')*/}
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
          <div className={"flex flex-row gap-4"}>
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
            <Button
              disabled={
                selectedTaskType.length == 0 ||
                selectedClass.length == 0 ||
                selectedStudent.length == 0
              }
              onSelect={() => {
                selectedTaskType && selectedClass && selectedStudent
                  ? selectedTaskType[0].name == "quiz"
                    ? openNewQuiz(selectedClass[0].value)
                    : openNewAssignment(selectedClass[0].value)
                  : null;
              }}
            >
              Create new
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
