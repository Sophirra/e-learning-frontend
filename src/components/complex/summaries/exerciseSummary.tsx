import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { AddExercisePopup } from "@/components/complex/popups/exercise/addExercisePopup.tsx";
import type { Exercise } from "@/api/types.ts";
import { CreateExercisePopup } from "@/components/complex/popups/exercise/createExercisePopup.tsx";

export function ExerciseSummary({
  student,
  exercises,
  classId,
}: {
  exercises: Exercise[];
  student: boolean;
  classId?: string;
}) {
  function composeTaskDetails(exercise: Exercise) {
    let statusLabel = "";
    if (exercise.status == "Unsolved") {
      statusLabel = "To be solved";
    } else if (exercise.status == "SolutionAdded") {
      if (student) {
        statusLabel = "Solution added";
      } else {
        statusLabel = "To be solved";
      }
    } else if (exercise.status == "Submitted") {
      if (student) {
        statusLabel = "Waiting for grade";
      } else {
        statusLabel = "To be graded";
      }
    } else if (exercise.status == "Graded") {
      statusLabel = "Graded " + exercise.grade;
      if (exercise.comments) {
        statusLabel += " (" + exercise.comments + ")";
      } else {
        statusLabel = exercise.comments ?? "No grade found";
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
      {/*<div className="flex flex-col gap-2">*/}
      {exercises === null || exercises?.length === 0 ? (
        <Label className="mt-2 ml-4">
          No exercises available for the selected courses/classes
        </Label>
      ) : (
        exercises?.map((exercise) => (
          <div
            className={"flex flex-row gap-0"}
            key={exercise.id}
            style={{ width: "100%" }}
          >
            {classId && exercise.status === "Unsolved" ? (
              <CreateExercisePopup
                classId={classId}
                selectedExercise={exercise}
                editing={false}
              />
            ) : (
              <Button variant={"link"} className={"w-300px"}>
                {exercise.name}:
              </Button>
            )}
            <Label>{composeTaskDetails(exercise)}</Label>
          </div>
        ))
      )}
      {/*</div>*/}
    </Summary>
  );
}
