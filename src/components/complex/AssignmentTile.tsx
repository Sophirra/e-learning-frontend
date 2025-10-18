import { format } from "date-fns";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import type { AssignmentBrief } from "@/pages/UserPages/AssignmentPage.tsx";

type AssignmentTileProps = {
  assignment: AssignmentBrief;
  selectedAssignmentId: string | null;
  setSelectedAssignmentId: (id: string | null) => void;
};

export default function AssignmentTile({
  assignment,
  selectedAssignmentId,
  setSelectedAssignmentId,
}: AssignmentTileProps) {
  const { id, name, date, status } = assignment;

  const handleSelect = () => {
    setSelectedAssignmentId(selectedAssignmentId === id ? null : id);
  };

  const getStatusIcon = () => {
    switch (status) {
      case "graded":
        return <icons.PenTool />;
      case "solutionAdded":
        return <icons.Check />;
      case "submitted":
        return <icons.Check />;
      default: // unsolved
        return <icons.Star />;
    }
  };

  return (
    <div
      className={
        "flex flex-row items-center gap-2 p-4 bg-slate-100 rounded-lg shadow-md hover:bg-slate-200 transition-all text-xs " +
        (selectedAssignmentId === id
          ? "bg-slate-300 font-semibold"
          : "font-normal")
      }
      key={id}
      onClick={handleSelect}
    >
      <p>{getStatusIcon()}</p>
      <p>{date ? format(date, "dd.MM") : "--.--"}</p>
      <p className="self-end">{name}</p>
    </div>
  );
}
