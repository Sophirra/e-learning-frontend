import {
  InnerDialog,
  InnerDialogContent,
  InnerDialogDescription,
  InnerDialogFooter,
  InnerDialogHeader,
  InnerDialogTitle,
  InnerDialogTrigger,
  InnerDialogClose,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { UploadFilePopup } from "@/components/complex/popups/UploadFilePopup.tsx";
import { Label } from "@/components/ui/label.tsx";

export function AddAssignmentPopup() {
  // let [uploadFileOpen, setUploadFileOpen] = useState(false);
  return (
    <InnerDialog>
      <InnerDialogTrigger asChild>
        <Button>Create new</Button>
      </InnerDialogTrigger>
      <InnerDialogContent className={"sm:max-w-[425px]"}>
        <InnerDialogHeader>
          <InnerDialogTitle>Create new assignment</InnerDialogTitle>
          <InnerDialogDescription>
            Choose class and task type
          </InnerDialogDescription>
        </InnerDialogHeader>
        <div className={"flex flex-col gap-4"}>
          <Label>Title</Label>
          <Input id={"title"} type={"text"} disabled={false} />
          <Label>Description</Label>
          <Input id={"descr"} type={"text"} />
          <Label>Additional file</Label>
          <div>
            <Button>Choose from library</Button>
            <UploadFilePopup />
            {/*<Button onSelect={() => setUploadFileOpen(true)}>*/}
            {/*  Upload new file*/}
            {/*</Button>*/}
          </div>
          <InnerDialogFooter
            className={"flex flex-row gap-4 sm:justify-center"}
          >
            <InnerDialogClose asChild>
              <Button>Cancel</Button>
            </InnerDialogClose>
            <Button variant={"outline"} onSelect={() => {}}>
              Create
            </Button>
          </InnerDialogFooter>
        </div>
      </InnerDialogContent>
    </InnerDialog>
  );
}
