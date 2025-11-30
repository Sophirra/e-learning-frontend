import { format } from "date-fns";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import type { Exercise } from "@/api/types.ts";

type ExerciseTileProps = {
  exercise: Exercise;
  selectedExerciseId: string | null;
  setSelectedExerciseId: (id: string | null) => void;
};

export default function ExerciseTile({
  exercise,
  selectedExerciseId,
  setSelectedExerciseId,
}: ExerciseTileProps) {
  const { id, name, date, status } = exercise;

  const handleSelect = () => {
    setSelectedExerciseId(id);
  };

  const getStatusIcon = () => {
    switch (status) {
      case "Graded":
        return <icons.PenTool />;
      case "SolutionAdded":
        return <icons.Check />;
      case "Submitted":
        return <icons.Check />;
      default: // unsolved
        return <icons.Star />;
    }
  };

  return (
    <div
      className={
        "flex flex-row items-center gap-2 p-4 bg-slate-100 rounded-lg shadow-md hover:bg-slate-200 transition-all text-xs " +
        (selectedExerciseId === id
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
