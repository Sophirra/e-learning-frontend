import { useState } from "react";
import { useParams } from "react-router-dom";
import { Content } from "@/components/ui/content.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { NavigationHeader } from "@/components/complex/navigationHeader.tsx";
import Summary from "@/components/complex/summary.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";

export function CalendarPage() {
  let { user } = useUser();

  return (
    <div className="bg-white h-screen">
      <NavigationHeader />
      <Content>
        <div className="flex flex-row gap-8">
          {/*overflow-y-auto">*/}
          <div className="w-1/4 sticky top-0 align-self-flex-start h-fit"></div>

          <div className="w-3/4 space-y-8">
            <Summary
              label={"temp"}
              labelIcon={icons.TempIcon}
              canHide={true}
              onAddButtonClick={() => {}}
            >
              content
            </Summary>
          </div>
        </div>
      </Content>
    </div>
  );
}
