import type { StudentBrief } from "@/types.ts";

type StudentTileProps = {
  student: StudentBrief;
  selectedStudentId: string | undefined;
  setSelectedStudentId: (id: string | undefined) => void;
};

export function StudentTile({
  student,
  selectedStudentId,
  setSelectedStudentId,
}: StudentTileProps) {
  console.log("student in tile:", student);

  const handleSelect = () => {
    setSelectedStudentId(
      selectedStudentId === student.id ? undefined : student.id,
    );
  };
  return (
    <div
      className={
        "flex flex-row items-center gap-2 p-4 bg-slate-100 rounded-lg shadow-md hover:bg-slate-200 transition-all text-xs " +
        (selectedStudentId === student.id
          ? "bg-slate-300 font-semibold"
          : "font-normal")
      }
      key={student.id}
      onClick={handleSelect}
    >
      <p className="self-end">{student.name + " " + student.surname}</p>
    </div>
  );
}
