import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import type { CourseBrief } from "@/components/complex/studentDetailsCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";

export function ChatSummary({ courses }: { courses: CourseBrief[] }) {
  return (
    <Summary label={"Chat"} labelIcon={icons.MessageSquare} canHide={true}>
      {courses.map((course: CourseBrief) => (
        <div
          className={"flex flex-row gap-0"}
          key={course.id}
          style={{ width: "100%" }}
        >
          <Button variant={"link"} className={"w-300px"}>
            {course.name}:
          </Button>
          {/*HERE GET COURSE RELATED CHATS LAST MESSAGES*/}
          <Label>No new messages</Label>
        </div>
      ))}
    </Summary>
  );
}
