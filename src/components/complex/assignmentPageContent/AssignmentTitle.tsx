import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { AssignmentBrief } from "@/pages/UserPages/AssignmentPage.tsx";

export function AssignmentTitle({
  assignment,
}: {
  assignment: AssignmentBrief;
}) {
  return (
    <Summary
      label={assignment.name}
      labelIcon={icons.Clipboard}
      canHide={false}
      customButton={() => (
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => {
            console.log("Submitting assignment:", assignment.id);
          }}
        >
          Submit
          <icons.Send className="w-4 h-4" />
        </Button>
      )}
    >
      <div className="flex flex-col gap-2 p-2 text-xs font-light ml-2 pl-2">
        {assignment.instruction ? (
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
