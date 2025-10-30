import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { AssignmentBrief } from "@/pages/UserPages/AssignmentPage.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import type { FileData } from "@/api/types.ts";

export function AssignmentSolution({
  assignment,
}: {
  assignment: AssignmentBrief;
}) {
  const solutionFiles = assignment.files?.filter(
    (file) => file.type === "solution",
  );
  const { user } = useUser();

  return (
    <Summary
      label={"Solution"}
      labelIcon={icons.FileTextIcon}
      canHide={false}
      customButton={
        user?.activeRole === "student"
          ? () => (
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => {
                  // ...
                }}
              >
                Add
                <icons.Plus className="w-4 h-4" />
              </Button>
            )
          : undefined
      }
    >
      <div className="flex flex-col gap-2 p-2 text-xs font-normal ml-1">
        {solutionFiles?.length === 0 || solutionFiles === undefined ? (
          <Label className="mt-2 ml-2 font-light">
            No attached files found for this assignment.
          </Label>
        ) : (
          solutionFiles?.map((file) => (
            <div className="flex flex-row gap-0 pl-2" key={file.id}>
              <a href={file.path} target="_blank" rel="noopener noreferrer">
                <Button variant="link" className="pl-0">
                  {file.name}
                </Button>
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
