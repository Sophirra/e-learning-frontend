import { useState } from "react";
import { useParams } from "react-router-dom";
import { Content } from "@/components/ui/content.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";

export type AssignmentBrief = {
  id?: string;
  name: string;
  courseName: string;
  className?: string;
  status: string;
  graded: boolean;
  grade?: number;
  comments?: string;
  instruction?: string;
  files?: AssignmentFile[];
};

type AssignmentFile = {
  id?: string;
  name: string;
  path: string;
  type: "solution" | "content";
};

export function AssignmentPage() {
  let { user } = useUser();

  return (
    <div className="bg-white h-screen">
      <NavigationBar />
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
