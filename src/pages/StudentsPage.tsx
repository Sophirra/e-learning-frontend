import { useState } from "react";
import { useParams } from "react-router-dom";
import { Content } from "@/components/ui/content.tsx";
import { TeacherDetailsCard } from "@/components/complex/teacherDetailsCard.tsx";
import type { Course } from "@/features/course/course.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { NavigationHeader } from "@/components/complex/navigationHeader.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { StudentDetailsCard } from "@/components/complex/studentDetailsCard.tsx";
/**
 * CoursePage component displays detailed information about a specific course.tsx
 * and allows switching between class setup and course.tsx details views.
 * It includes filtering options for language, level, and price,
 * as well as a detailed card showing course.tsx information.
 */
export function StudentsPage() {
  let { user } = useUser();
  let sampleCourse = {
    id: "1",
    name: "GameDev",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    thumbnailUrl:
      "https://i.pinimg.com/736x/ee/2a/71/ee2a7149341c2b23ae2e9c7358ec247d.jpg",
    teacherId: "1",
  };
  /** The course.tsx identifier extracted from the URL parameters */
  let { courseId } = useParams();
  /** To be downloaded from backend*/
  // let [course, setCourse] = useState<Course>(sampleCourse);
  /** Using string array because filter dropdown is universal*/

  return (
    <div className="bg-white h-screen">
      <NavigationHeader />
      <Content>
        <div className="flex flex-row gap-8">
          {/*overflow-y-auto">*/}
          <div className="w-1/4 sticky top-0 align-self-flex-start h-fit">
            <StudentDetailsCard
              id={"1"}
              name={"Alice Green"}
              image={
                "https://i.pinimg.com/736x/af/f0/1c/aff01cea24b478bec034cf412406dbe5.jpg"
              }
              courses={[
                { id: "1", name: "one" },
                { id: "2", name: "two" },
                { id: "3", name: "three" },
              ]}
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
    </div>
  );
}
