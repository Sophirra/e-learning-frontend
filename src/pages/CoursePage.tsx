import { Button } from "@/components/ui/button.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { FilterDropdown } from "@/components/complex/filterDropdown.tsx";
import { Header } from "@/components/complex/header.tsx";
import { Content } from "@/components/ui/content.tsx";
import { TeacherDetailsCard } from "@/components/complex/teacherDetailsCard.tsx";
import type { Course } from "@/features/course/course.tsx";
import { CourseDetailCard } from "@/features/course/courseDetailCard.tsx";
import WeekScheduleDialog from "@/components/complex/weekSchedule.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { toast } from "sonner";
import OpinionCard from "@/components/complex/opinionCard";
/**
 * CoursePage component displays detailed information about a specific course.tsx
 * and allows switching between class setup and course.tsx details views.
 * It includes filtering options for language, level, and price,
 * as well as a detailed card showing course.tsx information.
 */
export function CoursePage() {
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
  const { courseId } = useParams();
  /** Current view state, toggles between class setup and course.tsx details views */
  const [classSetup, setClassSetup] = useState<true | false>(false);
  /** To be downloaded from backend*/
  let [course, setCourse] = useState<Course>(sampleCourse);
  let [courses, setCourses] = useState<Course[]>([]);
  /** Using string array because filter dropdown is universal*/
  let [selectedLanguage, setSelectedLanguage] = useState<string[]>([]);
  let [selectedLevel, setSelectedLevel] = useState<string[]>([]);
  let sampleAvailability = {
    0: [
      [9, 12],
      [14, 17],
    ], // Monday
    1: [
      [10, 12],
      [15, 18],
    ], // Tuesday
    2: [], // Wednesday - no availability
    3: [
      [8, 12],
      [15, 21],
    ], // Thursday
    4: [
      [9, 11],
      [13, 16],
    ], // Friday
    5: [], // Saturday - no availability
    6: [], // Sunday - no availability
  };
  let handleClassSetup = () => {
    // if (!user) {
    //   toast.error("You must be logged in to setup a class.");
    // } else {
    setClassSetup(true);
    // toast.success("Class setup successful.");
    // }
  };
  return (
    <div className="bg-white h-screen">
      <Header />
      <Content>
        <div className="flex flex-row gap-8">
          {/*overflow-y-auto">*/}
          <div className="w-1/4 sticky top-0 align-self-flex-start h-fit">
            <TeacherDetailsCard
              id={"1"}
              name={"John Doee"}
              image={
                "https://i.pinimg.com/736x/af/f0/1c/aff01cea24b478bec034cf412406dbe5.jpg"
              }
              description={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              }
              coursesIds={["1", "2", "3"]}
              availability={[5, 4, 0, 5, 2, 0, 0]}
            />
          </div>

          <div className="w-3/4 space-y-8">
            <CourseDetailCard
              id={"1"}
              name={sampleCourse.name}
              description={sampleCourse.description}
              teacherId={sampleCourse.teacherId}
              thumbnailUrl={sampleCourse.thumbnailUrl}
              variants={[]} //optional
            />
            <div className="flex flex-wrap items-end gap-4 mb-8">
              <div className="flex-1 flex gap-4">
                <FilterDropdown
                  key="language"
                  placeholder="Choose language"
                  emptyMessage="No language found."
                  //do pobrania z dostarczonej kolekcji wariantów
                  items={["English", "Spanish", "French", "German", "Japanese"]}
                  multiselect={false}
                  searchable={false}
                  reset={false}
                  onSelectionChange={setSelectedLanguage}
                />
                <FilterDropdown
                  key="level"
                  placeholder="Choose level"
                  emptyMessage="No level found."
                  //do pobrania z dostarczonej kolekcji wariantów
                  items={["Beginner", "Intermediate", "Advanced"]}
                  multiselect={false}
                  searchable={false}
                  reset={false}
                  onSelectionChange={setSelectedLevel}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-[180px] justify-between pointer-events-none hover:bg-inherit focus:bg-inherit"
                  aria-disabled="true"
                >
                  {/*Tutaj należy pobrać cenę z wariantu*/}
                  {selectedLanguage.length == 0 || selectedLevel.length == 0
                    ? "Select language and level first."
                    : "Price from variant"}
                </Button>
              </div>
              <Button
                onClick={() => handleClassSetup()}
                disabled={
                  selectedLanguage.length == 0 || selectedLevel.length == 0
                }
              >
                Setup class
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-8 ">
              {Array.from({ length: 12 }).map((_, i) => (
                <OpinionCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </Content>
      <WeekScheduleDialog
        open={classSetup}
        onOpenChange={() => setClassSetup(false)}
        availability={sampleAvailability}
        onConfirm={() => false}
        classDetails={`${selectedLevel[0] ?? ""} ${course?.name ?? ""} class in ${selectedLanguage[0] ?? ""}`}
      />
    </div>
  );
}
