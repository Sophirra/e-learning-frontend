import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { Exercise } from "@/types.ts";

export function ExerciseAttachedFilesSummary({
  exercise,
  // pageMode,
}: {
  exercise: Exercise | null;
  // pageMode: Mode;
}) {
  const convertFileNameToConvenientName = (fileName: string): string => {
    // Remove file extension
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

    // Remove the first part before the underscore
    const parts = nameWithoutExtension.split("_");
    const relevantPart =
      parts.length > 1 ? parts.slice(1).join("_") : nameWithoutExtension;

    // Splt by underscores, spaces, or camelCase transitions
    const words = relevantPart
      .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase → camel Case
      .replace(/[_\s]+/g, " ") // zamień podkreślenia i wielokrotne spacje na pojedyncze
      .trim()
      .split(" ");

    // Capitalize the first letter of each word and lowercase the rest
    const formatted = words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    return formatted;
  };

  const contentFiles = exercise?.files?.filter(
    (file) => file.type === "content",
  );

  return (
    <Summary
      label={"Attached Files"}
      labelIcon={icons.FileTextIcon}
      canHide={false}
      // customButton={
      //   user?.activeRole === "teacher" && pageMode === "edit"
      //     ? () => AddExerciseFilePopup(exercise?.id)
      //     : undefined
      // }
    >
      <div className="flex flex-col gap-2 p-2 text-xs font-normal ml-1">
        {contentFiles?.length === 0 || contentFiles === undefined ? (
          <Label className="mt-2 ml-2 font-light">
            No attached files found for this exercise.
          </Label>
        ) : (
          contentFiles?.map((file) => (
            <div className="flex flex-row gap-0 pl-2" key={file.id}>
              <Label>{convertFileNameToConvenientName(file.name)}</Label>
              <a
                href={`${import.meta.env.VITE_API_URL}/${file.name}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="link">{file.name}</Button>
              </a>
              {/*<a href={file.path} target="_blank" rel="noopener noreferrer">*/}
              {/*  <Button variant="link">{file.name}</Button>*/}
              {/*</a>*/}
              {/*{user?.activeRole === "teacher" && pageMode === "edit" && (*/}
              {/*  <Button>*/}
              {/*    <icons.Trash2></icons.Trash2>*/}
              {/*    Remove*/}
              {/*  </Button>*/}
              {/*)}*/}
            </div>
          ))
        )}
      </div>
    </Summary>
  );
}
