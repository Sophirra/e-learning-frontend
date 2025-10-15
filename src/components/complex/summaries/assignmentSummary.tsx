import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { AddTaskPopup } from "@/components/complex/popups/assignments/addTaskPopup.tsx";

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
  classId,
}: {
  assignments: AnyTask[];
  student: boolean;
  classId?: string;
}) {
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
        customButton={student ? undefined : () => AddTaskPopup(classId)}
      >
        <div className="flex flex-col gap-2">
          {assignments === null || assignments?.length === 0 ? (
            <Label className="mt-2 ml-4">
              No assignments available for the selected courses/classes
            </Label>
          ) : (
            assignments?.map((task: AnyTask) => (
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
          )}
        </div>
      </Summary>
    </>
  );
}
