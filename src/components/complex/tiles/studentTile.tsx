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
  const { id, name, surname } = student;

  const handleSelect = () => {
    setSelectedStudentId(selectedStudentId === id ? null : id);
  };
  return (
    <div
      className={
        "flex flex-row items-center gap-2 p-4 bg-slate-100 rounded-lg shadow-md hover:bg-slate-200 transition-all text-xs " +
        (selectedStudentId === id
          ? "bg-slate-300 font-semibold"
          : "font-normal")
      }
      key={id}
      onClick={handleSelect}
    >
      <p className="self-end">{name + " " + surname}</p>
    </div>
  );
}
