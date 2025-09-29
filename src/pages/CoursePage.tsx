import { Button } from "@/components/ui/button.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  FilterDropdown,
  type SelectableItem,
} from "@/components/complex/filterDropdown.tsx";
import { Content } from "@/components/ui/content.tsx";
import { TeacherDetailsCard } from "@/components/complex/teacherDetailsCard.tsx";
import type {
  Course,
  Teacher,
  TeacherAvailability,
  TeacherReview,
} from "@/api/types.ts";
import { CourseDetailCard } from "@/features/course/courseDetailCard.tsx";
import WeekScheduleDialog from "@/components/complex/weekSchedule.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { toast } from "sonner";
import OpinionCard from "@/components/complex/opinionCard";
import { SearchBar } from "@/components/complex/searchBar.tsx";

/**
 * CoursePage component displays detailed information about a specific course.tsx
 * and allows switching between class setup and course.tsx details views.
 * It includes filtering options for language, level, and price,
 * as well as a detailed card showing course.tsx information.
 */

export function CoursePage() {
  const location = useLocation();
  const { teacherId } = location.state || {};
  const API_URL = import.meta.env.VITE_API_URL;

  let { user } = useUser();
  /** The course.tsx identifier extracted from the URL parameters */
  const { courseId } = useParams();
  /** To be downloaded from backend*/
  const [course, setCourse] = useState<Course | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [teacherReviews, setTeacherReviews] = useState<TeacherReview[] | null>(
    null,
  );
  const [teacherAvailability, setTeacherAvailability] = useState<
    TeacherAvailability[] | null
  >(null);
  /** Using string array because filter dropdown is universal*/
  let [selectedLanguage, setSelectedLanguage] = useState<SelectableItem[]>([]);
  let [selectedLevel, setSelectedLevel] = useState<SelectableItem[]>([]);

  //TODO: wszystkie calle do oddzielnego pliku i z wykorzystaniem api.ts
  useEffect(() => {
    if (!teacherId) return;

    fetch(`${API_URL}/api/teacher/${teacherId}`)
      .then((res) => res.json())
      .then((teacherdata: Teacher) => {
        setTeacher(teacherdata);
        console.log("Fetched Teacher:", teacherdata);
      })
      .catch((err) => {
        console.error("Error fetching Teacher:", err);
        toast.error("Could not load Teacher data.");
      });
  }, [teacherId]);

  useEffect(() => {
    if (!teacherId) return;

    const fetchTeacherReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/api/teacher/${teacherId}/reviews`);
        if (!res.ok) throw new Error("Failed to fetch teacher reviews");
        const data: TeacherReview[] = await res.json();
        setTeacherReviews(data);
        console.log("Fetched teacher reviews:", data);
      } catch (err) {
        console.error("Error fetching teacher reviews:", err);
        toast.error("Could not load teacher reviews.");
      }
    };

    fetchTeacherReviews();
  }, [teacherId]);

  useEffect(() => {
    if (!teacherId) return;

    const fetchAvailability = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/teacher/${teacherId}/availability`,
        );
        if (!res.ok) throw new Error("Failed to fetch teacher availability");
        const data: TeacherAvailability[] = await res.json();
        setTeacherAvailability(data);
        console.log("Fetched availability:", data);
      } catch (err) {
        console.error("Error fetching teacher availability:", err);
        toast.error("Could not load teacher availability.");
      }
    };

    fetchAvailability();
  }, [teacherId]);

  useEffect(() => {
    if (!courseId) return;

    fetch(`${API_URL}/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((courseData: Course) => {
        setCourse(courseData);
        console.log("Fetched course:", courseData);
      })
      .catch((err) => {
        console.error("Error fetching course:", err);
        toast.error("Could not load course data.");
      });
  }, [courseId]);

  const selectedVariant =
    course?.variants.find(
      (v) =>
        v.languageName === selectedLanguage[0]?.value &&
        v.levelName === selectedLevel[0]?.value,
    ) ?? null;

  return (
    <div className="bg-white h-screen">
      <SearchBar />
      <Content>
        <div className="flex flex-row gap-8">
          <div className="w-1/4 sticky top-0 align-self-flex-start h-fit">
            <TeacherDetailsCard
              id={teacherId}
              name={`${teacher?.name ?? ""} ${teacher?.surname ?? ""}`}
              image={
                teacher?.teacherProfilePictureUrl ??
                "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
              }
              description={teacher?.description ?? ""}
              courses={teacher?.coursesBrief ?? []}
              availability={
                teacherAvailability
                  ?.slice(0, 7)
                  .map((day) => day.timeslots.length) ?? []
              }
            />
          </div>

          <div className="w-3/4 space-y-8">
            <CourseDetailCard
              id={"1"}
              name={course?.name}
              description={course?.description}
              teacherId={teacherId}
              thumbnailUrl={course?.profilePictureUrl}
              variants={[]} //optional
            />
            <div className="flex flex-wrap items-end gap-4 mb-8">
              <div className="flex-1 flex gap-4">
                <FilterDropdown
                  key="language"
                  placeholder="Choose language"
                  emptyMessage="No language found."
                  items={[
                    ...new Map(
                      (course?.variants ?? []).map((c) => [
                        c.languageName,
                        {
                          name: c.languageName,
                          value: c.languageName,
                        },
                      ]),
                    ).values(),
                  ]}
                  multiselect={false}
                  searchable={false}
                  reset={false}
                  onSelectionChange={setSelectedLanguage}
                />
                <FilterDropdown
                  key="level"
                  placeholder="Choose level"
                  emptyMessage="No level found."
                  items={[
                    ...new Map(
                      (course?.variants ?? []).map((c) => [
                        c.levelName,
                        {
                          name: c.levelName,
                          value: c.levelName,
                        },
                      ]),
                    ).values(),
                  ]}
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
                  {selectedLanguage.length === 0 || selectedLevel.length === 0
                    ? "Select language and level first."
                    : selectedVariant
                      ? `Price: ${selectedVariant.price} $`
                      : "No variant found for selection."}
                </Button>
              </div>
              <WeekScheduleDialog
                disabled={
                  selectedLanguage.length === 0 ||
                  selectedLevel.length === 0 ||
                  !selectedVariant
                }
                availability={teacherAvailability ?? []}
                onConfirm={(slot) => {
                  console.log("Wybrany slot:", slot);
                }}
                classDetails={
                  selectedVariant
                    ? `${selectedLevel[0].value ?? ""} ${course?.name ?? ""} class in ${selectedLanguage[0].value ?? ""}`
                    : undefined
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-8 ">
              {teacherReviews?.map((review) => (
                <OpinionCard
                  //TODO: dodać id do review - potrzebny bo korzystamy z listy
                  key={review.id}
                  authorName={
                    review.reviewerName + " " + review.reviewerSurname
                  }
                  rating={review.starsNumber}
                  maxRating={5}
                  content={review.content}
                />
              ))}
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
}
