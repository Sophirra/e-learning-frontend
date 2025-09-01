import {Button} from "@/components/ui/button.tsx";
import {iconLibrary as icons} from "@/components/iconLibrary.tsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useLocation} from "react-router-dom";
import {FilterDropdown} from "@/components/complex/filterDropdown.tsx";
import {Header} from "@/components/complex/header.tsx";
import {Content} from "@/components/ui/content.tsx";
import {TeacherDetailsCard} from "@/components/complex/teacherDetailsCard.tsx";
import type {Course, Teacher, TeacherAvailability, TeacherReview} from "@/api/types.ts";
import {CourseDetailCard} from "@/features/course/courseDetailCard.tsx";
import WeekScheduleDialog from "@/components/complex/weekSchedule.tsx";
import {useUser} from "@/features/user/UserContext.tsx";
import {toast} from "sonner";
import OpinionCard from "@/components/complex/opinionCard";

/**
 * CoursePage component displays detailed information about a specific course.tsx
 * and allows switching between class setup and course.tsx details views.
 * It includes filtering options for language, level, and price,
 * as well as a detailed card showing course.tsx information.
 */

export function CoursePage() {
    const location = useLocation();
    const {teacherId} = location.state || {};

    let {user} = useUser();
    /** The course.tsx identifier extracted from the URL parameters */
    const {courseId} = useParams();
    /** Current view state, toggles between class setup and course.tsx details views */
    const [classSetup, setClassSetup] = useState<true | false>(false);
    /** To be downloaded from backend*/
    const [course, setCourse] = useState<Course | null>(null);
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [teacherReviews, setTeacherReviews] = useState<TeacherReview[] | null>(null);
    const [teacherAvailability, setTeacherAvailability] = useState<TeacherAvailability[] | null>(null);

    let [courses, setCourses] = useState<Course[]>([]);
    /** Using string array because filter dropdown is universal*/
    let [selectedLanguage, setSelectedLanguage] = useState<string[]>([]);
    let [selectedLevel, setSelectedLevel] = useState<string[]>([]);

    useEffect(() => {
        if (!teacherId) return;

        fetch(`http://localhost:5249/api/Teacher/${teacherId}`)
            .then((res) => res.json())
            .then((teacherdata: Teacher) => {
                setTeacher(teacherdata);
                console.log("Fetched Theacher:", teacherdata);
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
                const res = await fetch(`http://localhost:5249/api/Teacher/${teacherId}/reviews`);
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
                const res = await fetch(`http://localhost:5249/api/Teacher/${teacherId}/availability`);
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

        fetch(`http://localhost:5249/api/Courses/${courseId}`)
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
            <Header/>
            <Content>
                <div className="flex flex-row gap-8">
                    {/*overflow-y-auto">*/}
                    <div className="w-1/4 sticky top-0 align-self-flex-start h-fit">
                        <TeacherDetailsCard
                            id={"1"}
                            name={teacher?.name + " " + teacher?.surname}
                            image={
                                "https://i.imgflip.com/2/8jeie7.jpg"
                            }
                            description={teacher?.description}
                            coursesIds={teacher?.coursesBrief.map(c => c.name) ?? []}
                            availability={teacherAvailability?.slice(0, 7).map(day => day.timeslots.length) ?? []
                            }
                        />
                    </div>

                    <div className="w-3/4 space-y-8">
                        <CourseDetailCard
                            id={"1"}
                            name={course?.name}
                            description={course?.description}
                            teacherId={teacherId} // do zmiany
                            thumbnailUrl={"https://us.123rf.com/450wm/luismolinero/luismolinero1901/luismolinero190105681/115486252-indian-with-turban-working-with-his-laptop.jpg"}
                            variants={[]} //optional
                        />
                        <div className="flex flex-wrap items-end gap-4 mb-8">
                            <div className="flex-1 flex gap-4">
                                <FilterDropdown
                                    key="language"
                                    placeholder="Choose language"
                                    emptyMessage="No language found."
                                    //do pobrania z dostarczonej kolekcji wariantów
                                    items={course?.variants.map(c => c.languageName) ?? []}
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
                                    items={course?.variants.map(c => c.levelName) ?? []}
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
                            {
                                teacherReviews?.map((review) => (
                                    <OpinionCard
                                        authorName={review.reviewerName + " " + review.reviewerSurname}
                                        rating={review.starsNumber}
                                        maxRating={5}
                                        content={review.content}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </Content>
            <WeekScheduleDialog
                open={classSetup}
                onOpenChange={() => setClassSetup(false)}
                availability={teacherAvailability ?? []} // <- tutaj przekazujesz dane z API
                onConfirm={(slot) => {
                    console.log("Wybrany slot:", slot);
                    // Możesz wysłać slot do backendu lub ustawić w stanie
                }}
                classDetails={`${selectedLevel[0] ?? ""} ${course?.name ?? ""} class in ${selectedLanguage[0] ?? ""}`}
            />

        </div>
    );
}