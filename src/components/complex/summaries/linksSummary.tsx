import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Link } from "react-router-dom";
import { AddLinkPopup } from "@/components/complex/popups/addLinkPopup.tsx";
import type { LinkProps } from "@/types.ts";

export function LinksSummary({
  links,
  classId,
  student,
}: {
  links: LinkProps[];
  classId?: string;
  student: boolean;
}) {
  return (
    <Summary
      label={"Links"}
      labelIcon={icons.Link}
      canHide={true}
      customButton={student ? undefined : () => AddLinkPopup(classId)}
    >
      <div className="flex flex-col gap-2 pl-2">
        {links.length === 0 ? (
          <Label className="mt-2 ml-2">
            No links available for the selected courses/classes
          </Label>
        ) : (
          links.map((link: LinkProps) => (
            <div
              className="flex flex-row gap-0 pl-2"
              // meeting links do not have ids
              key={link.isMeeting ? "0" : link.id}
              style={{ width: "100%" }}
            >
              <Label>
                {link.courseName +
                  (link.className ? " " + link.className : "") +
                  (link.isMeeting ? " - join meeting:" : ": ")}
              </Label>
              <Link to={link.path}>
                <Button variant="link">{link.path}</Button>
              </Link>
            </div>
          ))
        )}
      </div>
    </Summary>
  );
}
