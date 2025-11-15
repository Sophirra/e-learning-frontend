import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";

export function ChatSummary() {
  return (
    <Summary label={"Chat"} labelIcon={icons.MessageSquare} canHide={true}>
      <div
        className={"flex flex-row gap-0"}
        key="temp"
        style={{ width: "100%" }}
      >
        <Button disabled={true} variant={"link"} className={"w-300px"}>
          Feature coming soon
        </Button>
      </div>
    </Summary>
  );
}
