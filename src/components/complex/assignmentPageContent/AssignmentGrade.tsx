import {iconLibrary as icons} from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import {Label} from "@/components/ui/label.tsx";
import type {AssignmentBrief} from "@/pages/UserPages/AssignmentPage.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useUser} from "@/features/user/UserContext.tsx";

export function AssignmentGrade({
                                    assignment,
                                }: {
    assignment: AssignmentBrief;
}) {
    const {user} = useUser();

    return (
        <Summary
            label={"Grades"}
            labelIcon={icons.PenTool}
            canHide={false}
            customButton={() => (
                user?.activeRole === "teacher" ? (
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                        onClick={() => {
                            // ...
                        }}
                    >
                        Add
                        <icons.Plus className="w-4 h-4"/>
                    </Button>
                ) : null
            )}
        >
            <div className="flex flex-col gap-2 p-2 text-xs font-normal ml-1">
                {assignment.graded && assignment.grade !== undefined ? (
                    <div
                        className="flex flex-row gap-0 ml-2 mt-2"
                    >
                        <Label className="mr-4">
                            {assignment.grade}
                        </Label>
                        <Label className="font-light">
                            {assignment?.comments}
                        </Label>
                    </div>
                ) : (
                    <Label className="mt-2 ml-2 font-light">No grade yet.</Label>
                )}
            </div>
        </Summary>
    );
}
