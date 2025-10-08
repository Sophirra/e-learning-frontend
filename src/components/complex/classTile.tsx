import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { format } from "date-fns";
import type { JSX } from "react";

export interface ClassTileProps {
  id: string;
  state: "upcoming" | "ongoing" | "completed";
  date: Date;
  title?: string;
  duration: number;
}

export default function ClassTile({
  id,
  state,
  date,
  title,
  duration,
  selectedClassId,
  setSelectedClassId,
}: ClassTileProps & {
  selectedClassId: string | null;
  setSelectedClassId: (classId: string | null) => void;
}) {
  const iconMap: Record<string, JSX.Element> = {
    upcoming: <icons.Calendar />,
    ongoing: <icons.Clock />,
    completed: <icons.Check />,
  };
  date.getTimezoneOffset();

  const handleSelect = () => {
    if (selectedClassId == id) {
      setSelectedClassId(null);
    } else {
      setSelectedClassId(id);
    }
  };

  const timeFinished = new Date(date);
  timeFinished.setMinutes(timeFinished.getMinutes() + duration);
  return (
    <div
      className={
        "flex flex-row items-center gap-2 p-4 bg-slate-100 rounded-lg shadow-md hover:bg-slate-200 transition-all " +
        (selectedClassId == id ? "bg-slate-300 font-semibold" : "font-normal")
      }
      key={id}
      onClick={() => handleSelect()}
    >
      <p>{iconMap[state] ?? null}</p>
      <p className={"text-gray-600"}>{format(date, "dd.MM")}</p>
      <p>
        {format(date, "HH:mm")}-{format(timeFinished, "HH:mm")}
      </p>
      {title && (
        <p className={"self-end"}>
          {(title + title).length > 10
            ? (title + title).slice(0, 10) + "..."
            : title}
        </p>
      )}
    </div>
  );
}
