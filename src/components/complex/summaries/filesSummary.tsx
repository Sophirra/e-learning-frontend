import Summary from "@/components/complex/summaries/summary.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { icons } from "lucide-react";
import { AddFilePopup } from "@/components/complex/popups/addFilePopup.tsx";

export type FileLink = {
  id?: string;
  courseName: string;
  filePath: string;
  className?: string;
};

export type FileProps = {
  id: string;
  name: string;
  filePath: string;
  associatedCourseName: string;
  associatedClassDate: string;
};

export function FilesSummary({
  classId,
  files,
  lastCount,
  student,
}: {
  classId?: string;
  files: FileProps[];
  lastCount: number;
  student: boolean;
}) {
  const displayedFiles = files.slice(-lastCount);

  return (
    <Summary
      label={"Files shared"}
      labelIcon={icons.File}
      canHide={true}
      customButton={
        student || !classId ? undefined : () => AddFilePopup(classId)
      }
    >
      <div className="flex flex-col gap-2 pl-2">
        {displayedFiles.length === 0 ? (
          <Label className="mt-2 ml-2">
            No files available for the selected courses/classes
          </Label>
        ) : (
          displayedFiles.map((file) => (
            <div
              className="flex flex-row gap-0 pl-2"
              key={
                file.associatedCourseName.replace(/\s/g, "") +
                file.associatedClassDate +
                file.id
              }
            >
              <Label>
                {file.associatedCourseName} [
                {file.associatedClassDate.substring(0, 10)}]
              </Label>
              <a href={file.filePath} target="_blank" rel="noopener noreferrer">
                <Button variant="link">{file.name}</Button>
              </a>
            </div>
          ))
        )}
      </div>
    </Summary>
  );
}
