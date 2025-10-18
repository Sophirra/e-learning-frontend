import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogContent,
  Dialog,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { DialogTrigger } from "@radix-ui/react-dialog";

export function UploadFilePopup() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"}>Upload new file</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload new file</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4 pt-2"}>
          <Label>Choose file:</Label>
          <Input type={"file"} />

          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            <Button variant={"outline"} onSelect={() => {}}>
              Upload
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
