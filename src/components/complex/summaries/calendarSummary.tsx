import {iconLibrary as icons} from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import type {CourseBrief} from "@/api/types.ts";
import {Link, useNavigate} from "react-router-dom";

export function CalendarSummary({courses}: { courses: CourseBrief[] }) {
    const navigate = useNavigate();

    return (
        <Summary label="Calendar" labelIcon={icons.Calendar} canHide={true}>
            {courses === null || courses.length === 0 ? (
                <div
                    key="no-classes-key"
                    className="flex flex-row gap-0"
                    style={{width: "100%"}}
                >
                    <Label className="ml-4 mt-2">No upcoming classes</Label>
                </div>
            ) : (
                courses.map((course) => (
                    <div
                        key={`${course.courseId}}`}
                        className="flex flex-row gap-0"
                        style={{width: "100%"}}
                    >
                        <Button variant="link" className="w-300px" asChild>
                            <Link to={`/calendar?courseId=${encodeURIComponent(course.courseId)}`}>
                                {course.courseName}
                            </Link>
                        </Button>
                        <Label>
                            {`${course.startTime.toLocaleDateString("pl", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                            })} at ${course.startTime.toLocaleTimeString("pl", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false
                            })}`}
                        </Label>
                    </div>
                ))
            )}
        </Summary>
    );
}

