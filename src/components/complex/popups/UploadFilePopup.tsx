import {
  InnerDialog,
  InnerDialogClose,
  InnerDialogContent,
  InnerDialogDescription,
  InnerDialogFooter,
  InnerDialogHeader,
  InnerDialogTitle,
  InnerDialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@radix-ui/react-label";

export function UploadFilePopup() {
  return (
    <InnerDialog>
      <InnerDialogTrigger asChild>
        <Button>Upload new file FROM INNER</Button>
      </InnerDialogTrigger>
      <InnerDialogContent className={"sm:max-w-[425px] z-40"} data-inner-dialog>
        <InnerDialogHeader>
          <InnerDialogTitle>Upload new file</InnerDialogTitle>
          <InnerDialogDescription></InnerDialogDescription>
        </InnerDialogHeader>
        <Label>Choose file</Label>
        {/*<Input type={"file"} />*/}
        <InnerDialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <InnerDialogClose asChild>
            <Button>Cancel</Button>
          </InnerDialogClose>
          <Button variant={"outline"} onSelect={() => {}}>
            Upload
          </Button>
        </InnerDialogFooter>
      </InnerDialogContent>
    </InnerDialog>
  );
}
