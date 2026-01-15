import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { AddQuizPopup } from "@/components/complex/popups/quiz/addQuizPopup.tsx";
import type { QuizBrief } from "@/types.ts";

export function QuizSummary({
  quizzes,
  student,
  classId,
}: {
  quizzes: QuizBrief[];
  student: boolean;
  classId?: string;
}) {
  function composeTaskDetails(quiz: QuizBrief) {
    let statusLabel = "";
    if (!quiz.completed) {
      statusLabel = "To be solved";
    } else {
      statusLabel = "Completed";
    }

    return statusLabel;
  }

  return (
    <Summary
      label={"Quizzes"}
      labelIcon={icons.Brain}
      canHide={true}
      customButton={() =>
        student ? undefined : !classId ? (
          <Button variant={"ghost"} disabled={true}>
            <icons.Plus />
            Add
          </Button>
        ) : (
          <AddQuizPopup classId={classId} />
        )
      }
    >
      <div className="flex flex-col gap-2">
        {quizzes === null || quizzes?.length === 0 ? (
          <Label className="mt-2 ml-4">
            No quizzes available for the selected courses/classes
          </Label>
        ) : (
          quizzes?.map((task: QuizBrief) => (
            <div
              className={"flex flex-row gap-0"}
              key={task.id}
              style={{ width: "100%" }}
            >
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
