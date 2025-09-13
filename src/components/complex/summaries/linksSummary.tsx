import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import type { CourseBrief } from "@/components/complex/studentDetailsCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Link } from "react-router-dom";

export interface LinkProps {
  id?: string;
  isMeeting?: boolean;
  path: string;
}

export function LinksSummary({ links }: { links: LinkProps[] }) {
  return (
    <Summary label={"Links"} labelIcon={icons.Link} canHide={true}>
      {links.map((link: LinkProps) => (
        <div
          className={"flex flex-row gap-0 pl-2"}
          //meeting links do not have ids
          key={link.isMeeting ? "0" : link.id}
          style={{ width: "100%" }}
        >
          {link.isMeeting ? (
            <Label className={"w-300px"}>Join meeting:</Label>
          ) : null}
          <Link to={link.path}>
            {" "}
            <Button variant={"link"}>{link.path}</Button>{" "}
          </Link>
        </div>
      ))}
    </Summary>
  );
}
