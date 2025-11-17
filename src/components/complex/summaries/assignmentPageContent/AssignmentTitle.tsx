import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import type {
  AssignmentBrief,
  Mode,
} from "@/pages/UserPages/AssignmentPage.tsx";
import { useUser } from "@/features/user/UserContext.tsx";

export function AssignmentTitle({
  assignment,
  pageMode,
  setPageMode,
}: {
  assignment: AssignmentBrief | null;
  pageMode: Mode;
  setPageMode: (mode: Mode) => void;
}) {
  const { user } = useUser();

  return (
    <Summary
      label={assignment?.name || "Untitled Assignment"}
      labelIcon={icons.Clipboard}
      canHide={false}
      customButton={() =>
        user?.activeRole === "student" ? (
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => {
              console.log("Submitting assignment:", assignment?.id);
            }}
          >
            Submit
            <icons.Send className="w-4 h-4" />
          </Button>
        ) : user?.activeRole === "teacher" && pageMode === "view" ? (
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => {
              console.log("Submitting assignment:", assignment?.id);
              setPageMode("edit");
            }}
          >
            Edit assignment
            <icons.Pen className="w-4 h-4" />
          </Button>
        ) : (
          // When teacher is in edit mode
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => {
              console.log("Submitting assignment:", assignment?.id);
              setPageMode("view");
            }}
          >
            Save
            <icons.Save className="w-4 h-4" />
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-2 p-2 text-xs font-light ml-2 pl-2">
        {assignment?.instruction ? (
          <Label className="font-light">{assignment.instruction}</Label>
        ) : (
          <Label className="font-light">
            No instructions provided for this assignment.
          </Label>
        )}
      </div>
    </Summary>
  );
}
