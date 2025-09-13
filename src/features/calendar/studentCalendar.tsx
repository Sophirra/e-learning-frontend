import { useState } from "react";
import { useParams } from "react-router-dom";
import { Content } from "@/components/ui/content.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import type { CourseBrief } from "@/components/complex/studentDetailsCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import ClassTile from "@/components/complex/classTile.tsx";

export function StudentCalendar() {
  let { user } = useUser();
  let [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  let courses: CourseBrief[] = [
    //todo: GET FROM API
    { id: "1", name: "one" },
    { id: "2", name: "two" },
    { id: "3", name: "three" },
  ];

  return (
    <Content>
      <div className="flex flex-row gap-4">
        <CourseFilter
          courses={courses}
          setSelectedCourseId={setSelectedCourseId}
          selectedCourseId={selectedCourseId}
        />
        <Button variant={"outline"}>
          Setup new class <icons.Plus />
          {/*
        TODO: should open a popup with course selection (already selected
          if single course is filtered) and class slot picker
        */}
        </Button>
      </div>
      <div className="flex flex-row gap-8">
        {/*overflow-y-auto">*/}
        <div className="w-1/4 sticky top-0 align-self-flex-start h-fit">
          <ClassTile
            state={"upcoming"}
            date={new Date(Date.now())}
            title={"name"}
            duration={40}
          />
        </div>

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
  );
}
