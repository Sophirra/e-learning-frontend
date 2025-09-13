import type { TimestampSecondsParser } from "date-fns/parse/_lib/parsers/TimestampSecondsParser";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { format } from "date-fns";

export interface ClassTileProps {
  selected?: boolean;
  state: "upcoming" | "ongoing" | "completed";
  date: Date; //with time
  title?: string;
  duration: number;
}

export default function ClassTile({
  state,
  date,
  title,
  duration,
}: ClassTileProps) {
  let iconMap: Record<string, JSX.Element> = {
    upcoming: <icons.Calendar />,
    ongoing: <icons.Clock />,
    completed: <icons.Check />,
  };
  return (
    <div
      className="flex flex-row items-center gap-2 p-4 bg-slate-100 rounded-lg shadow-md hover:bg-slate-200 transition-all"
      key={title}
    >
      <p>{iconMap[state] ?? null}</p>
      <p>{format(date, "dd.MM")}</p>
      <p>
        {format(date, "HH:mm")} -
        {format(date.setMinutes(date.getMinutes() + duration), " HH:mm")}
      </p>
      {title && <p className={"self-end"}>{title}</p>}
    </div>
  );
}
