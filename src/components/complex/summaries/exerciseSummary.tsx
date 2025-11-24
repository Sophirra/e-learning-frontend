import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { AddExercisePopup } from "@/components/complex/popups/exercise/addExercisePopup.tsx";
import type { AnyTask } from "@/api/types.ts";

export function ExerciseSummary({
  student,
  exercises,
  classId,
}: {
  exercises: AnyTask[];
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
    <Summary
      label={"Exercises"}
      labelIcon={icons.ClipboardList}
      canHide={true}
      customButton={() =>
        student ? undefined : !classId ? (
          <Button variant={"ghost"} disabled={true}>
            <icons.Plus />
            Add
          </Button>
        ) : (
          <AddExercisePopup classId={classId} />
        )
      }
    >
      <div className="flex flex-col gap-2">
        {exercises === null || exercises?.length === 0 ? (
          <Label className="mt-2 ml-4">
            No exercises available for the selected courses/classes
          </Label>
        ) : (
          exercises?.map((task: AnyTask) => (
            <div
              className={"flex flex-row gap-0"}
              key={task.id}
              style={{ width: "100%" }}
            >
              {/*{classId && (*/}
              {/*  <CreateExercisePopup*/}
              {/*    classId={classId}*/}
              {/*    editingExercise={{ task }}*/}
              {/*  />*/}
              {/*)}*/}
              <Button variant={"link"} className={"w-300px"}>
                {task.name}:
              </Button>
              <Label>{composeTaskDetails(task)}</Label>
            </div>
          ))
        )}
      </div>
    </Summary>
  );
}
