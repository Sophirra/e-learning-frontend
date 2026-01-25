import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useUser } from "@/lib/user/UserContext.tsx";
import type { Exercise } from "@/types.ts";
import { AddSolutionFilePopup } from "@/components/complex/popups/files/addSolutionFilePopup.tsx";

export function ExerciseSolutionSummary({
  exercise,
}: {
  exercise: Exercise | null;
}) {
  const solutionFiles = exercise?.files?.filter(
    (file) => file.type === "solution",
  );
  const { user } = useUser();

  return (
    <Summary
      label={"Solution"}
      labelIcon={icons.FileTextIcon}
      canHide={false}
      customButton={
        user?.activeRole === "student" && !(exercise?.status == "SolutionAdded")
          ? () => <AddSolutionFilePopup exerciseId={exercise?.id ?? ""} />
          : undefined
      }
    >
      <div className="flex flex-col gap-2 p-2 text-xs font-normal ml-1">
        {solutionFiles?.length === 0 || solutionFiles === undefined ? (
          <Label className="mt-2 ml-2 font-light">
            No attached files found for this exercise.
          </Label>
        ) : (
          solutionFiles?.map((file) => (
            <div className="flex flex-row gap-0 pl-2" key={file.id}>
              <a
                href={`${import.meta.env.VITE_API_URL}/${file.path}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="link">{file.name}</Button>
              </a>
              <Label className="font-light">
                uploaded{" "}
                {file?.uploadDate &&
                  new Date(file.uploadDate).toLocaleDateString("pl-PL", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
              </Label>
            </div>
          ))
        )}
      </div>
    </Summary>
  );
}
